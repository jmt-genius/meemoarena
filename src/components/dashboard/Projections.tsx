import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProjectionData {
  month: string;
  revenue: number;
  users: number;
  margin: number;
}

interface ProjectionsProps {
  baseCase: ProjectionData[];
  optimistic: ProjectionData[];
}

export const Projections = ({ baseCase, optimistic }: ProjectionsProps) => {
  const percentDelta = {
    revenue: ((optimistic[optimistic.length - 1].revenue - baseCase[baseCase.length - 1].revenue) / baseCase[baseCase.length - 1].revenue * 100).toFixed(1),
    users: ((optimistic[optimistic.length - 1].users - baseCase[baseCase.length - 1].users) / baseCase[baseCase.length - 1].users * 100).toFixed(1),
    margin: (optimistic[optimistic.length - 1].margin - baseCase[baseCase.length - 1].margin).toFixed(1)
  };

  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">6-Month Projections</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2F63C9]"></div>
            <span>Base Case</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#5B8FDB]"></div>
            <span>Optimistic</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/20 rounded-2xl p-4">
          <div className="text-sm opacity-80 mb-1">Revenue Delta</div>
          <div className="text-2xl font-bold text-green-300">+{percentDelta.revenue}%</div>
        </div>
        <div className="bg-secondary/20 rounded-2xl p-4">
          <div className="text-sm opacity-80 mb-1">Users Delta</div>
          <div className="text-2xl font-bold text-green-300">+{percentDelta.users}%</div>
        </div>
        <div className="bg-secondary/20 rounded-2xl p-4">
          <div className="text-sm opacity-80 mb-1">Margin Delta</div>
          <div className="text-2xl font-bold text-green-300">+{percentDelta.margin}pp</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month"
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.9)' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.9)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.9)' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(30, 71, 168, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                color: 'white'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              data={baseCase}
              type="monotone" 
              dataKey="revenue" 
              stroke="#2F63C9" 
              strokeWidth={2}
              name="Base Revenue"
            />
            <Line 
              yAxisId="left"
              data={optimistic}
              type="monotone" 
              dataKey="revenue" 
              stroke="#5B8FDB" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Optimistic Revenue"
            />
            <Line 
              yAxisId="right"
              data={baseCase}
              type="monotone" 
              dataKey="users" 
              stroke="#A7C8EB" 
              strokeWidth={2}
              name="Base Users"
            />
            <Line 
              yAxisId="right"
              data={optimistic}
              type="monotone" 
              dataKey="users" 
              stroke="#7FAFDF" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Optimistic Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
