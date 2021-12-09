// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeFiToken is ERC20 {
    constructor() ERC20("DeFi Token", "DFT") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}