import './styles.scss'
import {CID, create} from "kubo-rpc-client"
import {Contract, ethers, Signer, Wallet} from "ethers";
import {IPFSHTTPClient} from "kubo-rpc-client/src/types";

const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "data",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "ipfs_hash",
                "type": "bytes32"
            }
        ],
        "name": "put",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
type Deps = { ipfs: IPFSHTTPClient, signer: Wallet, contract: Contract }

const jpegPlace = document.querySelector<HTMLElement>('#jpeg-place')!
const jpegInput = document.querySelector<HTMLInputElement>('#jpeg-input')!
const msg = document.querySelector<HTMLHeadingElement>('#msg')!
const updateBtn = document.querySelector<HTMLButtonElement>('#update-btn')!

const ipfsAdminUrl = document.querySelector<HTMLInputElement>('#ipfs-admin-url')!
const ethNodeUrl = document.querySelector<HTMLInputElement>('#eth-node-url')!
const privateKey = document.querySelector<HTMLInputElement>('#private-key')!
const contractAddress = document.querySelector<HTMLInputElement>('#contract-address')!

function initDefaults() {
    ipfsAdminUrl.value = 'http://localhost:5001'
    ethNodeUrl.value = 'http://localhost:8545'
    privateKey.value = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'
    contractAddress.value = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
}

function resolveDependencies(): Deps {
    const ipfs = create({url: ipfsAdminUrl.value})
    const provider = new ethers.providers.JsonRpcProvider({url: ethNodeUrl.value})
    const signer = new ethers.Wallet(privateKey.value, provider)
    const contract = new ethers.Contract(contractAddress.value, abi)

    return {ipfs, signer, contract}
}

async function putWithSHA256({ipfs}: { ipfs: IPFSHTTPClient }, data: ArrayBuffer) {
    const {cid} = await ipfs.add(data, {hashAlg: 'sha2-256'})
    return cid.multihash.digest
}

function sha256ToCid(hash: Uint8Array): CID {
    const buf = new Uint8Array(34)
    buf[0] = 18
    buf[1] = 32
    buf.set(hash, 2)
    return CID.decode(buf)
}

async function downloadByCid({ipfs}: { ipfs: IPFSHTTPClient }, cid: CID): Promise<Uint8Array> {
    const data = []
    for await (const chunk of ipfs.cat(cid)) {
        data.push(chunk)
    }
    const result: Uint8Array = new Uint8Array(data.reduce((acc, cur) => acc + cur.length, 0))
    let offset = 0
    for (const x of data) {
        result.set(x, offset)
        offset += x.length
    }
    return result
}

function setImage(file: Uint8Array, cid: CID) {
    jpegPlace.innerHTML = ''
    const img = document.createElement('img')
    img.src = URL.createObjectURL(new Blob([file.buffer], {type: 'image/png'}))
    jpegPlace.appendChild(img)
    msg.innerText = `This is your beautiful jpeg!\nCID: ${cid.toString()}`
}

function clearImage() {
    jpegPlace.innerHTML = ''
    msg.innerText = 'You don\'t have jpeg, upload it now!'
}

async function putHash({contract, signer}: { contract: Contract, signer: Signer }, hash: Uint8Array) {
    await contract.connect(signer).put(hash)
}

async function checkContract({contract, signer}: { contract: Contract, signer: Wallet }): Promise<Uint8Array | null> {
    const hash = await contract.connect(signer).data(signer.address)
    const res = fromHexString(hash.slice(2))
    if (res.reduce((acc, cur) => acc + cur, 0) === 0) {
        return null
    }
    return res
}

const fromHexString = (hexString: string) =>
    Uint8Array.from(hexString.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));


async function checkUpdateImage(deps: Deps): Promise<void> {
    const hash = await checkContract(deps)
    if (hash != null) {
        const cid = sha256ToCid(hash)
        const file = await downloadByCid(deps, cid)
        setImage(file, cid)
    } else {
        clearImage()
    }
}

clearImage()
initDefaults()
checkUpdateImage(resolveDependencies()).then()

jpegInput.addEventListener('change', async (event) => {
    const deps = resolveDependencies()
    const data = await (event.target as any).files[0].arrayBuffer()
    const hash = await putWithSHA256(deps, data)
    await putHash(deps, hash)
    await checkUpdateImage(deps)
})

updateBtn.addEventListener('click', async () => {
    await checkUpdateImage(resolveDependencies())
})
