import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ 
  className, 
  value = 0, 
  max = 100,
  variant = "primary",
  size = "default",
  showValue = false,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max(value, 0), max) * (100 / max);
  
  const variants = {
    primary: "bg-primary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500"
  };
  
  const sizes = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3"
  };
  
  return (
    <div className="w-full">
      {showValue && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        ref={ref}
        className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizes[size], className)}
        {...props}
      >
        <div
          className={cn("transition-all duration-500 ease-out rounded-full", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;