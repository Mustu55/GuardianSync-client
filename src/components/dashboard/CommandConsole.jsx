import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCommandStream } from '../../hooks/useCommandStream';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Terminal, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMAND_LIBRARY = [
  { cmd: 'START_MACHINE', desc: 'Start machine sequence', risk: 'safe' },
  { cmd: 'STOP_MACHINE', desc: 'Stop machine sequence', risk: 'safe' },
  { cmd: 'OPEN_VALVE', desc: 'Open valve', risk: 'safe' },
  { cmd: 'CLOSE_VALVE', desc: 'Close valve', risk: 'safe' },
  { cmd: 'LOAD_INCREASE', desc: 'Increase load', risk: 'safe' },
  { cmd: 'LOAD_DECREASE', desc: 'Decrease load', risk: 'safe' },
  { cmd: 'READ_SENSOR', desc: 'Read sensor data', risk: 'safe' },
  { cmd: 'CHECK_STATUS', desc: 'Read machine status', risk: 'safe' },
  { cmd: 'DIAGNOSTICS', desc: 'Run diagnostics', risk: 'safe' },
  { cmd: 'MAINTENANCE_MODE', desc: 'Toggle maintenance mode', risk: 'caution' },
  { cmd: 'CALIBRATE_SENSOR', desc: 'Calibrate sensor', risk: 'caution' },
  { cmd: 'RUN_DIAGNOSTICS', desc: 'Deep diagnostics', risk: 'caution' },
  { cmd: 'LOCKOUT_TAGOUT', desc: 'Lockout procedure', risk: 'caution' },
  { cmd: 'EMERGENCY_SHUTDOWN', desc: 'Emergency shutdown', risk: 'critical' },
  { cmd: 'OVERRIDE_SAFETY', desc: 'Override safety systems', risk: 'critical' },
  { cmd: 'DISABLE_ALARM', desc: 'Disable alarms', risk: 'critical' },
  { cmd: 'FORCE_VALVE_OPEN', desc: 'Force valve open', risk: 'critical' },
  { cmd: 'BYPASS_INTERLOCK', desc: 'Bypass interlocks', risk: 'critical' },
  { cmd: 'SET_MAX_PRESSURE', desc: 'Set max pressure', risk: 'critical' },
];

export default function CommandConsole({ expanded }) {
  const { sendCommand, commandHistory, isSubmitting } = useCommandStream();
  const currentIndustry = useSelector((s) => s.map.currentIndustry);
  const machines = useSelector((s) => s.map.nodes);
  const [input, setInput] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const logRef = useRef(null);
  const getDisplayStatus = (result) => (
    result?.aiResult?.action === 'BLOCK' ? 'blocked' : result?.status
  );
  const lastResult = commandHistory[0]?.result;
  const packetStatus = getDisplayStatus(lastResult) || (isSubmitting ? 'pending' : null);
  const packetColor = packetStatus === 'blocked'
    ? 'from-red-500/80 to-red-500/10'
    : packetStatus === 'pending'
    ? 'from-amber-400/70 to-amber-400/10'
    : packetStatus === 'approved' || packetStatus === 'executed'
    ? 'from-emerald-400/70 to-emerald-400/10'
    : 'from-cyber-glow/70 to-cyber-glow/10';

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [commandHistory.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const machine = selectedMachine || machines[0]?.id || 'unknown';
    const params = {
      temperature: +(Math.random() * 65 + 20).toFixed(2),
      pressure: +(Math.random() * 150 + 50).toFixed(2),
      flow_rate: +(Math.random() * 120 + 30).toFixed(2),
      voltage: +(Math.random() * 40 + 210).toFixed(2),
      current: +(Math.random() * 25 + 5).toFixed(2),
      rpm: Math.floor(Math.random() * 2800 + 800),
      vibration: +(Math.random() * 4.5 + 0.5).toFixed(2),
      humidity: +(Math.random() * 50 + 20).toFixed(2),
      power_consumption: +(Math.random() * 45 + 5).toFixed(2),
      response_time: Math.floor(Math.random() * 90 + 10),
      packet_size: Math.floor(Math.random() * 960 + 64),
      command_frequency: +(Math.random() * 19 + 1).toFixed(1),
      error_rate: +(Math.random() * 0.05).toFixed(4),
      network_latency: Math.floor(Math.random() * 45 + 5),
    };

    // If it's an attack command, spike some values
    if (input.includes('OVERRIDE') || input.includes('DISABLE') || input.includes('FORCE') || input.includes('BYPASS')) {
      params.temperature = +(Math.random() * 200 + 150).toFixed(2);
      params.pressure = +(Math.random() * 500 + 400).toFixed(2);
      params.command_frequency = +(Math.random() * 150 + 50).toFixed(1);
      params.error_rate = +(Math.random() * 0.6 + 0.3).toFixed(3);
      params.vibration = +(Math.random() * 30 + 15).toFixed(2);
    }

    try {
      await sendCommand(input, machine, currentIndustry, params);
    } catch (err) {
      // Error already captured in history
    }
    setInput('');
  };

  return (
    <Card className={expanded ? 'h-full flex flex-col' : ''}>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyber-glow" />
          <Card.Title>Command Console</Card.Title>
        </div>
        <Badge variant="glow">{currentIndustry.replace('_', ' ')}</Badge>
      </Card.Header>

        <div className="mb-3">
          <div className="h-2 w-full rounded-full bg-cyber-bg/60 border border-cyber-border overflow-hidden">
            {packetStatus && (
              <motion.div
                key={`${packetStatus}-${commandHistory.length}`}
                initial={{ x: '-20%', opacity: 0 }}
                animate={{ x: '120%', opacity: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className={`h-full w-1/3 bg-gradient-to-r ${packetColor}`}
              />
            )}
          </div>
          <p className="mt-1 text-[10px] text-cyber-muted uppercase tracking-widest">
            {packetStatus ? `Packet: ${packetStatus}` : 'Packet: idle'}
          </p>
        </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 mb-3">
          {COMMAND_LIBRARY.map((p) => (
          <button
            key={p.cmd}
            onClick={() => setInput(p.cmd)}
            className={`px-2 py-1 rounded text-[11px] font-mono border transition-all ${
                p.risk === 'safe'
                ? 'bg-cyber-bg border-cyber-border text-cyber-text-dim hover:border-cyber-glow/30 hover:text-cyber-accent'
                  : p.risk === 'critical'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:border-red-500/40'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:border-amber-500/40'
            }`}
            title={p.desc}
          >
            {p.cmd}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <select
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
          className="bg-cyber-bg border border-cyber-border rounded-lg px-2 py-2 text-xs text-cyber-text-dim focus:outline-none focus:border-cyber-glow w-36"
        >
          <option value="">Auto (target)</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.data?.label || m.id}</option>
          ))}
        </select>
        <div className="flex-1 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type SCADA command..."
            className="flex-1 bg-cyber-bg border border-cyber-border border-r-0 rounded-l-lg px-3 py-2 text-sm font-mono text-cyber-accent focus:outline-none focus:border-cyber-glow placeholder:text-cyber-muted"
          />
          <button
            onClick={handleSend}
            disabled={isSubmitting || !input.trim()}
            className="px-4 bg-cyber-glow text-cyber-bg rounded-r-lg hover:bg-cyan-500 transition-colors disabled:opacity-40 flex items-center"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Output */}
      <div ref={logRef} className="flex-1 overflow-auto max-h-[260px] bg-cyber-bg/60 rounded-lg border border-cyber-border p-2 font-mono text-xs space-y-1.5">
        <AnimatePresence initial={false}>
          {commandHistory.map((entry, i) => (
            <motion.div
              key={entry.time + i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="leading-relaxed"
            >
              <span className="text-cyber-muted">{'>'} </span>
              <span className="text-cyber-accent">{entry.input}</span>
              {entry.result && (
                <div className="ml-2 mt-0.5">
                  <Badge status={getDisplayStatus(entry.result)}>{getDisplayStatus(entry.result)}</Badge>
                  <span className={`ml-2 ${
                    getDisplayStatus(entry.result) === 'blocked'
                      ? 'text-red-400'
                      : getDisplayStatus(entry.result) === 'pending'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    [{entry.result.aiResult?.action}] Score: {((entry.result.aiResult?.anomalyScore || 0) * 100).toFixed(1)}%
                  </span>
                  <p className="text-cyber-muted mt-0.5 text-[10px] leading-snug">
                    {entry.result.aiResult?.explanation}
                  </p>
                </div>
              )}
              {entry.error && (
                <p className="ml-2 text-red-400 mt-0.5">Error: {entry.error}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {commandHistory.length === 0 && (
          <p className="text-cyber-muted text-center py-6">
            Ready. Type a command or click a preset above.
          </p>
        )}
      </div>
    </Card>
  );
}
