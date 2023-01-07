import {addLiquidity} from "./utils"
import {ethers} from "hardhat";


async function main() {
    const ownerAddress = process.env.OWNER_ADDRESS as string
    const token1Address = process.env.TOKEN1_ADDRESS as string
    const token2Address = process.env.TOKEN2_ADDRESS as string

    const owner = await ethers.getImpersonatedSigner(ownerAddress)
    const token1 = await ethers.getContractAt('ERC20', token1Address)
    const token2 = await ethers.getContractAt('ERC20', token2Address)

    const token1Amount = ethers.utils.parseUnits(process.env.TOKEN1_AMOUNT as string, await token1.decimals())
    const token2Amount = ethers.utils.parseUnits(process.env.TOKEN2_AMOUNT as string, await token2.decimals())

    await addLiquidity(token1, token1Amount, token2, token2Amount, owner)

    console.log('Successfully added liquidity!')
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
