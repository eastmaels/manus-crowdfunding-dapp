import React, { useState } from 'react';
import { ContractService } from '../utils/contractService';
import './CreateProject.css';

interface CreateProjectProps {
  contractService: ContractService;
  onProjectCreated: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ contractService, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [ethAmount, setEthAmount] = useState('0.1'); // Default ETH amount to send
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !fundingGoal || !deadline) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Attempting to create project...');
      
      // Create project using contract service with ETH amount
      const deadlineDate = new Date(deadline);
      
      setDebugInfo(prev => prev + '\nPreparing transaction with parameters:' + 
        `\nTitle: ${title}` +
        `\nDescription: ${description}` +
        `\nFunding Goal: ${fundingGoal} TEA` +
        `\nDeadline: ${deadlineDate.toISOString()}` +
        `\nSending: ${ethAmount} ETH`);
      
      const tx = await contractService.createProject(
        title,
        description,
        fundingGoal,
        deadlineDate,
        ethAmount
      );
      
      setDebugInfo(prev => prev + '\nTransaction sent! Waiting for confirmation...');
      
      await tx.wait();
      
      setDebugInfo(prev => prev + '\nTransaction confirmed!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setFundingGoal('');
      setDeadline('');
      setEthAmount('0.1');
      
      // Notify parent component
      onProjectCreated();
      
      alert('Project created successfully!');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError('Failed to create project: ' + (err.message || 'Unknown error'));
      setDebugInfo(prev => prev + '\nError: ' + JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fundingGoal">Funding Goal (TEA)</label>
          <input
            type="number"
            id="fundingGoal"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            placeholder="Enter funding goal in TEA"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ethAmount">ETH to Send (required by contract)</label>
          <input
            type="number"
            id="ethAmount"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="ETH amount to send with transaction"
            step="0.01"
            min="0.01"
            required
          />
          <small className="helper-text">The contract requires ETH to be sent with the transaction. Try 0.1 ETH if you're unsure.</small>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
      
      {debugInfo && (
        <div className="debug-info">
          <h3>Debug Information</h3>
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
