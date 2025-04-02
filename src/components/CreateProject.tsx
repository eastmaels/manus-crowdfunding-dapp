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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !fundingGoal || !deadline) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Create project using contract service
      const deadlineDate = new Date(deadline);
      const tx = await contractService.createProject(
        title,
        description,
        fundingGoal,
        deadlineDate
      );
      
      await tx.wait();
      
      // Reset form
      setTitle('');
      setDescription('');
      setFundingGoal('');
      setDeadline('');
      
      // Notify parent component
      onProjectCreated();
      
      alert('Project created successfully!');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
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
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
