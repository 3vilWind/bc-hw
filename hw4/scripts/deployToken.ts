import {ethers} from 'hardhat'
import {deployMyToken} from "./utils";


async function main() {
    const ownerAddress = process.env.OWNER_ADDRESS as string

    const owner = await ethers.getImpersonatedSigner(ownerAddress)
    const myToken = await deployMyToken(owner)
    console.log(`MyToken successfully deployed at ${myToken.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
