import { toast } from "react-toastify";

class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAllTasks(statusFilter = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
{ field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "assign_to_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Add status filter if provided
      if (statusFilter && statusFilter !== 'All') {
        params.where = [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [statusFilter]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getTaskById(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid task ID format');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
{ field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "assign_to_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, numericId, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      // Only include Updateable fields
      const newTask = {
        Name: taskData.Name || taskData.name_c || 'New Task',
        name_c: taskData.name_c,
        description_c: taskData.description_c || '',
        status_c: taskData.status_c || 'Open',
        priority_c: taskData.priority_c || 'Medium',
Tags: taskData.Tags || '',
assign_to_c: taskData.assign_to_c || undefined
      };

      const params = {
        records: [newTask]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error("No records were created successfully");

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async updateTask(id, taskData) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid task ID format');
      }

      // Only include Updateable fields plus Id
      const updatedTask = {
        Id: numericId,
        Name: taskData.Name || taskData.name_c,
        name_c: taskData.name_c,
        description_c: taskData.description_c,
        status_c: taskData.status_c,
        priority_c: taskData.priority_c,
Tags: taskData.Tags || '',
assign_to_c: taskData.assign_to_c || undefined
      };

      const params = {
        records: [updatedTask]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error("No records were updated successfully");

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid task ID format');
      }

      const params = {
        RecordIds: [numericId]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

// Export singleton instance
const taskService = new TaskService();
export default taskService;