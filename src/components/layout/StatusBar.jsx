import { useSelector } from 'react-redux';
import { formatTimestamp } from '../../utils/formatters';

export default function StatusBar() {
  const connected = useSelector((s) => s.ui.connected);
  const simulationActive = useSelector((s) => s.ui.simulationActive);
  const killSwitch = useSelector((s) => s.ui.killSwitchActive);
  const maintenanceActive = useSelector((s) => s.ui.maintenanceActive);
  const simulationMode = useSelector((s) => s.ui.simulationMode);
  const threatScore = useSelector((s) => s.ui.threatScore);
  const packetCount = useSelector((s) => s.map.packets.length);
  const currentIndustry = useSelector((s) => s.map.currentIndustry);

  return (
    <footer className="min-h-7 bg-cyber-surface/60 border-t border-cyber-border px-3 sm:px-4 py-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] sm:text-[11px] text-cyber-muted font-mono">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-cyber-success' : 'bg-cyber-danger'}`} />
          {connected ? 'ONLINE' : 'OFFLINE'}
        </span>
        <span>INDUSTRY: {currentIndustry.toUpperCase().replace('_', ' ')}</span>
        <span className="hidden sm:inline">MODE: {simulationMode.toUpperCase()}</span>
        <span className="hidden md:inline">PACKETS: {packetCount}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>THREAT: {(threatScore * 100).toFixed(1)}%</span>
        {maintenanceActive && <span className="text-amber-400">MAINTENANCE</span>}
        {killSwitch && <span className="text-red-400 animate-pulse">⚠ KILL SWITCH</span>}
        <span className="hidden sm:inline">{formatTimestamp(Date.now())}</span>
      </div>
    </footer>
  );
}
