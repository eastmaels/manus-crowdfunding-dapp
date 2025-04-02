import React, { useState, useEffect } from 'react';
import { ContractService, Project } from '../utils/contractService';
import './ProjectList.css';

interface ProjectListProps {
  contractService: ContractService;
  account: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ contractService, account }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Get all project IDs
        const projectIds = await contractService.getProjects();
        
        // Fetch details for each project
        const projectPromises = projectIds.map(async (id: number) => {
          return await contractService.getProjectDetails(id);
        });
        
        const fetchedProjects = await Promise.all(projectPromises);
        setProjects(fetchedProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [contractService]);

  const handleContribute = async (projectId: number) => {
    try {
      const amount = prompt('Enter contribution amount in TEA:');
      if (!amount) return;
      
      const tx = await contractService.contribute(projectId, amount);
      await tx.wait();
      
      // Refresh project data
      const updatedProject = await contractService.getProjectDetails(projectId);
      setProjects(projects.map(p => 
        p.id === projectId ? updatedProject : p
      ));
      
      alert('Contribution successful!');
    } catch (err) {
      console.error('Error contributing to project:', err);
      setError('Failed to contribute. Please try again.');
    }
  };

  const handleWithdraw = async (projectId: number) => {
    try {
      const tx = await contractService.withdrawFunds(projectId);
      await tx.wait();
      
      // Refresh project data
      const updatedProject = await contractService.getProjectDetails(projectId);
      setProjects(projects.map(p => 
        p.id === projectId ? updatedProject : p
      ));
      
      alert('Funds withdrawn successfully!');
    } catch (err) {
      console.error('Error withdrawing funds:', err);
      setError('Failed to withdraw funds. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="no-projects">No projects found. Create a new project to get started!</div>;
  }

  return (
    <div className="project-list">
      <h2>Crowdfunding Projects</h2>
      {projects.map((project) => {
        const isCreator = project.creator.toLowerCase() === account.toLowerCase();
        const canWithdraw = isCreator && 
                           (project.currentFunding.gte(project.fundingGoal) || 
                            Date.now() > project.deadline * 1000);
        
        return (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p className="description">{project.description}</p>
            <div className="project-stats">
              <div className="stat">
                <span className="label">Goal:</span>
                <span className="value">{ContractService.formatEther(project.fundingGoal)} TEA</span>
              </div>
              <div className="stat">
                <span className="label">Raised:</span>
                <span className="value">{ContractService.formatEther(project.currentFunding)} TEA</span>
              </div>
              <div className="stat">
                <span className="label">Deadline:</span>
                <span className="value">{new Date(project.deadline * 1000).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ 
                  width: `${Math.min(
                    (Number(ContractService.formatEther(project.currentFunding)) / 
                    Number(ContractService.formatEther(project.fundingGoal))) * 100, 
                    100
                  )}%` 
                }}
              ></div>
            </div>
            
            <div className="project-actions">
              {!project.isCompleted && Date.now() <= project.deadline * 1000 && (
                <button 
                  onClick={() => handleContribute(project.id)}
                  className="contribute-button"
                >
                  Contribute
                </button>
              )}
              
              {canWithdraw && (
                <button 
                  onClick={() => handleWithdraw(project.id)}
                  className="withdraw-button"
                >
                  Withdraw Funds
                </button>
              )}
              
              {project.isCompleted && (
                <div className="completed-badge">Completed</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
