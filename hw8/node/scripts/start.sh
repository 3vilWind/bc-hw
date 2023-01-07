#!/bin/bash

npx hardhat node &

sleep 10 && npx hardhat run --network localhost ./scripts/deploy.ts

wait