# Crowdfunding dApp

A decentralized application for crowdfunding projects on the Tea Sepolia blockchain.

## Overview

This crowdfunding dApp allows users to:
- Connect their Ethereum wallet (MetaMask)
- Create new crowdfunding projects
- View existing projects
- Contribute TEA tokens to projects
- Withdraw funds when projects reach their goals

The application interacts with a smart contract deployed on the Tea Sepolia network.

## Contract Details

- **Network**: Tea Sepolia
- **Contract Address**: 0xC9D03c7cB67894fA2A68A9E10aB5132Fd762DA31
- **Chain ID**: 10218
- **Currency Symbol**: TEA
- **Block Explorer**: [https://sepolia.tea.xyz](https://sepolia.tea.xyz)
- **Faucet**: [https://faucet-sepolia.tea.xyz/](https://faucet-sepolia.tea.xyz/)

## Features

- **Wallet Connection**: Seamlessly connect to MetaMask and automatically switch to Tea Sepolia network
- **Project Creation**: Create new crowdfunding projects with title, description, funding goal, and deadline
- **Project Listing**: View all available crowdfunding projects with their details
- **Contribution**: Contribute TEA tokens to projects you want to support
- **Fund Withdrawal**: Project creators can withdraw funds when goals are met or deadlines pass

## Technology Stack

- React with TypeScript
- ethers.js for Ethereum interaction
- GitHub Pages for deployment

## Getting Started

### Prerequisites

- Node.js and npm installed
- MetaMask browser extension
- TEA tokens on the Tea Sepolia network (available from the faucet)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/crowdfunding-dapp.git
cd crowdfunding-dapp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using the dApp

1. Click "Connect Wallet" to connect your MetaMask wallet
2. If prompted, allow the app to switch to the Tea Sepolia network
3. To create a new project, fill out the form in the "Create New Project" section
4. To contribute to a project, find it in the project list and click "Contribute"
5. If you're a project creator, you can withdraw funds when the project reaches its goal or the deadline passes

## Deployment

For detailed deployment instructions, please see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```
crowdfunding-dapp/
├── public/                  # Public assets
│   ├── index.html           # HTML template
│   └── 404.html             # 404 page for GitHub Pages routing
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── CreateProject.tsx    # Project creation form
│   │   ├── ProjectList.tsx      # List of projects
│   │   └── WalletConnect.tsx    # Wallet connection component
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # Network and contract constants
│   │   └── contractService.ts # Service for contract interactions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── DEPLOYMENT.md            # Deployment instructions
└── README.md                # Project documentation
```

## License

MIT
