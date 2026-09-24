import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../common/Card';
import Button from '../common/Button';
import { api } from '../../services/api';
import { setSimulationActive, setSimulationMode, setMaintenance } from '../../store/uiSlice';
import { setCurrentIndustry } from '../../store/mapSlice';
import { Settings, Play, Square, RotateCcw } from 'lucide-react';

export default function ControlPanel() {
  const dispatch = useDispatch();
  const currentIndustry = useSelector((s) => s.map.currentIndustry);
  const simulationActive = useSelector((s) => s.ui.simulationActive);
  const simulationMode = useSelector((s) => s.ui.simulationMode);
  const maintenanceActive = useSelector((s) => s.ui.maintenanceActive);
  const maintenanceWindow = useSelector((s) => s.ui.maintenanceWindow);
  const [loading, setLoading] = useState(false);
  const [windowMinutes, setWindowMinutes] = useState(30);

  const handleSimControl = async (action) => {
    setLoading(true);
    try {
      const res = await api.controlSimulation(action, currentIndustry, simulationMode);
      dispatch(setSimulationActive(res.simulationActive));
      dispatch(setSimulationMode(res.simulationMode || simulationMode));
    } catch (err) {
      console.error('Simulation control failed:', err);
    }
    setLoading(false);
  };

  const handleModeChange = async (mode) => {
    setLoading(true);
    try {
      const res = await api.controlSimulation('switch', currentIndustry, mode);
      dispatch(setSimulationMode(res.simulationMode || mode));
    } catch (err) {
      console.error('Mode change failed:', err);
    }
    setLoading(false);
  };

  const handleMaintenance = async (active) => {
    setLoading(true);
    try {
      const res = await api.toggleMaintenance(active, windowMinutes);
      dispatch(setMaintenance({ active: res.maintenanceActive, window: res.maintenanceWindow }));
    } catch (err) {
      console.error('Maintenance toggle failed:', err);
    }
    setLoading(false);
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-cyber-glow" />
          <Card.Title>Control Panel</Card.Title>
        </div>
      </Card.Header>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-cyber-bg/50 rounded-lg">
          <span className="text-xs text-cyber-text-dim">SCADA Simulation</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${simulationActive ? 'bg-cyber-success animate-pulse' : 'bg-cyber-muted'}`} />
            <span className="text-xs text-cyber-text-dim">{simulationActive ? 'Running' : 'Stopped'}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="success"
            size="sm"
            icon={Play}
            onClick={() => handleSimControl('start')}
            loading={loading}
            disabled={simulationActive}
          >
            Start
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Square}
            onClick={() => handleSimControl('stop')}
            loading={loading}
            disabled={!simulationActive}
          >
            Stop
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={() => handleSimControl('start')}
            loading={loading}
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['normal', 'attack', 'maintenance'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-2 py-1.5 rounded-lg text-[11px] uppercase tracking-wider border transition-all ${
                simulationMode === mode
                  ? 'bg-cyber-glow/20 text-cyber-accent border-cyber-glow/40'
                  : 'bg-cyber-bg text-cyber-muted border-cyber-border hover:text-cyber-text-dim'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="bg-cyber-bg/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-text-dim">Maintenance Lockdown</span>
            <span className={`text-xs ${maintenanceActive ? 'text-amber-400' : 'text-cyber-muted'}`}>
              {maintenanceActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              max="240"
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-20 bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs text-cyber-text-dim focus:outline-none"
            />
            <span className="text-[10px] text-cyber-muted">minutes</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleMaintenance(true)}
              disabled={maintenanceActive || loading}
            >
              Enable
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleMaintenance(false)}
              disabled={!maintenanceActive || loading}
            >
              Disable
            </Button>
          </div>
          {maintenanceWindow?.endsAt && (
            <p className="text-[10px] text-cyber-muted">
              Ends at {new Date(maintenanceWindow.endsAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
