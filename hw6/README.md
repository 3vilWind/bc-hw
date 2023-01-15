# Swaps with flashloan
Use AAVE(v2) flashloan to cyclic swap with uniswap (WETH -> LINK -> USDT -> WETH).

## Run tests
Set your alchemy key in `hardhat.config.ts`

```npx hardhat test```

### Sample output
```
  FlashLoan
Swapped 1 WETH (WETH -> LINK -> USDT -> WETH), got 0.8704076439484165 WETH loss
    √ Do flashloan swaps, check loss (21556ms)


  1 passing (22s)
```
