// Network configuration
export const NETWORK_CONFIG = {
  name: 'Tea Sepolia',
  rpcUrl: 'https://tea-sepolia.g.alchemy.com/public',
  chainId: 10218,
  symbol: 'TEA',
  explorer: 'https://sepolia.tea.xyz',
  faucet: 'https://faucet-sepolia.tea.xyz/'
};

// Contract configuration
export const CONTRACT_ADDRESS = '0xC9D03c7cB67894fA2A68A9E10aB5132Fd762DA31';

// Updated ABI with payable createProject function and alternative signatures
export const CONTRACT_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function getProjects() view returns (uint256[])",
  "function getProjectDetails(uint256 projectId) view returns (string, string, uint256, uint256, address, bool)",
  "function getContributionsForProject(uint256 projectId) view returns (uint256)",
  "function getContributorCount(uint256 projectId) view returns (uint256)",
  
  // Write functions - updated to be payable
  "function createProject(string memory title, string memory description, uint256 fundingGoal, uint256 deadline) payable",
  // Alternative signatures to try
  "function createProject(string memory title, string memory description, uint256 fundingGoal, uint256 deadline, bool featured) payable",
  "function createProject(string memory title, string memory description, uint256 fundingGoal, uint256 deadline, address beneficiary) payable",
  "function addProject(string memory title, string memory description, uint256 fundingGoal, uint256 deadline) payable",
  "function startProject(string memory title, string memory description, uint256 fundingGoal, uint256 deadline) payable",
  
  "function contribute(uint256 projectId) payable",
  "function withdrawFunds(uint256 projectId)",
  
  // Events
  "event ProjectCreated(uint256 indexed projectId, address indexed creator, string title, uint256 fundingGoal)",
  "event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount)",
  "event FundsWithdrawn(uint256 indexed projectId, address indexed creator, uint256 amount)"
];
