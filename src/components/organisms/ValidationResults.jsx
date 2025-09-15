import { useState, useEffect } from "react";
import ComplianceScore from "@/components/molecules/ComplianceScore";
import IssuesList from "@/components/molecules/IssuesList";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import { format } from "date-fns";

const ValidationResults = ({ validationResult, document, className }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  if (!validationResult || !document) return null;

  const handleExportReport = (format) => {
    const reportData = {
document: {
        name: document.file_name_c || document.Name,
        uploadDate: document.upload_date_c,
        type: document.type_c,
        size: document.size_c || 'Unknown'
      },
      validation: {
        score: validationResult.score,
        timestamp: validationResult.timestamp,
        processTime: validationResult.processTime,
        totalIssues: validationResult.issues.length
      },
      issues: validationResult.issues
    };

    if (format === "json") {
      downloadJSON(reportData, `compliance-report-${document.fileName}.json`);
    } else if (format === "csv") {
      downloadCSV(validationResult.issues, `compliance-issues-${document.fileName}.csv`);
    }

    setShowExportOptions(false);
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (issues, filename) => {
    const headers = ["Severity", "Category", "Rule", "Description", "Location"];
    const csvContent = [
      headers.join(","),
      ...issues.map(issue => [
        issue.severity,
        issue.category,
        `"${issue.rule}"`,
        `"${issue.description.replace(/"/g, '""')}"`,
        `"${issue.location}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return { text: "Audit Ready", color: "green", icon: "Shield" };
    if (score >= 70) return { text: "Minor Issues", color: "yellow", icon: "AlertTriangle" };
    return { text: "Needs Work", color: "red", icon: "XCircle" };
  };

  const status = getScoreStatus(validationResult.score);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Validation Summary</h2>
              <p className="text-gray-600 text-sm">
                Completed on {format(new Date(validationResult.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowExportOptions(!showExportOptions)}
              >
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export Report
                <ApperIcon name="ChevronDown" className="w-4 h-4 ml-2" />
              </Button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleExportReport("json")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                      JSON Report
                    </button>
                    <button
                      onClick={() => handleExportReport("csv")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <ApperIcon name="Table" className="w-4 h-4 mr-2" />
                      CSV Issues List
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                status.color === "green" ? "bg-green-100" :
                status.color === "yellow" ? "bg-yellow-100" : "bg-red-100"
              }`}>
                <ApperIcon 
                  name={status.icon} 
                  className={`w-8 h-8 ${
                    status.color === "green" ? "text-green-600" :
                    status.color === "yellow" ? "text-yellow-600" : "text-red-600"
                  }`} 
                />
              </div>
              <div className="text-2xl font-bold text-gray-900">{validationResult.score}%</div>
              <div className={`text-sm font-medium ${
                status.color === "green" ? "text-green-600" :
                status.color === "yellow" ? "text-yellow-600" : "text-red-600"
              }`}>
                {status.text}
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="AlertCircle" className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{validationResult.issues.length}</div>
              <div className="text-sm font-medium text-blue-600">Total Issues</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <ApperIcon name="Clock" className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{validationResult.processTime}s</div>
              <div className="text-sm font-medium text-purple-600">Process Time</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">
                <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                Re-validate Document
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                Share Results
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="BookOpen" className="w-4 h-4 mr-2" />
                View Guidelines
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Score Component */}
      <ComplianceScore 
        score={validationResult.score}
        issues={validationResult.issues}
      />

      {/* Issues List Component */}
      <IssuesList issues={validationResult.issues} />

      {/* Click outside to close export options */}
      {showExportOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowExportOptions(false)}
        />
      )}
    </div>
  );
};

export default ValidationResults;