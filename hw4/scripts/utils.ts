import {BigNumber, Contract, Signer} from "ethers";
import {ethers} from "hardhat";
import {ERC20} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {time} from "@nomicfoundation/hardhat-network-helpers";

const {abi: UniswapRouterAbi} = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const {abi: UniswapFactoryAbi} = require('@uniswap/v2-core/build/UniswapV2Factory.json');
const UniswapRouterMainNet = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

export async function getUniswapContracts(): Promise<{ uniswapRouter: Contract, uniswapFactory: Contract }> {
    const uniswapRouter = await ethers.getContractAt(
        UniswapRouterAbi as any[],
        UniswapRouterMainNet
    );
    const uniswapFactory = await ethers.getContractAt(
        UniswapFactoryAbi,
        await uniswapRouter.factory()
    );
    return {uniswapRouter, uniswapFactory}
}

export async function getERC20Balance(contract: ERC20, address: string): Promise<number> {
    return parseFloat(ethers.utils.formatUnits(await contract.balanceOf(address), await contract.decimals()))
}

export async function swapTokens(fromToken: ERC20, fromAmount: BigNumber,
                                 toToken: ERC20, owner: SignerWithAddress): Promise<void> {
    const {uniswapRouter} = await getUniswapContracts()
    await fromToken
        .connect(owner)
        .approve(uniswapRouter.address, fromAmount)
    await uniswapRouter
        .connect(owner)
        .swapExactTokensForTokens(
            fromAmount,
            0,
            [fromToken.address, toToken.address],
            owner.address,
            (await time.latest()) + 60 * 10
        )
}

export async function addLiquidity(token1: ERC20, token1Amount: BigNumber,
                                   token2: ERC20, token2Amount: BigNumber,
                                   owner: SignerWithAddress): Promise<void> {
    const {uniswapRouter} = await getUniswapContracts()

    await token1
        .connect(owner)
        .approve(uniswapRouter.address, token1Amount)
    await token2
        .connect(owner)
        .approve(uniswapRouter.address, token2Amount)
    await uniswapRouter
        .connect(owner)
        .addLiquidity(
            token1.address,
            token2.address,
            token1Amount,
            token2Amount,
            0,
            0,
            owner.address,
            (await time.latest()) + 60 * 10
        )
}

export async function deployMyToken(owner: Signer): Promise<ERC20> {
    const MyToken = await ethers.getContractFactory('MyToken')
    const myToken = await MyToken.connect(owner).deploy()
    await myToken.deployed()

    return myToken
}
