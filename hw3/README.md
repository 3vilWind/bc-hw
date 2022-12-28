# Chainlink Data Feed Monitoring
Simple utility to track price updates from ethereum chainlink oracle feeds.

## Usage
 - Setup config.json in root
   - Fill in `nodeUrl` with your favourite eth node
   - Add or remove interesting feeds
 - `npm i`
 - `npm start`


## Output Sample
```
[2022-12-28T14:09:59.000Z|6268] 0.0047991862 LINK/ETH
[2022-12-28T14:33:23.000Z|39340] 1202.87 ETH/USD
[2022-12-28T14:50:23.000Z|8648] 0.000830294 USDT/ETH
[2022-12-28T14:55:23.000Z|39341] 1203.37 ETH/USD
[2022-12-28T15:29:47.000Z|39342] 1196.43 ETH/USD
[2022-12-28T15:40:35.000Z|8649] 0.000839172 USDT/ETH
[2022-12-28T15:55:23.000Z|39343] 1191.01 ETH/USD
[2022-12-28T16:55:23.000Z|39344] 1192.89 ETH/USD
[2022-12-28T17:55:23.000Z|39345] 1195.09 ETH/USD
```
