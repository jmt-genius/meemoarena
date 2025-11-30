import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Calendar, TrendingUp, DollarSign, Users } from "lucide-react";

interface Service {
  name: string;
  revenue: number;
  yoyGrowth: number;
  arpu: number;
  color: string;
}

interface ServicesBreakdownProps {
  services: Service[];
}

const iconMap: Record<string, React.ReactNode> = {
  Events: <Calendar className="w-4 h-4" />,
  Subscriptions: <Users className="w-4 h-4" />,
  Advertising: <TrendingUp className="w-4 h-4" />,
  Merchandise: <DollarSign className="w-4 h-4" />,
};

export const ServicesBreakdown = ({ services }: ServicesBreakdownProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">Revenue by Service</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={services}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="revenue"
              >
                {services.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                contentStyle={{ 
                  background: 'rgba(47, 99, 201, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="bg-secondary/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="bg-secondary/30 rounded-full p-2">
                {iconMap[service.name]}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{service.name}</div>
                <div className="text-sm opacity-80">ARPU: ${service.arpu}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{service.revenue}%</div>
                <div className="text-sm text-green-300">+{service.yoyGrowth}% YoY</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
