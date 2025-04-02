import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NETWORK_CONFIG, CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import './WalletConnect.css';

interface WalletConnectProps {
  onConnect: (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        
        // Check if we're on the correct network
        const network = await provider.getNetwork();
        if (network.chainId !== NETWORK_CONFIG.chainId) {
          try {
            // Try to switch to Tea Sepolia network
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x' + NETWORK_CONFIG.chainId.toString(16) }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x' + NETWORK_CONFIG.chainId.toString(16),
                      chainName: NETWORK_CONFIG.name,
                      nativeCurrency: {
                        name: NETWORK_CONFIG.symbol,
                        symbol: NETWORK_CONFIG.symbol,
                        decimals: 18
                      },
                      rpcUrls: [NETWORK_CONFIG.rpcUrl],
                      blockExplorerUrls: [NETWORK_CONFIG.explorer]
                    },
                  ],
                });
              } catch (addError) {
                setError('Failed to add the Tea Sepolia network to your wallet.');
                return;
              }
            } else {
              setError('Failed to switch to the Tea Sepolia network.');
              return;
            }
          }
        }
        
        const signer = provider.getSigner();
        setIsConnected(true);
        onConnect(provider, signer);
      } else {
        setError('Ethereum wallet not detected. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setIsConnected(false);
          setAccount('');
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <span className="wallet-address">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </span>
          <span className="network-badge">{NETWORK_CONFIG.name}</span>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletConnect;
