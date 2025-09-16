import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_TASKS, CREATE_TASK, UPDATE_TASK_STATUS } from './graphql/tasks';
import { Button } from '@react-spectrum/button';
import { TextField } from '@react-spectrum/textfield';
import { View } from '@react-spectrum/view';
import { Flex } from '@react-spectrum/layout';
import { Card } from '@react-spectrum/card';
import { Heading } from '@react-spectrum/text';
import { Well } from '@react-spectrum/well';
import { ProgressCircle } from '@react-spectrum/progress';
import { Divider } from '@react-spectrum/divider';

export default function Tasks() {
  const { data, loading, refetch } = useQuery(GET_ALL_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK_STATUS);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    try {
      await createTask({ variables: { title: newTitle.trim(), description: newDesc.trim() } });
      setNewTitle('');
      setNewDesc('');
      refetch();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleStatus = async (id, status) => {
    const newStatus = status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await updateTask({ variables: { id, status: newStatus } });
      refetch();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  const tasks = data?.allTasks || [];
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <ProgressCircle size="L" aria-label="Loading tasks..." />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      {/* Combined Header and Add Task Section */}
      <div className="main-section">
        <div className="section-header">
          <div className="header-content-left">
            <Heading level={2} className="section-title">Your Tasks</Heading>
            <div className="progress-stats">
              <span className="task-count">{totalTasks} total</span>
              {totalTasks > 0 && (
                <>
                  <span className="separator">•</span>
                  <span className="completion-rate">{completionPercentage}% complete</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="add-task-section">
          <div className="add-task-form">
            <div className="form-row">
              <TextField
                label="Task Title"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={setNewTitle}
                onKeyPress={handleKeyPress}
                isRequired
                validationState={!newTitle.trim() && isAdding ? 'invalid' : 'valid'}
                errorMessage={!newTitle.trim() && isAdding ? 'Task title is required' : ''}
                className="title-input form-control"
              />
              <Button 
                variant="cta" 
                onPress={handleAddTask}
                isDisabled={!newTitle.trim() || isAdding}
                className="add-task-button"
              >
                {isAdding ? 'Adding...' : '+ Add Task'}
              </Button>
            </div>
            <TextField
              label="Description (Optional)"
              placeholder="Add more details..."
              value={newDesc}
              onChange={setNewDesc}
              onKeyPress={handleKeyPress}
              multiline
              rows={4}
              className="description-input"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        
        {totalTasks === 0 ? (
          <div className="empty-state">
            <div style={{ textAlign: 'center' }}>
              <div className="empty-icon">📝</div>
              <Heading level={4}>No tasks yet</Heading>
              <p>Add your first task above to get started!</p>
            </div>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task, index) => (
              <div
                key={task.id} 
                className={`task-card ${task.status === 'COMPLETED' ? 'completed' : 'pending'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="task-actions">
                  <Button 
                    variant={task.status === 'COMPLETED' ? 'secondary' : 'cta'}
                    onPress={() => toggleStatus(task.id, task.status)}
                    className="toggle-button"
                  >
                    {task.status === 'COMPLETED' ? 'Mark Undone' : 'Mark Done'}
                  </Button>
                </div>
                
                <div className="task-content">
                  <Heading level={4} className="task-title">
                    {task.title}
                  </Heading>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>
                
                <div className="task-footer">
                  <div className="task-meta">
                    <div className={`task-status ${task.status.toLowerCase()}`}>
                      <span className="status-dot"></span>
                      {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                    </div>
                    <div className="task-date">
                      Added recently
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
