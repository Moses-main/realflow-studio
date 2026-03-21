// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketplaceFactory
 * @author RealFlow Studio
 * @notice A factory contract for creating ERC-1155 marketplace clones using EIP-1167 minimal proxies.
 * @dev Deploys minimal proxy clones of a token implementation for gas-efficient marketplace creation.
 *      Tracks all created marketplaces for enumeration and verification.
 */
contract MarketplaceFactory is Ownable {
    /// @notice The address of the token implementation used for cloning
    /// @dev All marketplace clones will delegate calls to this implementation
    address public immutable tokenImplementation;
    
    /// @notice Array of all created marketplace addresses
    address[] private _marketplaces;
    
    /// @notice Mapping to check if an address is a marketplace created by this factory
    mapping(address => bool) private _isMarketplace;
    
    /// @notice Mapping to store the name of each marketplace
    mapping(address => string) private _marketplaceNames;
    
    /// @notice Mapping to store the creator of each marketplace
    mapping(address => address) private _marketplaceCreators;

    /// @notice Emitted when a new marketplace is created
    /// @param marketplace The address of the created marketplace clone
    /// @param name The name of the marketplace
    /// @param creator The address that created the marketplace
    event MarketplaceCreated(address indexed marketplace, string indexed name, address indexed creator);

    /**
     * @notice Initializes the MarketplaceFactory contract
     * @dev Sets the token implementation address for cloning
     * @param _tokenImplementation The address of the token implementation to clone
     */
    constructor(address _tokenImplementation) Ownable(msg.sender) {
        tokenImplementation = _tokenImplementation;
    }

    /**
     * @notice Create a new marketplace by deploying a clone of the token implementation
     * @dev Uses EIP-1167 minimal proxy pattern for gas efficiency.
     *      The created marketplace is registered in the factory's registry.
     * @param name The name of the marketplace (must not be empty)
     * @return The address of the newly created marketplace clone
     */
    function createMarketplace(string memory name) external returns (address) {
        require(bytes(name).length > 0, "MarketplaceFactory: Name is required");
        address clone = Clones.clone(tokenImplementation);
        
        // Register the marketplace
        _marketplaces.push(clone);
        _isMarketplace[clone] = true;
        _marketplaceNames[clone] = name;
        _marketplaceCreators[clone] = msg.sender;
        
        emit MarketplaceCreated(clone, name, msg.sender);
        return clone;
    }

    /**
     * @notice Get all created marketplaces
     * @return An array of all marketplace addresses
     */
    function getAllMarketplaces() external view returns (address[] memory) {
        return _marketplaces;
    }

    /**
     * @notice Get the number of created marketplaces
     * @return The total number of marketplaces created by this factory
     */
    function getMarketplaceCount() external view returns (uint256) {
        return _marketplaces.length;
    }

    /**
     * @notice Check if an address is a marketplace created by this factory
     * @param marketplace The address to check
     * @return True if the address is a marketplace created by this factory
     */
    function isMarketplace(address marketplace) external view returns (bool) {
        return _isMarketplace[marketplace];
    }

    /**
     * @notice Get the name of a marketplace
     * @dev Reverts if the address is not a marketplace created by this factory
     * @param marketplace The marketplace address
     * @return The name of the marketplace
     */
    function getMarketplaceName(address marketplace) external view returns (string memory) {
        require(_isMarketplace[marketplace], "MarketplaceFactory: Not a marketplace");
        return _marketplaceNames[marketplace];
    }

    /**
     * @notice Get the creator of a marketplace
     * @dev Reverts if the address is not a marketplace created by this factory
     * @param marketplace The marketplace address
     * @return The address that created the marketplace
     */
    function getMarketplaceCreator(address marketplace) external view returns (address) {
        require(_isMarketplace[marketplace], "MarketplaceFactory: Not a marketplace");
        return _marketplaceCreators[marketplace];
    }

    /**
     * @notice Get a marketplace by index
     * @dev Reverts if the index is out of bounds
     * @param index The index of the marketplace in the array
     * @return The address of the marketplace at the given index
     */
    function getMarketplace(uint256 index) external view returns (address) {
        require(index < _marketplaces.length, "MarketplaceFactory: Index out of bounds");
        return _marketplaces[index];
    }
}
