import React, { useState } from "react";
import FileUpload from "@/components/molecules/FileUpload";
import DocumentPreview from "@/components/molecules/DocumentPreview";
import documentService from "@/services/api/documentService";
import { toast } from "react-toastify";

const DocumentUploadSection = ({ onDocumentProcessed, currentDocument, onDocumentDelete }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    
    try {
      // Simulate file reading
      const content = await readFileContent(file);
      
      toast.info("Processing document...", {
        position: "top-right",
        autoClose: 2000
      });

      const result = await documentService.uploadDocument(file, content);
      
      toast.success(`Document processed! Compliance score: ${result.validationResult.score}%`, {
        position: "top-right",
        autoClose: 4000
      });

      onDocumentProcessed(result.document, result.validationResult);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process document. Please try again.", {
        position: "top-right",
        autoClose: 4000
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        let content = e.target.result;
        
        // For demo purposes, simulate content extraction from different file types
        if (file.type === "application/pdf") {
          // Simulate PDF text extraction
          content = generateSampleContent(file.name, "pdf");
        } else if (file.type.includes("word")) {
          // Simulate Word document content extraction
          content = generateSampleContent(file.name, "docx");
        }
        
        resolve(content);
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      
      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        // For PDF and Word files, simulate content extraction
        setTimeout(() => {
          resolve(generateSampleContent(file.name, file.type.includes("pdf") ? "pdf" : "docx"));
        }, 1000);
      }
    });
  };

  const generateSampleContent = (fileName, type) => {
    // Generate sample content that will trigger various validation issues
    const hasGoodStructure = Math.random() > 0.3;
    const hasPlaceholders = Math.random() > 0.6;
    const hasProperReferences = Math.random() > 0.4;
    
    let content = `STANDARD OPERATING PROCEDURE\n\n`;
    
    if (hasGoodStructure) {
      content += `Title: ${fileName.replace(/\.(pdf|docx|txt)$/i, "")}\n`;
content += `Document ID: SOP-${Math.floor(Math.random() * 999).toString().padStart(3, "0")}\n`;
      content += `Version: ${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}\n`;
      content += `Effective Date: 2024-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0")}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0")}\n\n`;
    } else {
      content += `Title: ${fileName}\n`;
      if (Math.random() > 0.5) content += `Document ID: DOC-001\n`;
      content += `Version: 1.0\n`;
      if (hasPlaceholders) content += `Effective Date: TBD\n\n`;
    }

    content += `Purpose:\n`;
    if (hasPlaceholders) {
      content += `TBD - This section needs to be completed.\n\n`;
    } else {
      content += `This procedure establishes requirements for quality management processes.\n\n`;
    }

    content += `Scope:\n`;
    content += `${hasGoodStructure ? "Applies to all manufacturing and quality control operations." : "All operations"}\n\n`;

    if (hasGoodStructure) {
      content += `Responsibilities:\n`;
      content += `Quality Manager: Overall responsibility for implementation\n`;
      content += `Department Heads: Day-to-day execution\n\n`;

      content += `Definitions:\n`;
      content += `GMP: Good Manufacturing Practice\n`;
      content += `SOP: Standard Operating Procedure\n`;
      content += `QA: Quality Assurance\n\n`;
    }

    content += `Procedure:\n`;
    if (hasGoodStructure) {
      content += `1. Review incoming materials for compliance\n`;
      content += `2. Conduct required testing procedures\n`;
      content += `3. Document all test results\n`;
      content += `4. Review results for acceptance criteria\n`;
      content += `5. Release or reject materials based on results\n\n`;
    } else {
      content += `1. Start process\n`;
      content += `2. Complete work\n\n`;
    }

    content += `References:\n`;
    if (hasProperReferences) {
      content += `- ICH Q7: Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients (2000)\n`;
      content += `- ISO 13485:2016 Medical devices — Quality management systems\n`;
      content += `- 21 CFR Part 820 Quality System Regulation\n\n`;
    } else {
      content += `- ICH Q7\n`;
      content += `- ISO 13485\n`;
      if (hasPlaceholders) content += `- Additional references TBD\n\n`;
    }

    if (hasGoodStructure) {
      content += `Revision History:\n`;
      content += `Version 1.0 - Initial release (2023-01-01)\n`;
      content += `Version 1.1 - Updated procedures (2023-06-01)\n\n`;

      content += `Approvals:\n`;
      content += `Prepared by: ${["John Smith", "Sarah Johnson", "Michael Chen"][Math.floor(Math.random() * 3)]}, Quality Manager\n`;
      content += `Reviewed by: ${["Lisa Wang", "David Brown", "Emily Davis"][Math.floor(Math.random() * 3)]}, Operations Director\n`;
      content += `Approved by: ${["Robert Wilson", "Jennifer Martinez", "Thomas Anderson"][Math.floor(Math.random() * 3)]}, VP Quality\n`;
    } else {
      if (hasPlaceholders) {
        content += `Approvals:\n`;
        content += `Prepared by: TBD\n`;
        content += `Reviewed by: TBD\n`;
        content += `Approved by: TBD\n`;
      }
    }

    if (hasPlaceholders) {
      content += `\n\nNote: This document contains placeholder text (lorem ipsum) that needs to be replaced with actual content.`;
    }

    return content;
  };

  const handleDocumentDelete = async (documentId) => {
    try {
      await documentService.deleteDocument(documentId);
      toast.success("Document deleted successfully", {
        position: "top-right",
        autoClose: 3000
      });
      onDocumentDelete();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document", {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      {!currentDocument ? (
        <FileUpload 
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
        />
      ) : (
        <DocumentPreview 
          document={currentDocument}
          onDelete={handleDocumentDelete}
        />
      )}
    </div>
  );
};

export default DocumentUploadSection;