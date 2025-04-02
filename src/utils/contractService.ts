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

  // Write functions
  public async createProject(
    title: string,
    description: string,
    fundingGoal: string,
    deadline: Date
  ): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer not set. Please connect wallet first.');
    }

    try {
      const fundingGoalWei = ethers.utils.parseEther(fundingGoal);
      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
      
      return await this.contract.connect(this.signer).createProject(
        title,
        description,
        fundingGoalWei,
        deadlineTimestamp
      );
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
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
