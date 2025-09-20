import { cn } from "@/lib/utils";

interface MicroLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MicroLoading({ size = "md", className }: MicroLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {/* Screen reader text removed to prevent visual display */}
    </div>
  );
}
