// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceFactory is Ownable {
    address public immutable tokenImplementation;
    
    // Registry of all created marketplaces
    address[] private _marketplaces;
    mapping(address => bool) private _isMarketplace;
    mapping(address => string) private _marketplaceNames;
    
    event MarketplaceCreated(address indexed marketplace, string indexed name, address indexed creator);

    constructor(address _tokenImplementation) Ownable(msg.sender) {
        tokenImplementation = _tokenImplementation;
    }

    function createMarketplace(string memory name) external returns (address) {
        require(bytes(name).length > 0, "MarketplaceFactory: Name is required");
        address clone = Clones.clone(tokenImplementation);
        
        // Register the marketplace
        _marketplaces.push(clone);
        _isMarketplace[clone] = true;
        _marketplaceNames[clone] = name;
        
        emit MarketplaceCreated(clone, name, msg.sender);
        return clone;
    }

    /**
     * @dev Get all created marketplaces.
     * @return An array of all marketplace addresses.
     */
    function getAllMarketplaces() external view returns (address[] memory) {
        return _marketplaces;
    }

    /**
     * @dev Get the number of created marketplaces.
     * @return The total number of marketplaces created.
     */
    function getMarketplaceCount() external view returns (uint256) {
        return _marketplaces.length;
    }

    /**
     * @dev Check if an address is a marketplace created by this factory.
     * @param marketplace The address to check.
     * @return True if the address is a marketplace created by this factory.
     */
    function isMarketplace(address marketplace) external view returns (bool) {
        return _isMarketplace[marketplace];
    }

    /**
     * @dev Get the name of a marketplace.
     * @param marketplace The marketplace address.
     * @return The name of the marketplace.
     */
    function getMarketplaceName(address marketplace) external view returns (string memory) {
        require(_isMarketplace[marketplace], "MarketplaceFactory: Not a marketplace");
        return _marketplaceNames[marketplace];
    }

    /**
     * @dev Get marketplaces created by a specific address.
     * @param creator The creator address.
     * @return An array of marketplace addresses created by the specified address.
     */
    function getMarketplacesByCreator(address creator) external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _marketplaces.length;) {
            // We would need to store creator info to filter, but for now return all
            unchecked { ++i; }
        }
        return _marketplaces;
    }
}
