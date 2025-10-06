import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/molecules/TaskForm';
import taskService from '@/services/api/taskService';
import { AuthContext } from '../../App';

const Tasks = () => {
  const navigate = useNavigate();
  const authMethods = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks(statusFilter === 'All' ? null : statusFilter);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(taskData);
        toast.success('Task created successfully');
      }
      setShowTaskForm(false);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const statusOptions = ['All', 'Open', 'InProgress', 'Completed', 'Blocked'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center hover:from-primary-600 hover:to-primary-700 transition-all"
              >
                <ApperIcon name="Shield" className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-600 text-sm">Manage compliance tasks and action items</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.accounts?.[0]?.companyName || 'ComplianceIQ User'}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => authMethods.logout()}
                size="sm"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex space-x-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleCreateTask}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading message="Loading tasks..." />
          </div>
        ) : tasks.length === 0 ? (
          <Empty
            title="No tasks found"
            message={
              statusFilter === 'All'
                ? "You haven't created any tasks yet. Create your first task to start tracking compliance action items."
                : `No tasks with status "${statusFilter}". Try selecting a different filter or create a new task.`
            }
            actionText="Create Your First Task"
            onAction={handleCreateTask}
            icon="ListTodo"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Tasks;