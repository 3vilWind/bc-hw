import {expect} from "chai"
import {ethers} from "hardhat"
import {addLiquidity, deployMyToken, getERC20Balance, swapTokens} from "../scripts/utils"


const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const usdcHolderAddress = '0xF977814e90dA44bFA03b6295A0616a897441aceC'


it("Deploy, transfer & swap", async function () {
    const [owner, swapper] = await ethers.getSigners()
    const usdcHolder = await ethers.getImpersonatedSigner(usdcHolderAddress)

    const myToken = await deployMyToken(owner)
    console.log('MyToken deployed!')

    const usdcToken = await ethers.getContractAt('ERC20', usdcAddress)

    const usdcAmount = ethers.utils.parseUnits('100', await usdcToken.decimals())
    const myTokenAmount = ethers.utils.parseUnits('100', await myToken.decimals())

    await usdcToken
        .connect(usdcHolder)
        .transfer(owner.address, usdcAmount)
    await usdcToken
        .connect(usdcHolder)
        .transfer(swapper.address, usdcAmount)

    console.log(`owner have ${await getERC20Balance(usdcToken, owner.address)} USDC`)
    console.log(`owner have ${await getERC20Balance(myToken, owner.address)} MyToken`)
    console.log(`swapper have ${await getERC20Balance(usdcToken, swapper.address)} USDC\n`)

    await addLiquidity(usdcToken, usdcAmount, myToken, myTokenAmount, owner)

    console.log('Added liquidity to uniswap:')
    console.log(`owner have ${await getERC20Balance(usdcToken, owner.address)} USDC`)
    console.log(`owner have ${await getERC20Balance(myToken, owner.address)} MyToken\n`)

    expect(await getERC20Balance(myToken, swapper.address)).equal(0)

    await swapTokens(usdcToken, usdcAmount, myToken, swapper)
    expect(await getERC20Balance(usdcToken, swapper.address)).equal(0)
    expect(await getERC20Balance(myToken, swapper.address)).greaterThan(0)

    console.log('Swapped 100 USDC for MyToken')
    console.log(`swapper have ${await getERC20Balance(usdcToken, swapper.address)} USDC`)
    console.log(`swapper have ${await getERC20Balance(myToken, swapper.address)} MyToken`)
})

