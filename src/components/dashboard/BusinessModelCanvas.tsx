import { Users, Activity, Heart, Target, Radio, DollarSign, TrendingDown } from "lucide-react";

interface CanvasTile {
  title: string;
  icon: React.ReactNode;
  metrics: { label: string; value: string | number }[];
}

interface BusinessModelCanvasProps {
  data: {
    keyPartners: { count: number; revenue: number };
    keyActivities: { events: number; automated: number };
    valueProps: { uniqueFeatures: number; satisfaction: number };
    customerSegments: { b2c: number; b2b: number };
    channels: { digital: number; offline: number };
    revenueStreams: { recurring: number; oneTime: number };
    costStructure: { fixed: number; variable: number };
  };
}

export const BusinessModelCanvas = ({ data }: BusinessModelCanvasProps) => {
  const tiles: CanvasTile[] = [
    {
      title: "Key Partners",
      icon: <Users className="w-5 h-5" />,
      metrics: [
        { label: "Partners", value: data.keyPartners.count },
        { label: "Revenue %", value: `${data.keyPartners.revenue}%` }
      ]
    },
    {
      title: "Key Activities",
      icon: <Activity className="w-5 h-5" />,
      metrics: [
        { label: "Events/Year", value: data.keyActivities.events },
        { label: "Automated", value: `${data.keyActivities.automated}%` }
      ]
    },
    {
      title: "Value Propositions",
      icon: <Heart className="w-5 h-5" />,
      metrics: [
        { label: "Features", value: data.valueProps.uniqueFeatures },
        { label: "CSAT", value: data.valueProps.satisfaction }
      ]
    },
    {
      title: "Customer Segments",
      icon: <Target className="w-5 h-5" />,
      metrics: [
        { label: "B2C", value: `${data.customerSegments.b2c}%` },
        { label: "B2B", value: `${data.customerSegments.b2b}%` }
      ]
    },
    {
      title: "Channels",
      icon: <Radio className="w-5 h-5" />,
      metrics: [
        { label: "Digital", value: `${data.channels.digital}%` },
        { label: "Offline", value: `${data.channels.offline}%` }
      ]
    },
    {
      title: "Revenue Streams",
      icon: <DollarSign className="w-5 h-5" />,
      metrics: [
        { label: "Recurring", value: `${data.revenueStreams.recurring}%` },
        { label: "One-time", value: `${data.revenueStreams.oneTime}%` }
      ]
    },
    {
      title: "Cost Structure",
      icon: <TrendingDown className="w-5 h-5" />,
      metrics: [
        { label: "Fixed", value: `${data.costStructure.fixed}%` },
        { label: "Variable", value: `${data.costStructure.variable}%` }
      ]
    }
  ];

  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">Business Model Canvas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <div 
            key={tile.title}
            className="bg-secondary/20 rounded-3xl p-5 hover-lift"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary/30 rounded-full p-2">
                {tile.icon}
              </div>
              <h3 className="font-semibold text-sm">{tile.title}</h3>
            </div>
            
            <div className="space-y-2">
              {tile.metrics.map((metric) => (
                <div key={metric.label} className="flex justify-between items-center">
                  <span className="text-xs opacity-80">{metric.label}</span>
                  <span className="font-bold">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
