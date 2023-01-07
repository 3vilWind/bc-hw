// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Storage {
    mapping(address => bytes32) public data;

    function put(bytes32 ipfs_hash) public {
        data[msg.sender] = ipfs_hash;
    }
}
