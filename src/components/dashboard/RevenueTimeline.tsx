import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RevenueData {
  month: string;
  recurring: number;
  oneTime: number;
  events: number;
}

interface RevenueTimelineProps {
  data: RevenueData[];
}

export const RevenueTimeline = ({ data }: RevenueTimelineProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-[50px] p-8 panel-shadow">
      <h2 className="text-2xl font-bold mb-6">12-Month Revenue Breakdown</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRecurring" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F63C9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2F63C9" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorOneTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E47A8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1E47A8" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B8FDB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#5B8FDB" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.9)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              tick={{ fill: 'rgba(255,255,255,0.9)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => `$${value.toLocaleString()}`}
              contentStyle={{ 
                background: 'rgba(30, 71, 168, 0.95)', 
                border: 'none', 
                borderRadius: '12px',
                color: 'white'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="recurring" 
              stackId="1"
              stroke="#2F63C9" 
              fill="url(#colorRecurring)"
              name="Recurring Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="oneTime" 
              stackId="1"
              stroke="#1E47A8" 
              fill="url(#colorOneTime)"
              name="One-time Sales"
            />
            <Area 
              type="monotone" 
              dataKey="events" 
              stackId="1"
              stroke="#5B8FDB" 
              fill="url(#colorEvents)"
              name="Event Tickets"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
