// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceFactory is Ownable {
    address public immutable tokenImplementation;
    
    event MarketplaceCreated(address indexed marketplace, string indexed name, address indexed creator);

    constructor(address _tokenImplementation) Ownable(msg.sender) {
        tokenImplementation = _tokenImplementation;
    }

    function createMarketplace(string memory name) external returns (address) {
        address clone = Clones.clone(tokenImplementation);
        emit MarketplaceCreated(clone, name, msg.sender);
        return clone;
    }
}
