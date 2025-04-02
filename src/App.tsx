import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject';
import { ContractService } from './utils/contractService';
import './App.css';

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractService, setContractService] = useState<ContractService | null>(null);
  const [refreshProjects, setRefreshProjects] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');

  const handleConnect = async (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => {
    setProvider(provider);
    setSigner(signer);
    
    // Initialize contract service
    const service = new ContractService(provider, signer);
    setContractService(service);
    
    // Get connected account
    const address = await signer.getAddress();
    setAccount(address);
  };

  const handleProjectCreated = () => {
    // Trigger refresh of project list
    setRefreshProjects(!refreshProjects);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crowdfunding dApp</h1>
        <WalletConnect onConnect={handleConnect} />
      </header>
      
      <main className="App-main">
        {signer && contractService ? (
          <>
            <CreateProject 
              contractService={contractService} 
              onProjectCreated={handleProjectCreated} 
            />
            <ProjectList 
              contractService={contractService}
              account={account}
              key={refreshProjects.toString()} 
            />
          </>
        ) : (
          <div className="connect-prompt">
            <p>Please connect your wallet to view and create crowdfunding projects.</p>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Crowdfunding dApp on Tea Sepolia Network</p>
      </footer>
    </div>
  );
}

export default App;
