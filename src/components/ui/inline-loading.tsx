import { MicroLoading } from './micro-loading';

interface InlineLoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function InlineLoading({ 
  text = "Loading...", 
  size = "sm", 
  className = "" 
}: InlineLoadingProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MicroLoading size={size} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}
