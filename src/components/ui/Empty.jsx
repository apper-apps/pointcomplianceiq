import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No Documents to Validate",
  message = "Upload your first regulatory document to start the compliance validation process.",
  actionText = "Upload Document",
  onAction,
  icon = "FileText"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <div className="max-w-md mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{message}</p>
      </div>
      
      <div className="space-y-4">
        {onAction && (
          <Button onClick={onAction} variant="primary" size="lg">
            <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
            {actionText}
          </Button>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Supported formats: PDF, Word Document (.docx), Text (.txt)</p>
        </div>
      </div>
      
      {/* Feature Highlights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Shield" className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">GxP Compliance</h4>
          <p className="text-sm text-gray-600">Validates against regulatory standards</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Zap" className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Instant Results</h4>
          <p className="text-sm text-gray-600">Get compliance scores in seconds</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Target" className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Detailed Reports</h4>
          <p className="text-sm text-gray-600">Identify specific compliance gaps</p>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 right-12 w-32 h-32 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-12 left-12 w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 blur-2xl"></div>
      </div>
    </div>
  );
};

export default Empty;