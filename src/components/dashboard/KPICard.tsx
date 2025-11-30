import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  delta: number;
  sparklineData: number[];
  prefix?: string;
  suffix?: string;
}

export const KPICard = ({ title, value, delta, sparklineData, prefix = "", suffix = "" }: KPICardProps) => {
  const isPositive = delta >= 0;
  const chartData = sparklineData.map((value, index) => ({ value, index }));

  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-6 panel-shadow hover-lift">
      <h3 className="text-sm font-medium opacity-90 mb-3">{title}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold">
          {prefix}{value}{suffix}
        </span>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(delta)}%
        </div>
      </div>
      <div className="h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
