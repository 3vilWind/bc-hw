import {getERC20Balance, swapTokens} from "./utils";
import {ethers} from "hardhat";


async function main() {
    const ownerAddress = process.env.OWNER_ADDRESS as string
    const fromTokenAddress = process.env.FROM_TOKEN_ADDRESS as string
    const toTokenAddress = process.env.TO_TOKEN_ADDRESS as string

    const owner = await ethers.getImpersonatedSigner(ownerAddress)
    const fromToken = await ethers.getContractAt('ERC20', fromTokenAddress)
    const toToken = await ethers.getContractAt('ERC20', toTokenAddress)

    const fromAmount = ethers.utils.parseUnits(process.env.FROM_TOKEN_AMOUNT as string, await fromToken.decimals())

    await swapTokens(fromToken, fromAmount, toToken, owner)

    console.log(`Successfully swapped! Current balances:`)
    console.log(`${await getERC20Balance(fromToken, ownerAddress)} ${await fromToken.symbol()}`)
    console.log(`${await getERC20Balance(toToken, ownerAddress)} ${await toToken.symbol()}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
