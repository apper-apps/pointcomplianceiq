import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Validation Failed", 
  message = "We encountered an error while processing your document. Please try again.",
  onRetry,
  showDetails = false,
  details = null
}) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
      </div>
      
      <div className="max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{message}</p>
        
        {showDetails && details && (
          <div className="mt-4">
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-1"
            >
              <span>{showFullDetails ? "Hide" : "Show"} details</span>
              <ApperIcon 
                name={showFullDetails ? "ChevronUp" : "ChevronDown"} 
                className="w-4 h-4" 
              />
            </button>
            
            {showFullDetails && (
              <div className="mt-3 p-4 bg-red-50 rounded-md border border-red-100">
                <pre className="text-xs text-red-700 text-left overflow-auto">
                  {typeof details === "string" ? details : JSON.stringify(details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 right-8 w-20 h-20 bg-red-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 bg-red-100 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Error;