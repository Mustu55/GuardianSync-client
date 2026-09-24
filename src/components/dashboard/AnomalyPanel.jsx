import { useSelector } from 'react-redux';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Brain, AlertTriangle } from 'lucide-react';

export default function AnomalyPanel() {
  const lastResult = useSelector((s) => s.commands.lastResult);
  const ai = lastResult?.aiResult;

  const score = ai?.anomalyScore ?? null;
  const label = ai?.action === 'BLOCK' ? 'BLOCKED' : ai ? 'PASS' : 'IDLE';

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-cyber-glow" />
          <Card.Title>AI Anomaly Detection</Card.Title>
        </div>
        {ai && (
          <Badge variant={ai.action === 'BLOCK' ? 'danger' : 'success'}>
            {label}
          </Badge>
        )}
      </Card.Header>

      {!ai && (
        <div className="text-xs text-cyber-muted flex items-center gap-2">
          <AlertTriangle size={14} className="text-cyber-muted" />
          Waiting for command analysis...
        </div>
      )}

      {ai && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-cyber-text-dim">
            <span>Score</span>
            <span className={`font-mono ${score > 0.6 ? 'text-red-400' : score > 0.4 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {(score * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-cyber-muted leading-relaxed">
            {ai.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}
