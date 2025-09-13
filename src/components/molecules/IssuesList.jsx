import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";

const IssuesList = ({ issues = [], className }) => {
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [expandedIssue, setExpandedIssue] = useState(null);

  const severityFilters = [
    { value: "all", label: "All Issues", count: issues.length },
    { value: "Critical", label: "Critical", count: issues.filter(i => i.severity === "Critical").length },
    { value: "Major", label: "Major", count: issues.filter(i => i.severity === "Major").length },
    { value: "Minor", label: "Minor", count: issues.filter(i => i.severity === "Minor").length }
  ];

  const filteredIssues = selectedSeverity === "all" 
    ? issues 
    : issues.filter(issue => issue.severity === selectedSeverity);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Critical": return "AlertTriangle";
      case "Major": return "AlertCircle";
      case "Minor": return "Info";
      default: return "AlertCircle";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical": return "danger";
      case "Major": return "warning";
      case "Minor": return "secondary";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Structure": return "Layout";
      case "Metadata": return "FileText";
      case "Content": return "Type";
      default: return "AlertCircle";
    }
  };

  const getSeverityRecommendation = (severity) => {
    switch (severity) {
      case "Critical":
        return "Must be resolved before document approval. This issue prevents compliance certification.";
      case "Major":
        return "Should be resolved promptly. This issue may impact audit outcomes.";
      case "Minor":
        return "Consider addressing during next revision. This issue represents a best practice opportunity.";
      default:
        return "Review and address as appropriate.";
    }
  };

  if (issues.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle2" className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
          <p className="text-gray-600">This document passes all compliance validation checks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Compliance Issues</h2>
              <p className="text-gray-600 text-sm">{issues.length} issues found requiring attention</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {severityFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedSeverity(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSeverity === filter.value
                      ? "bg-primary-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                      selectedSeverity === filter.value 
                        ? "bg-white bg-opacity-20" 
                        : "bg-gray-200"
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredIssues.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Search" className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-600">No issues found for the selected severity level.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        issue.severity === "Critical" ? "bg-red-100" :
                        issue.severity === "Major" ? "bg-orange-100" : "bg-yellow-100"
                      }`}>
                        <ApperIcon 
                          name={getSeverityIcon(issue.severity)} 
                          className={`w-5 h-5 ${
                            issue.severity === "Critical" ? "text-red-600" :
                            issue.severity === "Major" ? "text-orange-600" : "text-yellow-600"
                          }`} 
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="default">
                            <ApperIcon name={getCategoryIcon(issue.category)} className="w-3 h-3 mr-1" />
                            {issue.category}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1">
                          {issue.rule}
                        </h3>
                        <p className="text-gray-700 mb-2">{issue.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                          <span>{issue.location}</span>
                        </div>

                        {expandedIssue === issue.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                            <p className="text-gray-700 text-sm mb-3">
                              {getSeverityRecommendation(issue.severity)}
                            </p>
                            
                            <div className="text-sm text-gray-600">
                              <strong>Rule:</strong> {issue.rule}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                    >
                      <ApperIcon 
                        name={expandedIssue === issue.id ? "ChevronUp" : "ChevronDown"} 
                        className="w-4 h-4" 
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IssuesList;