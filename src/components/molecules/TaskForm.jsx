import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Open',
    priority_c: 'Medium',
Tags: '',
    assign_to_c: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name_c: task.name_c || '',
        description_c: task.description_c || '',
        status_c: task.status_c || 'Open',
        priority_c: task.priority_c || 'Medium',
Tags: task.Tags || '',
assign_to_c: task.assign_to_c || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name_c.trim()) {
      return;
    }

    onSubmit(formData);
  };

  const statusOptions = ['Open', 'InProgress', 'Completed', 'Blocked'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ApperIcon 
                name={task ? "Edit" : "Plus"} 
                className="w-5 h-5 mr-2 text-primary-600" 
              />
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name_c"
                value={formData.name_c}
                onChange={handleChange}
                placeholder="Enter task name"
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description_c"
                value={formData.description_c}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status_c"
                  value={formData.status_c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'InProgress' ? 'In Progress' : status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority_c"
                  value={formData.priority_c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
</div>

            {/* Assign To */}
<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <Input
                name="assign_to_c"
                value={formData.assign_to_c}
                onChange={handleChange}
                placeholder="Enter assignee name"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the name of the person to assign this task to
              </p>
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                type="text"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
                placeholder="Enter tags (comma-separated)"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskForm;