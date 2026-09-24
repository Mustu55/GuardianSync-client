import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../common/Card';
import { Activity } from 'lucide-react';

export default function ThreatTimeline() {
  const threatHistory = useSelector((s) => s.ui.threatHistory);

  const data = threatHistory.map((item, i) => ({
    time: new Date(item.time).toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
    score: Math.round(item.score * 100),
    index: i,
  }));

  // Ensure we have enough points for a meaningful chart
  while (data.length < 10) {
    data.unshift({ time: '', score: Math.floor(Math.random() * 15 + 5), index: -data.length });
  }

  const currentScore = threatHistory.length > 0 ? threatHistory[threatHistory.length - 1].score : 0;
  const color = currentScore > 0.6 ? '#ef4444' : currentScore > 0.3 ? '#f59e0b' : '#06b6d4';

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-cyber-card border border-cyber-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-cyber-text-dim">{payload[0]?.payload?.time}</p>
        <p className="text-sm font-semibold" style={{ color }}>
          Threat: {payload[0]?.value}%
        </p>
      </div>
    );
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyber-glow" />
          <Card.Title>Threat Timeline</Card.Title>
        </div>
        <span className="text-lg font-bold" style={{ color }}>
          {(currentScore * 100).toFixed(1)}%
        </span>
      </Card.Header>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="score" stroke={color} strokeWidth={2}
              fill="url(#threatGradient)" animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
