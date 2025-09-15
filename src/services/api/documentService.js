import { toast } from "react-toastify";

class DocumentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'document_c';
  }

  async getAllDocuments() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "compliance_score_c" } },
          { field: { Name: "size_c" } }
        ],
        orderBy: [
          {
            fieldName: "upload_date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
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
        console.error("Error fetching documents:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getDocumentById(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid document ID format');
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "file_name_c" } },
          { field: { Name: "upload_date_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "compliance_score_c" } },
          { field: { Name: "size_c" } }
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
        console.error(`Error fetching document with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async uploadDocument(file, content) {
    try {
      // First create the document record
      const newDocument = {
        Name: file.name,
        file_name_c: file.name,
        upload_date_c: new Date().toISOString(),
        content_c: content,
        type_c: file.type.includes("pdf") ? "pdf" : file.type.includes("word") ? "docx" : "txt",
        status_c: "processing",
        compliance_score_c: 0,
        size_c: file.size ? file.size.toString() : "0"
      };

      const params = {
        records: [newDocument]
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
          console.error(`Failed to create document ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdDocument = successfulRecords[0].data;
          
          // Simulate validation processing
          const validationResult = await this.validateDocument(createdDocument);
          
          // Update document with results
          const updateParams = {
            records: [{
              Id: createdDocument.Id,
              status_c: "completed",
              compliance_score_c: validationResult.score
            }]
          };

          await this.apperClient.updateRecord(this.tableName, updateParams);
          
          // Return updated document data
          const updatedDocument = {
            ...createdDocument,
            status_c: "completed",
            compliance_score_c: validationResult.score
          };
          
          return {
            document: updatedDocument,
            validationResult
          };
        }
      }

      throw new Error("No records were created successfully");

    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating document:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async validateDocument(document) {
    try {
      const issues = this.performValidation(document.content_c);
      const score = this.calculateComplianceScore(issues);
      
      return {
        documentId: document.Id.toString(),
        score,
        issues,
        timestamp: new Date().toISOString(),
        processTime: 2.3
      };
    } catch (error) {
      console.error("Validation processing error:", error);
      throw new Error(`Failed to validate document content: ${error.message}`);
    }
  }

  performValidation(content) {
    const issues = [];
    const contentLower = content.toLowerCase();

    // Check for required sections
    const requiredSections = [
      { name: "title", pattern: /title:/i, rule: "Required Title Section" },
      { name: "document id", pattern: /document id:/i, rule: "Document ID Format" },
      { name: "version", pattern: /(version|revision):/i, rule: "Version Information" },
      { name: "effective date", pattern: /effective date:/i, rule: "Effective Date" },
      { name: "purpose", pattern: /purpose:/i, rule: "Purpose Section" },
      { name: "scope", pattern: /scope:/i, rule: "Scope Section" },
      { name: "responsibilities", pattern: /responsibilities:/i, rule: "Responsibilities Section" },
      { name: "definitions", pattern: /definitions:/i, rule: "Definitions Section" },
      { name: "procedure", pattern: /procedure:/i, rule: "Procedure Section" },
      { name: "references", pattern: /references:/i, rule: "References Section" },
      { name: "revision history", pattern: /revision history:/i, rule: "Revision History" },
      { name: "approvals", pattern: /(prepared by|reviewed by|approved by)/i, rule: "Approval Signatures" }
    ];

    requiredSections.forEach(section => {
      if (!section.pattern.test(content)) {
        issues.push({
          id: `missing-${section.name}`,
          category: "Structure",
          severity: "Critical",
          description: `Missing required section: ${section.name}`,
          location: "Document structure",
          rule: section.rule
        });
      }
    });

    // Check document ID format
    if (!/SOP-\d{3}/i.test(content)) {
      issues.push({
        id: "invalid-doc-id",
        category: "Metadata",
        severity: "Critical",
        description: "Document ID must follow SOP-### format (e.g., SOP-001, SOP-002)",
        location: "Document header",
        rule: "Document ID Format"
      });
    }

    // Check for version/revision information
    if (!/version:\s*\d+\.\d+|revision:\s*\d+\.\d+/i.test(content)) {
      issues.push({
        id: "missing-version",
        category: "Metadata",
        severity: "Critical",
        description: "Document must contain version/revision information (e.g., Version: 1.0, Revision: 2.1)",
        location: "Document metadata",
        rule: "Version Information"
      });
    }

    // Check for effective date format
    if (!/effective date:\s*\d{4}-\d{2}-\d{2}/i.test(content)) {
      issues.push({
        id: "missing-effective-date",
        category: "Metadata",
        severity: "Critical",
        description: "Effective date must be present and follow YYYY-MM-DD format",
        location: "Document metadata",
        rule: "Effective Date"
      });
    }

    // Check for revision history table
    const revisionHistoryMatch = content.match(/revision history:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!revisionHistoryMatch || revisionHistoryMatch[1].includes('[Empty]') || revisionHistoryMatch[1].includes('TBD')) {
      issues.push({
        id: "incomplete-revision-history",
        category: "Metadata",
        severity: "Critical",
        description: "Revision History must include at least one complete entry with Version, Date, Description of Change, and Approved By",
        location: "Revision History section",
        rule: "Revision History"
      });
    }

    // Check for placeholder text
    const placeholders = ["tbd", "lorem ipsum", "placeholder", "[empty]", "to be determined", "insert text here"];
    placeholders.forEach(placeholder => {
      if (contentLower.includes(placeholder.toLowerCase())) {
        issues.push({
          id: `placeholder-${placeholder.replace(/\s+/g, '-')}`,
          category: "Content",
          severity: "Major",
          description: `Contains prohibited placeholder text: "${placeholder}". All content must be complete and meaningful.`,
          location: "Document content",
          rule: "No Placeholder Text"
        });
      }
    });

    // Check for signature accountability
    const signaturesPattern = /(prepared by|reviewed by|approved by):\s*([^\n\r]+)/gi;
    const signatures = [...content.matchAll(signaturesPattern)];
    const requiredSignatures = ['prepared by', 'reviewed by', 'approved by'];
    
    requiredSignatures.forEach(sigType => {
      const found = signatures.find(sig => sig[1].toLowerCase() === sigType);
      if (!found || found[2].includes('TBD') || found[2].includes('[') || found[2].trim().length < 3) {
        issues.push({
          id: `missing-${sigType.replace(/\s+/g, '-')}`,
          category: "Content",
          severity: "Critical",
          description: `Missing or incomplete "${sigType}" signature. Must include name, title, and date for accountability.`,
          location: "Approvals section",
          rule: "Approval Signatures"
        });
      }
    });

    // Check procedure steps
    const procedureSteps = (content.match(/\d+\.\s+[A-Z]/g) || []).length;
    if (procedureSteps < 3) {
      issues.push({
        id: "insufficient-steps",
        category: "Content",
        severity: "Critical",
        description: "Procedure section must contain at least 3 clearly numbered steps with action-oriented language",
        location: "Procedure section",
        rule: "Procedure Section"
      });
    }

    // Check for action-oriented language in procedures
    const procedureMatch = content.match(/procedure:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (procedureMatch) {
      const procedureText = procedureMatch[1];
      const actionWords = /(submit|review|approve|verify|document|record|check|validate|ensure|complete|perform)/i;
      if (!actionWords.test(procedureText)) {
        issues.push({
          id: "weak-procedure-language",
          category: "Content",
          severity: "Minor",
          description: "Procedures should use action-oriented language (Submit, Review, Approve, etc.)",
          location: "Procedure section",
          rule: "Procedure Section"
        });
      }
    }

    // Check references with years
    const references = content.match(/references:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (references) {
      const referenceText = references[1];
      const hasYears = /\d{4}/.test(referenceText);
      if (!hasYears) {
        issues.push({
          id: "missing-reference-years",
          category: "Content",
          severity: "Major",
          description: "References must include publication years (e.g., ISO 13485:2016, ICH Q7 (2000))",
          location: "References section",
          rule: "References Section"
        });
      }

      // Check for outdated references (before 2010)
      const yearMatches = referenceText.match(/\d{4}/g);
      if (yearMatches) {
        const outdatedYears = yearMatches.filter(year => parseInt(year) < 2010);
        if (outdatedYears.length > 0) {
          issues.push({
            id: "outdated-references",
            category: "Content",
            severity: "Minor",
            description: `References contain potentially outdated years: ${outdatedYears.join(', ')}. Consider updating to current versions.`,
            location: "References section",
            rule: "References Section"
          });
        }
      }
    }

    return issues;
  }

  calculateComplianceScore(issues) {
    const severityWeights = {
      "Critical": 3,
      "Major": 2,
      "Minor": 1
    };

    const totalDeductions = issues.reduce((sum, issue) => {
      return sum + (severityWeights[issue.severity] || 1);
    }, 0);

    // Base score is 100, deduct points based on issues
    const score = Math.max(0, 100 - (totalDeductions * 5));
    return Math.round(score);
  }

  async deleteDocument(id) {
    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        throw new Error('Invalid document ID format');
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
          console.error(`Failed to delete document ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting document:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
}

// Export singleton instance
const documentService = new DocumentService();
export default documentService;