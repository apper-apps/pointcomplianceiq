import { toast } from "react-toastify";

class ComplianceRuleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'compliance_rule_c';
  }

  async getAllRules() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "severity_c" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "validation_c" } }
        ],
        where: [
          {
            FieldName: "enabled_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          {
            fieldName: "severity_c",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching compliance rules:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getRuleById(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid rule ID format');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "severity_c" } },
          { field: { Name: "enabled_c" } },
          { field: { Name: "validation_c" } }
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
        console.error(`Error fetching rule with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

// Export singleton instance
const complianceRuleService = new ComplianceRuleService();
export default complianceRuleService;