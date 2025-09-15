import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import DocumentUploadSection from "@/components/organisms/DocumentUploadSection";
import ValidationResults from "@/components/organisms/ValidationResults";
import Empty from "@/components/ui/Empty";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";

const ComplianceDashboard = () => {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showingResults, setShowingResults] = useState(false);

  const handleDocumentProcessed = (document, validation) => {
    setCurrentDocument(document);
    setValidationResult(validation);
    setShowingResults(true);
  };

  const handleDocumentDelete = () => {
    setCurrentDocument(null);
    setValidationResult(null);
    setShowingResults(false);
  };

  const handleNewUpload = () => {
    setCurrentDocument(null);
    setValidationResult(null);
    setShowingResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ComplianceIQ</h1>
                <p className="text-gray-600 text-sm">AI-Powered GxP Document Validation</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentDocument && (
                <button
                  onClick={handleNewUpload}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span className="text-sm font-medium">New Document</span>
                </button>
              )}
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Regulatory Compliance</div>
                <div className="text-xs text-gray-600">GxP Validation System</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentDocument ? (
          /* Empty State */
          <div className="max-w-4xl mx-auto">
            <Empty
              title="Start Document Validation"
              message="Upload your regulatory document to begin AI-powered compliance validation. Our system will check for GxP requirements, missing sections, and compliance gaps."
              actionText="Upload Your First Document"
onAction={() => {
                // Trigger file dialog through DocumentUploadSection with improved reliability
                try {
                  const fileInput = document.querySelector('input[type="file"][accept*=".pdf"]');
                  if (fileInput && !fileInput.disabled) {
                    fileInput.click();
                  } else {
                    // Fallback: scroll to upload section and try to find button
                    const uploadSection = document.querySelector('[data-upload-section="true"]');
                    if (uploadSection) {
                      uploadSection.scrollIntoView({ behavior: 'smooth' });
                      // Try to find and click the upload button after scroll
                      setTimeout(() => {
                        const uploadButton = uploadSection.querySelector('button');
                        if (uploadButton && !uploadButton.disabled) {
                          uploadButton.click();
                        }
                      }, 300);
                    }
                  }
                } catch (error) {
                  console.error('Error triggering file upload:', error);
                  // Final fallback: scroll to upload section
                  const uploadSection = document.querySelector('[data-upload-section="true"]');
                  if (uploadSection) {
                    uploadSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              icon="FileCheck"
            />
          </div>
        ) : (
          /* Main Dashboard Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Document Upload/Preview */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <ApperIcon name="Upload" className="w-5 h-5 mr-2 text-primary-600" />
                      Document
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <DocumentUploadSection
                      onDocumentProcessed={handleDocumentProcessed}
                      currentDocument={currentDocument}
                      onDocumentDelete={handleDocumentDelete}
                    />
                  </CardContent>
                </Card>

                {/* Validation Status */}
                {validationResult && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-green-600" />
                        Status
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Validation</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ApperIcon name="CheckCircle2" className="w-3 h-3 mr-1" />
                            Complete
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Issues Found</span>
                          <span className="text-gray-900 font-semibold">
                            {validationResult.issues.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Process Time</span>
                          <span className="text-gray-900 font-semibold">
                            {validationResult.processTime}s
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Validation Results */}
            <div className="lg:col-span-8">
              {showingResults && validationResult ? (
                <ValidationResults
                  validationResult={validationResult}
                  document={currentDocument}
                />
              ) : (
                <Card className="h-96">
                  <CardContent className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ApperIcon name="Clock" className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Waiting for Validation
                      </h3>
                      <p className="text-gray-600">
                        Upload a document to see detailed compliance validation results here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Feature Highlights - Only show in empty state */}
        {!currentDocument && (
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Comprehensive GxP Compliance Validation
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered system validates regulatory documents against industry standards, 
                ensuring your documentation meets audit requirements and compliance standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="FileCheck" className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Structure</h3>
                <p className="text-gray-600">
                  Validates required sections including Title, Purpose, Scope, Responsibilities, 
                  Definitions, Procedure, References, and Approvals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Database" className="w-8 h-8 text-green-600" />
</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Metadata Validation</h3>
                <p className="text-gray-600">
                  Comprehensive validation including Document ID format (SOP-###), version/revision tracking, 
                  YYYY-MM-DD effective dates, complete revision history tables, and signature accountability 
                  for Prepared by, Reviewed by, and Approved by roles.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="AlertTriangle" className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Quality</h3>
                <p className="text-gray-600">
                  Detects placeholder text, validates reference formats, ensures proper 
                  procedure steps, and checks for complete approval signatures.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplianceDashboard;