import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ComplianceScore = ({ score = 0, issues = [], className }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return "from-green-500 to-green-600";
    if (score >= 70) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return { text: "Excellent", icon: "CheckCircle2" };
    if (score >= 70) return { text: "Good", icon: "AlertCircle" };
    return { text: "Needs Improvement", icon: "XCircle" };
  };

  const severityCounts = {
    Critical: issues.filter(issue => issue.severity === "Critical").length,
    Major: issues.filter(issue => issue.severity === "Major").length,
    Minor: issues.filter(issue => issue.severity === "Minor").length
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const status = getScoreStatus(score);

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-md border border-gray-100", className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Compliance Score</h2>
          <p className="text-gray-600 text-sm">GxP validation results</p>
        </div>
        <div className={cn("p-2 rounded-lg", score >= 90 ? "bg-green-100" : score >= 70 ? "bg-yellow-100" : "bg-red-100")}>
          <ApperIcon 
            name={status.icon} 
            className={cn("w-5 h-5", getScoreColor(score))} 
          />
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-out",
                getScoreColor(score)
              )}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn("text-3xl font-bold", getScoreColor(score))}>
              {Math.round(animatedScore)}
            </div>
            <div className="text-sm text-gray-600">out of 100</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className={cn("text-lg font-semibold", getScoreColor(score))}>
          {status.text}
        </div>
        <p className="text-gray-600 text-sm mt-1">
          {score >= 90 
            ? "Document meets all major compliance requirements"
            : score >= 70 
            ? "Document has minor compliance issues to address"
            : "Document requires significant compliance improvements"
          }
        </p>
      </div>

      {issues.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Issue Summary</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {severityCounts.Critical > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{severityCounts.Critical}</div>
                <div className="text-xs text-red-600 font-medium">Critical</div>
              </div>
            )}
            
            {severityCounts.Major > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{severityCounts.Major}</div>
                <div className="text-xs text-orange-600 font-medium">Major</div>
              </div>
            )}
            
            {severityCounts.Minor > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{severityCounts.Minor}</div>
                <div className="text-xs text-yellow-600 font-medium">Minor</div>
              </div>
            )}
          </div>
        </div>
      )}

      {issues.length === 0 && score === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Trophy" className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Perfect Compliance!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            This document meets all GxP validation requirements.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplianceScore;