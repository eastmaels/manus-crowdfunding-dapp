const { ethers } = require('ethers');

// Tea Sepolia network details
const networkDetails = {
  name: 'Tea Sepolia',
  rpcUrl: 'https://tea-sepolia.g.alchemy.com/public',
  chainId: 10218,
  symbol: 'TEA',
  explorer: 'https://sepolia.tea.xyz',
  faucet: 'https://faucet-sepolia.tea.xyz/'
};

// Contract address
const contractAddress = '0xC9D03c7cB67894fA2A68A9E10aB5132Fd762DA31';

async function analyzeContract() {
  try {
    console.log('Connecting to Tea Sepolia network...');
    const provider = new ethers.providers.JsonRpcProvider(networkDetails.rpcUrl);
    
    console.log('Fetching contract code...');
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      console.error('No contract found at the provided address');
      return;
    }
    
    console.log('Contract exists at the provided address');
    
    // Try to get transaction count to see if the contract is active
    const txCount = await provider.getTransactionCount(contractAddress);
    console.log(`Transaction count for contract: ${txCount}`);
    
    // Get contract balance
    const balance = await provider.getBalance(contractAddress);
    console.log(`Contract balance: ${ethers.utils.formatEther(balance)} ${networkDetails.symbol}`);
    
    // Without ABI, we can't directly interact with the contract functions
    // We'll need to use etherscan-like services or have the ABI provided
    console.log('To fully analyze the contract functions, we need the contract ABI');
    
    // We can try to detect common ERC standards by function signatures
    console.log('Attempting to detect common interfaces...');
    
    // Check for basic contract info
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
  } catch (error) {
    console.error('Error analyzing contract:', error);
  }
}

analyzeContract();
