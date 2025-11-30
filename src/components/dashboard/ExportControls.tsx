import { Download, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ExportControls = () => {
  const handleExportPDF = () => {
    toast.success("PDF export initiated", {
      description: "Your dashboard report is being generated..."
    });
  };

  const handleExportCSV = () => {
    toast.success("CSV export started", {
      description: "Downloading raw data..."
    });
  };

  const handleShare = () => {
    toast.success("Snapshot link copied", {
      description: "Share this dashboard with stakeholders"
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-6 panel-shadow">
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={handleExportPDF}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6 py-6 font-semibold"
        >
          <FileText className="mr-2 h-5 w-5" />
          Export PDF
        </Button>
        <Button 
          onClick={handleExportCSV}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6 py-6 font-semibold"
        >
          <Download className="mr-2 h-5 w-5" />
          Export CSV
        </Button>
        <Button 
          onClick={handleShare}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-6 py-6 font-semibold"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Snapshot
        </Button>
      </div>
    </div>
  );
};
