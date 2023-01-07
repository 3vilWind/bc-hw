# Deploy ERC20. Create uniswap pair. Swap.

## Run test
```shell
set/export ALCHEMY_TOKEN=XXX
npx hardhat test
```

```
MyToken deployed!
owner have 100.137975 USDC
owner have 100 MyToken
swapper have 100 USDC

Added liquidity to uniswap:
owner have 0.137975 USDC
owner have 0 MyToken

Swapped 100 USDC for MyToken
swapper have 0 USDC
swapper have 49.9248873309965 MyToken
  √ Deploy, transfer & swap (9149ms)

  1 passing (9s)
```

## Local node usage

#### Run local node
```shell
npx hardhat node
```

#### Deploy MyToken
```shell
set/export OWNER_ADDRESS=XXX
npx hardhat run scripts/deployToken.ts
```

#### Add Liquidity
```shell
set/export OWNER_ADDRESS=XXX
set/export TOKEN1_ADDRESS=XXX
set/export TOKEN1_AMOUNT=100
set/export TOKEN2_ADDRESS=XXX
set/export TOKEN2_AMOUNT=100
npx hardhat run scripts/addLiquidity.ts
```

#### Swap Tokens
```shell
set/export OWNER_ADDRESS=XXX
set/export FROM_TOKEN_ADDRESS=XXX
set/export FROM_TOKEN_AMOUNT=100
set/export TO_TOKEN_ADDRESS=XXX
npx hardhat run scripts/swapTokens.ts
```
