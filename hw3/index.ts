import Web3 from "web3"
import fs from 'fs'

class OracleFeed {
    name: string;
    address: string;
    decimalPoint: number;
    fractionDigits: number;

    constructor(name: string, address: string, decimalPoint: number, roundPoint: number) {
        this.name = name
        this.address = address
        this.decimalPoint = decimalPoint
        this.fractionDigits = roundPoint
    }
}

function subscribeToOracleFeed(web3: Web3, feed: OracleFeed) {
    web3.eth.subscribe('logs', {
            address: feed.address,
            topics: [
                web3.eth.abi.encodeEventSignature('AnswerUpdated(int256,uint256,uint256)')
            ],
            fromBlock: 'latest'
        },
        (_, log) => {
            const decoded = web3.eth.abi.decodeLog([{
                type: 'int256',
                name: 'current',
                indexed: true
            }, {
                type: 'uint256',
                name: 'roundId',
                indexed: true
            }, {
                type: 'uint256',
                name: 'updatedAt'
            }], log.data, log.topics.slice(1))
            const currentPrice = web3.utils.toNumber(decoded.current) / (Math.pow(10, feed.decimalPoint))
            const updateTime = new Date(web3.utils.toNumber(decoded.updatedAt) * 1000)
            console.log(`[${updateTime.toISOString()}|${decoded.roundId}] ${currentPrice.toFixed(feed.fractionDigits)} ${feed.name}`)
        })
}

function main() {
    const config = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf-8'}))
    const nodeUrl = config.nodeUrl

    const feeds = config.feeds as OracleFeed[]

    const web3 = new Web3(nodeUrl)
    for (const feed of feeds) {
        subscribeToOracleFeed(web3, feed)
    }
}

main()
