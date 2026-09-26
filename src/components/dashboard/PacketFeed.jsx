import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatTimestamp, truncate } from '../../utils/formatters';
import { Radio, Download } from 'lucide-react';
import Button from '../common/Button';
import { useState } from 'react';

export default function PacketFeed({ showAlerts, forensic, expanded }) {
  const packets = useSelector((s) => s.map.packets);
  const alerts = useSelector((s) => s.alerts.items);
  const commands = useSelector((s) => s.commands.recent);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const getPacketStatus = (packet) => {
    if (!packet.aiResult) return 'pending';
    return packet.aiResult.action === 'BLOCK' ? 'blocked' : 'approved';
  };

  const formatHoldReason = (value) => {
    if (!value) return null;
    if (value === 'maintenance') return 'Maintenance window active';
    if (value === 'anomaly') return 'Anomaly threshold triggered';
    return value.replace(/_/g, ' ');
  };

  const items = showAlerts
    ? alerts.map(a => ({
        id: a._id || a.timestamp,
        type: 'alert',
        severity: a.severity,
        status: a.metadata?.status,
        title: a.title,
        message: a.message,
        details: [
          a.metadata?.reasonSummary,
          a.metadata?.holdReason ? `Approval reason: ${formatHoldReason(a.metadata.holdReason)}` : null,
          a.metadata?.risk ? `Risk catalog: ${a.metadata.risk}` : null,
          a.metadata?.ruleFlags?.length ? `Rule flags: ${a.metadata.ruleFlags.slice(0, 4).join('; ')}` : null,
          a.metadata?.aiExplanation ? `AI signal: ${a.metadata.aiExplanation}` : null,
          a.anomalyScore != null ? `Anomaly score: ${(a.anomalyScore * 100).toFixed(1)}%` : null,
        ].filter(Boolean),
        time: a.timestamp || a.createdAt,
        machine: a.targetMachine,
        score: a.anomalyScore,
      }))
    : forensic
    ? commands.map(c => ({
        id: c._id || c.id || c.timestamp,
        type: 'command',
        status: c.status,
        title: c.command,
        message: `${c.holdReason ? `Hold: ${c.holdReason}. ` : ''}${c.aiResult?.explanation || ''}`,
        time: c.timestamp || c.createdAt,
        machine: c.targetMachine,
        score: c.aiResult?.anomalyScore,
      }))
    : packets.map((p, i) => ({
        id: p.packetId || `pkt-${i}`,
        type: p.aiResult ? 'analyzed' : 'raw',
        status: getPacketStatus(p),
        title: p.command,
        message: p.aiResult?.explanation || `→ ${p.targetMachine}`,
        time: p.timestamp,
        machine: p.targetMachine,
        score: p.aiResult?.anomalyScore,
      }));

  const filtered = filter === 'all' ? items
    : filter === 'blocked' ? items.filter(i => i.status === 'blocked' || i.severity === 'CRITICAL' || i.severity === 'HIGH')
    : items.filter(i => i.status === 'approved');

  const searched = query.trim().length
    ? filtered.filter((item) => {
        const q = query.toLowerCase();
        return [item.title, item.message, item.machine].filter(Boolean).some((val) => String(val).toLowerCase().includes(q));
      })
    : filtered;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardiansync-${forensic ? 'forensic' : 'packets'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={expanded ? 'h-full' : 'max-h-[420px]'}>
      <Card.Header className="items-start">
        <div className="flex min-w-0 items-center gap-2">
          <Radio size={16} className="text-cyber-glow animate-pulse" />
          <Card.Title>
            {showAlerts ? 'Alert Feed' : forensic ? 'Forensic Vault' : 'Live Packet Feed'}
          </Card.Title>
          <span className="text-xs text-cyber-muted">({filtered.length})</span>
        </div>
        <div className="ml-auto flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="min-w-0 flex-1 bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-cyber-text-dim focus:outline-none sm:flex-none"
          >
            <option value="all">All</option>
            <option value="blocked">Blocked / Threats</option>
            <option value="clean">Clean / Passed</option>
          </select>
          {forensic && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search logs"
              className="bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-cyber-text-dim focus:outline-none"
            />
          )}
          {forensic && (
            <Button variant="ghost" size="sm" onClick={handleExport} icon={Download}>Export</Button>
          )}
        </div>
      </Card.Header>

      <div className="overflow-auto max-h-[340px] space-y-1 pr-1">
        <AnimatePresence initial={false}>
          {searched.slice(0, 80).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 px-3 py-2 rounded-lg bg-cyber-bg/50 hover:bg-cyber-bg border border-transparent hover:border-cyber-border transition-all group sm:flex sm:items-start"
              onClick={() => {
                if (!showAlerts) return;
                setExpandedId((prev) => (prev === item.id ? null : item.id));
              }}
              role={showAlerts ? 'button' : undefined}
              aria-expanded={showAlerts ? expandedId === item.id : undefined}
            >
              <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                item.status === 'blocked' || item.severity === 'CRITICAL' ? 'bg-red-500' :
                item.severity === 'HIGH' ? 'bg-orange-500' :
                item.status === 'approved' ? 'bg-emerald-500' : 'bg-cyber-glow'
              }`} />

              <div className="flex-1 min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-cyber-text truncate">{item.title}</span>
                  {item.status && <Badge status={item.status}>{item.status}</Badge>}
                  {item.severity && <Badge severity={item.severity}>{item.severity}</Badge>}
                </div>
                <p className="text-[11px] text-cyber-muted truncate mt-0.5">
                  {item.machine && <span className="text-cyber-text-dim">[{item.machine}]</span>}{' '}
                  {truncate(item.message, 80)}
                </p>

                {showAlerts && expandedId === item.id && item.details?.length > 0 && (
                  <div className="mt-2 text-[11px] text-cyber-text-dim space-y-1">
                    {item.details.map((line, index) => (
                      <div key={`${item.id}-detail-${index}`}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {item.score != null && (
                <span className={`col-start-2 text-xs font-mono font-semibold sm:ml-auto sm:col-auto flex-shrink-0 ${
                  item.score > 0.6 ? 'text-red-400' : item.score > 0.3 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(item.score * 100).toFixed(0)}%
                </span>
              )}

              <span className="col-start-2 text-[10px] text-cyber-muted font-mono flex-shrink-0 sm:col-auto">
                {item.time ? formatTimestamp(item.time) : ''}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {searched.length === 0 && (
          <div className="text-center py-12 text-cyber-muted text-sm">
            No packets yet — waiting for data stream...
          </div>
        )}
      </div>
    </Card>
  );
}
