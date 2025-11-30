import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Channel {
  name: string;
  cac: number;
  ltv: number;
  roas: number;
}

interface ChannelPerformanceProps {
  channels: Channel[];
}

const COLORS = ['#2F63C9', '#1E47A8', '#5B8FDB', '#7FAFDF'];

export const ChannelPerformance = ({ channels }: ChannelPerformanceProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">Acquisition Channel Performance</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 opacity-90">ROAS by Channel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channels} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.9)' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.9)' }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}x`}
                  contentStyle={{ 
                    background: 'rgba(30, 71, 168, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="roas" radius={[0, 8, 8, 0]}>
                  {channels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 opacity-90">Channel Metrics</h3>
          {channels.map((channel, index) => (
            <div 
              key={channel.name} 
              className="bg-secondary/20 rounded-2xl p-4"
              style={{ borderLeft: `4px solid ${COLORS[index % COLORS.length]}` }}
            >
              <div className="font-semibold mb-2">{channel.name}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="opacity-70">CAC</div>
                  <div className="font-bold">${channel.cac}</div>
                </div>
                <div>
                  <div className="opacity-70">LTV</div>
                  <div className="font-bold">${channel.ltv}</div>
                </div>
                <div>
                  <div className="opacity-70">ROAS</div>
                  <div className="font-bold text-green-300">{channel.roas.toFixed(1)}x</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
