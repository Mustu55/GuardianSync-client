import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setKillSwitch } from '../../store/uiSlice';
import { api } from '../../services/api';
import Card from '../common/Card';
import { Power, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KillSwitch() {
  const dispatch = useDispatch();
  const killSwitchActive = useSelector((s) => s.ui.killSwitchActive);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleToggle = async () => {
    setError('');
    setNotice('');
    if (!killSwitchActive && !confirming) {
      setConfirming(true);
      return;
    }

    try {
      const result = await api.toggleKillSwitch(!killSwitchActive);
      if (result?.pendingApproval) {
        setNotice('Disable request sent for admin approval.');
      } else {
        dispatch(setKillSwitch(!killSwitchActive));
      }
    } catch (err) {
      setError(err.message || 'Kill switch toggle failed');
      console.error('Kill switch toggle failed:', err);
    }
    setConfirming(false);
  };

  const handleCancel = () => setConfirming(false);

  return (
    <Card danger={killSwitchActive}>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Power size={16} className={killSwitchActive ? 'text-red-400' : 'text-cyber-glow'} />
          <Card.Title>Kill Switch</Card.Title>
        </div>
      </Card.Header>

      <div className="flex flex-col items-center py-2">
        {/* Kill switch button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`relative w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
            killSwitchActive
              ? 'bg-red-600/30 border-red-500 shadow-glow-danger'
              : 'bg-cyber-bg border-cyber-border hover:border-red-500/50 hover:bg-red-500/10'
          }`}
        >
          <Power size={32} className={killSwitchActive ? 'text-red-400' : 'text-cyber-muted'} />
          {killSwitchActive && (
            <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
          )}
        </motion.button>

        <p className={`mt-3 text-sm font-semibold ${killSwitchActive ? 'text-red-400 animate-pulse' : 'text-cyber-muted'}`}>
          {killSwitchActive ? '⚠ SYSTEMS HALTED' : 'ARMED — READY'}
        </p>

        {/* Confirmation dialog */}
        {notice && (
          <p className="mt-3 text-xs text-emerald-400 text-center">{notice}</p>
        )}
        {error && (
          <p className="mt-3 text-xs text-red-400 text-center">{error}</p>
        )}

        {confirming && !killSwitchActive && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 w-full"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-semibold">Confirm Kill Switch Activation</span>
            </div>
            <p className="text-xs text-cyber-muted mb-3">
              This will halt ALL SCADA operations immediately. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleToggle}
                className="flex-1 bg-red-600 text-white text-xs font-semibold py-1.5 rounded-md hover:bg-red-500 transition-colors"
              >
                CONFIRM
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-cyber-card text-cyber-text-dim text-xs py-1.5 rounded-md border border-cyber-border hover:border-cyber-glow/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
