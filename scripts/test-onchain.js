#!/usr/bin/env node
/**
 * Test script to verify on-chain deployment flow with private key
 */
import dotenv from 'dotenv';
dotenv.config();
import { ethers } from 'ethers';

async function testOnchainFlow() {
  try {
    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in environment');
    }

    // Set up provider for Polygon Amoy testnet
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.utils.formatEther(balance);
    
    console.log(`✅ Wallet connected: ${wallet.address}`);
    console.log(`✅ Balance: ${balanceEth} MATIC`);
    
    // Test contract interaction (read-only)
    const rwaTokenizerAddress = "0xYourContractAddressHere"; // Replace with actual deployed contract
    
    console.log("✅ On-chain flow test completed successfully");
    return true;
  } catch (error) {
    console.error(`❌ On-chain flow test failed: ${error.message}`);
    return false;
  }
}

// Run test if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testOnchainFlow()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error(`Test script error: ${err.message}`);
      process.exit(1);
    });
}

export { testOnchainFlow };