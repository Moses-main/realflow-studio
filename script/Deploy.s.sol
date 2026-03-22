// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MarketplaceFactory} from "../src/MarketplaceFactory.sol";
import {RWATokenizer} from "../src/RWATokenizer.sol";
import {PaymentSplitter} from "../src/PaymentSplitter.sol";

contract DeployScript is Script {
    // Addresses for deployment
    address public deployer;
    address public marketplaceFactory;
    address public rwaTokenizer;
    address public paymentSplitter;

    function setUp() public {
        // Get deployer from private key
        deployer = vm.address(privateKeyToAddress(getenv("PRIVATE_KEY")));
        
        // Initialize contract addresses (will be set after deployment)
        marketplaceFactory = address(0);
        rwaTokenizer = address(0);
        paymentSplitter = address(0);
    }

    function run() public {
        vm.startBroadcast();

        // Deploy RWATokenizer
        rwaTokenizer = new RWATokenizer();
        
        // Deploy PaymentSplitter (with zero fees for now)
        paymentSplitter = new PaymentSplitter(
            address(0), // _receiver1
            address(0), // _receiver2
            0,          // _share1
            0           // _share2
        );

        // Deploy MarketplaceFactory
        // Deployment fee set to 0.01 MATIC (or equivalent on testnet)
        uint256 deploymentFee = 0.01 * 10 ** 18; // 0.01 token * 10^18
        marketplaceFactory = new MarketplaceFactory(
            address(rwaTokenizer), // _implementation
            deploymentFee          // _deploymentFee
        );

        vm.stopBroadcast();

        // Output deployed addresses
        log_string("Deployed contracts:");
        log_string("RWATokenizer: ", address(rwaTokenizer));
        log_string("PaymentSplitter: ", address(paymentSplitter));
        log_string("MarketplaceFactory: ", address(marketplaceFactory));
    }
}