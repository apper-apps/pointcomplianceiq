import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Processing document...", showDetails = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-primary-100 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="FileText" className="w-6 h-6 text-primary-500" />
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        
        {showDetails && (
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <span>Parsing document content</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <span>Validating GxP compliance</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span>Calculating compliance score</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
    </div>
  );
};

export default Loading;