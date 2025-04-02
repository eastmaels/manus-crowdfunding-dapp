import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';

// Interface for project details
export interface Project {
  id: number;
  title: string;
  description: string;
  fundingGoal: ethers.BigNumber;
  currentFunding: ethers.BigNumber;
  deadline: number;
  creator: string;
  isCompleted: boolean;
}

// Class to handle contract interactions
export class ContractService {
  private contract: ethers.Contract;
  private signer: ethers.Signer | null;

  constructor(provider: ethers.providers.Web3Provider, signer: ethers.Signer | null = null) {
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    this.signer = signer;
  }

  // Set signer for transactions
  public setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }

  // Read functions
  public async getProjects(): Promise<number[]> {
    try {
      const projectIds = await this.contract.getProjects();
      return projectIds.map((id: ethers.BigNumber) => id.toNumber());
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  public async getProjectDetails(projectId: number): Promise<Project> {
    try {
      const details = await this.contract.getProjectDetails(projectId);
      const contributions = await this.contract.getContributionsForProject(projectId);
      
      return {
        id: projectId,
        title: details[0],
        description: details[1],
        fundingGoal: details[2],
        currentFunding: contributions,
        deadline: details[3].toNumber(),
        creator: details[4],
        isCompleted: details[5]
      };
    } catch (error) {
      console.error(`Error fetching project details for ID ${projectId}:`, error);
      throw new Error('Failed to fetch project details');
    }
  }

  public async getContributorCount(projectId: number): Promise<number> {
    try {
      const count = await this.contract.getContributorCount(projectId);
      return count.toNumber();
    } catch (error) {
      console.error(`Error fetching contributor count for project ID ${projectId}:`, error);
      throw new Error('Failed to fetch contributor count');
    }
  }

  // Write functions - Updated to handle multiple function signatures and send ETH
  public async createProject(
    title: string,
    description: string,
    fundingGoal: string,
    deadline: Date,
    ethAmount: string = "0.1" // Default ETH amount to send with transaction
  ): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer not set. Please connect wallet first.');
    }

    try {
      const fundingGoalWei = ethers.utils.parseEther(fundingGoal);
      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
      const value = ethers.utils.parseEther(ethAmount);
      
      console.log(`Attempting to create project with ${ethAmount} ETH...`);
      
      // Try the standard createProject function first
      try {
        return await this.contract.connect(this.signer).createProject(
          title,
          description,
          fundingGoalWei,
          deadlineTimestamp,
          { value }
        );
      } catch (error) {
        console.error('Standard createProject failed:', error);
        
        // Try with featured parameter (boolean)
        try {
          console.log('Trying createProject with featured parameter...');
          return await this.contract.connect(this.signer)['createProject(string,string,uint256,uint256,bool)'](
            title,
            description,
            fundingGoalWei,
            deadlineTimestamp,
            true,
            { value }
          );
        } catch (error) {
          console.error('createProject with featured parameter failed:', error);
          
          // Try with beneficiary parameter (address)
          try {
            console.log('Trying createProject with beneficiary parameter...');
            const userAddress = await this.signer.getAddress();
            return await this.contract.connect(this.signer)['createProject(string,string,uint256,uint256,address)'](
              title,
              description,
              fundingGoalWei,
              deadlineTimestamp,
              userAddress,
              { value }
            );
          } catch (error) {
            console.error('createProject with beneficiary parameter failed:', error);
            
            // Try addProject function
            try {
              console.log('Trying addProject function...');
              return await this.contract.connect(this.signer).addProject(
                title,
                description,
                fundingGoalWei,
                deadlineTimestamp,
                { value }
              );
            } catch (error) {
              console.error('addProject function failed:', error);
              
              // Try startProject function
              try {
                console.log('Trying startProject function...');
                return await this.contract.connect(this.signer).startProject(
                  title,
                  description,
                  fundingGoalWei,
                  deadlineTimestamp,
                  { value }
                );
              } catch (error) {
                console.error('startProject function failed:', error);
                throw new Error('All project creation attempts failed. Please contact the contract owner for the correct function signature.');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  public async contribute(projectId: number, amount: string): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer not set. Please connect wallet first.');
    }

    try {
      const amountWei = ethers.utils.parseEther(amount);
      return await this.contract.connect(this.signer).contribute(projectId, { value: amountWei });
    } catch (error) {
      console.error(`Error contributing to project ID ${projectId}:`, error);
      throw new Error('Failed to contribute to project');
    }
  }

  public async withdrawFunds(projectId: number): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer not set. Please connect wallet first.');
    }

    try {
      return await this.contract.connect(this.signer).withdrawFunds(projectId);
    } catch (error) {
      console.error(`Error withdrawing funds from project ID ${projectId}:`, error);
      throw new Error('Failed to withdraw funds');
    }
  }

  // Helper function to format ether values
  public static formatEther(wei: ethers.BigNumber): string {
    return ethers.utils.formatEther(wei);
  }

  // Helper function to check if user is project creator
  public async isProjectCreator(projectId: number, userAddress: string): Promise<boolean> {
    try {
      const details = await this.contract.getProjectDetails(projectId);
      return details[4].toLowerCase() === userAddress.toLowerCase();
    } catch (error) {
      console.error(`Error checking if user is project creator:`, error);
      return false;
    }
  }
}
