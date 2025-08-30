import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  backText?: string;
}

const PageHeader = ({ 
  title, 
  showBackButton = false, 
  onBack, 
  backText = "Back" 
}: PageHeaderProps) => {
  return (
    <div className="flex items-center mb-8">
      {showBackButton && onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backText}
        </Button>
      )}
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default PageHeader;