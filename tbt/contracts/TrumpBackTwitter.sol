// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20, ERC20Permit} from "@soliditylabs/erc20-permit/contracts/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrumpBackTwitter is ERC20Permit, Ownable {
    bytes32 private _merkleRoot;

    constructor (uint256 initialSupply) ERC20("Trump Back on Twitter", "TBT") {
        _mint(msg.sender, initialSupply);
    }

    function claim() public isValidMerkleProof(merkleProof, _merkleRoot) {
        require(tx.origin == msg.sender);

        _mint(msg.sender, 1);
        // Will transfer owner to Elon later
        _mint(_owner, 1);
    }

    function setMerkleRoot(bytes32 newRoot) external onlyOwner {
        _merkleRoot = newRoot;
    }

    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address not in allow list"
        )
        _;
    }
}