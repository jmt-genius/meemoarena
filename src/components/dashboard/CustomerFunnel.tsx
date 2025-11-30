import { ArrowDown } from "lucide-react";

interface FunnelStage {
  stage: string;
  count: number;
  conversion: number;
  drop?: number;
}

interface CustomerFunnelProps {
  stages: FunnelStage[];
}

export const CustomerFunnel = ({ stages }: CustomerFunnelProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">Customer Acquisition Funnel</h2>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const width = stage.conversion;
          const isLast = index === stages.length - 1;
          
          return (
            <div key={stage.stage}>
              <div 
                className="bg-secondary rounded-2xl p-6 transition-all hover:scale-[1.02]"
                style={{ width: `${width}%`, minWidth: '60%' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{stage.stage}</div>
                    <div className="text-sm opacity-90">{stage.count.toLocaleString()} users</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stage.conversion}%</div>
                    <div className="text-xs opacity-80">conversion</div>
                  </div>
                </div>
              </div>
              
              {!isLast && stage.drop && (
                <div className="flex items-center gap-2 py-2 px-6 opacity-70">
                  <ArrowDown size={16} />
                  <span className="text-sm">
                    Drop: {stage.drop.toLocaleString()} users
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
