import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"
import {ethers} from "hardhat"
import {expect} from "chai"

describe("FlashLoan", function () {
    async function deployFlashLoan() {
        const [owner] = await ethers.getSigners()

        const FlashLoan = await ethers.getContractFactory("FlashLoan")
        const flashLoan = await FlashLoan.deploy("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
        await flashLoan.deployed()

        return {flashLoan, owner}
    }

    it("Do flashloan swaps, check loss", async function () {
        const {owner, flashLoan} = await loadFixture(deployFlashLoan)

        const whale = await ethers.getImpersonatedSigner("0x57757E3D981446D585Af0D9Ae4d7DF6D64647806")
        const WETH = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")

        await WETH.connect(whale).transfer(flashLoan.address, ethers.utils.parseEther("1"))

        const beforeBalance = parseFloat(ethers.utils.formatEther(await WETH.balanceOf(flashLoan.address)))

        await flashLoan.connect(owner).flashLoan()

        const afterBalance = parseFloat(ethers.utils.formatEther(await WETH.balanceOf(flashLoan.address)))

        expect(beforeBalance).not.equal(afterBalance)
        console.log(`Swapped 1 WETH (WETH -> LINK -> USDT -> WETH), got ${beforeBalance - afterBalance} WETH loss`)
    })
})
