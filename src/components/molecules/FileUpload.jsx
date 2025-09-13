import { useState, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileUpload = ({ onFileUpload, isUploading = false, className }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, or text file.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be less than 10MB.");
      return;
    }

    onFileUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getFileTypeIcon = () => {
    return "FileText";
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
          isUploading && "pointer-events-none opacity-60"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Processing Document</h3>
              <p className="text-gray-600 mt-1">Validating compliance rules...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name={getFileTypeIcon()} className="w-8 h-8 text-primary-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {dragOver ? "Drop your document here" : "Upload Document"}
              </h3>
              <p className="text-gray-600 mt-1">
                Drag and drop your file here, or click to browse
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                size="lg"
              >
                <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
                Choose File
              </Button>

              <div className="text-sm text-gray-500 space-y-1">
                <p>Supported formats: PDF, Word Document (.docx), Text (.txt)</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* Recent Upload Hints */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <ApperIcon name="Shield" className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-blue-900">GxP Validation</h4>
          <p className="text-xs text-blue-700 mt-1">Checks all regulatory requirements</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <ApperIcon name="Zap" className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-green-900">Fast Processing</h4>
          <p className="text-xs text-green-700 mt-1">Results in under 30 seconds</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <ApperIcon name="FileCheck" className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-purple-900">Detailed Report</h4>
          <p className="text-xs text-purple-700 mt-1">Comprehensive issue analysis</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;