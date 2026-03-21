// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/**
 * @title MarketplaceFactory
 * @author RealFlow Studio
 * @notice Factory contract for deploying marketplace instances using minimal proxies (EIP-1167)
 * @dev This factory allows creating cheap clones of a implementation contract
 */
contract MarketplaceFactory is Ownable {
    using Clones for address;

    /// @notice Implementation contract address for clones
    address public implementation;

    /// @notice Mapping of deployed marketplace clones
    mapping(address => bool) public isMarketplace;

    /// @notice Array of all deployed marketplaces
    address[] public marketplaces;

    /// @notice Fee charged for deploying a new marketplace (in wei)
    uint256 public deploymentFee;

    /// @notice Event emitted when a new marketplace is deployed
    event MarketplaceDeployed(address indexed marketplace, address indexed deployer, bytes32 salt);
    
    /// @notice Event emitted when implementation is updated
    event ImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    
    /// @notice Event emitted when deployment fee is updated
    event DeploymentFeeUpdated(uint256 oldFee, uint256 newFee);

    /// @notice Error for insufficient deployment fee
    error InsufficientFee(uint256 required, uint256 provided);
    
    /// @notice Error for invalid implementation
    error InvalidImplementation();

    /**
     * @notice Constructor sets the initial implementation address and deployment fee
     * @param _implementation Initial implementation contract address
     * @param _deploymentFee Initial deployment fee
     */
    constructor(address _implementation, uint256 _deploymentFee) Ownable(msg.sender) {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
        deploymentFee = _deploymentFee;
    }

    /**
     * @notice Deploy a new marketplace clone
     * @param salt Unique salt for deterministic address
     * @return marketplace The address of the deployed marketplace
     */
    function deploy(bytes32 salt) external payable returns (address marketplace) {
        if (deploymentFee > 0) {
            if (msg.value < deploymentFee) {
                revert InsufficientFee(deploymentFee, msg.value);
            }
        }

        marketplace = Clones.cloneDeterministic(implementation, salt);
        isMarketplace[marketplace] = true;
        marketplaces.push(marketplace);

        // Refund excess payment
        if (msg.value > deploymentFee) {
            (bool success, ) = msg.sender.call{value: msg.value - deploymentFee}("");
            require(success, "Refund failed");
        }

        emit MarketplaceDeployed(marketplace, msg.sender, salt);
    }

    /**
     * @notice Deploy a new marketplace clone with arguments
     * @param salt Unique salt for deterministic address
     * @param data Encoded initialization data
     * @return marketplace The address of the deployed marketplace
     */
    function deployWithData(bytes32 salt, bytes calldata data) external payable returns (address marketplace) {
        if (deploymentFee > 0) {
            if (msg.value < deploymentFee) {
                revert InsufficientFee(deploymentFee, msg.value);
            }
        }

        marketplace = Clones.cloneDeterministic(implementation, salt);

        // Call initializer on the clone
        (bool success, ) = marketplace.call(data);
        require(success, "Initialization failed");

        isMarketplace[marketplace] = true;
        marketplaces.push(marketplace);

        // Refund excess payment
        if (msg.value > deploymentFee) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - deploymentFee}("");
            require(refundSuccess, "Refund failed");
        }

        emit MarketplaceDeployed(marketplace, msg.sender, salt);
    }

    /**
     * @notice Update the implementation contract address
     * @param newImplementation New implementation address
     */
    function setImplementation(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "Invalid implementation");
        address oldImplementation = implementation;
        implementation = newImplementation;
        emit ImplementationUpdated(oldImplementation, newImplementation);
    }

    /**
     * @notice Update the deployment fee
     * @param newFee New deployment fee in wei
     */
    function setDeploymentFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = deploymentFee;
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Get all deployed marketplaces
     * @return Array of marketplace addresses
     */
    function getMarketplaces() external view returns (address[] memory) {
        return marketplaces;
    }

    /**
     * @notice Get the number of deployed marketplaces
     * @return Count of marketplaces
     */
    function getMarketplaceCount() external view returns (uint256) {
        return marketplaces.length;
    }

    /**
     * @notice Predict the address of a clone before deployment
     * @param salt Salt to use for deterministic address
     * @return Predicted clone address
     */
    function predictAddress(bytes32 salt) external view returns (address) {
        return Clones.predictDeterministicAddress(implementation, salt);
    }

    /**
     * @notice Withdraw accumulated fees
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @notice Receive ether for deployment fees
     */
    receive() external payable {}
}
