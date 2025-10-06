import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800 border-blue-200',
      InProgress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Completed: 'bg-green-100 text-green-800 border-green-200',
      Blocked: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800 border-red-200',
      Medium: 'bg-orange-100 text-orange-800 border-orange-200',
      Low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header with badges */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status_c)}`}>
              {task.status_c === 'InProgress' ? 'In Progress' : task.status_c}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority_c)}`}>
              {task.priority_c}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="text-primary-600 hover:text-primary-700 transition-colors"
              title="Edit task"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.Id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Delete task"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {task.name_c || task.Name}
        </h3>

        {/* Description */}
        {task.description_c && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {task.description_c}
          </p>
        )}

        {/* Tags */}
        {task.Tags && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.Tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

{/* Assigned To */}
        {task.assign_to_c && (
          <div className="flex items-center text-xs text-gray-600 pb-3">
            <ApperIcon name="User" className="w-3 h-3 mr-1" />
            <span>Assigned to: {task.assign_to_c?.Name || 'Unassigned'}</span>
          </div>
        )}

        {/* Footer with date */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            <span>Created: {formatDate(task.CreatedOn)}</span>
          </div>
          {task.ModifiedOn && task.ModifiedOn !== task.CreatedOn && (
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
              <span>Updated: {formatDate(task.ModifiedOn)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;