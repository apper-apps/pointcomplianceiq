import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import { format } from "date-fns";

const DocumentPreview = ({ document, onDelete, className }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!document) return null;

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return "FileText";
      case "docx": return "FileText";
      case "txt": return "FileType";
      default: return "File";
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case "pdf": return "PDF Document";
      case "docx": return "Word Document";
      case "txt": return "Text Document";
      default: return "Document";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "warning";
      case "failed": return "danger";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle2";
      case "processing": return "Clock";
      case "failed": return "XCircle";
      default: return "FileText";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const truncatedContent = document.content?.length > 500 
    ? document.content.substring(0, 500) + "..."
    : document.content;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document.Id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name={getFileIcon(document.type)} className="w-6 h-6 text-primary-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {document.fileName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getFileTypeLabel(document.type)} • Uploaded {format(new Date(document.uploadDate), "MMM d, yyyy 'at' h:mm a")}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getStatusColor(document.status)}>
                  <ApperIcon name={getStatusIcon(document.status)} className="w-3 h-3 mr-1" />
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
                
                {document.status === "completed" && (
                  <Badge variant="primary">
                    Score: {document.complianceScore}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {document.content && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Document Content</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {showFullContent ? document.content : truncatedContent}
                </pre>
                
                {document.content.length > 500 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="mt-2"
                  >
                    {showFullContent ? "Show Less" : "Show More"}
                    <ApperIcon 
                      name={showFullContent ? "ChevronUp" : "ChevronDown"} 
                      className="w-4 h-4 ml-1" 
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{document.fileName}"? This will permanently remove the document and its validation results.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;