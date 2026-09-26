import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';
import { removeFromPending } from '../../store/commandSlice';
import { setKillSwitch, setPendingRequestCount } from '../../store/uiSlice';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { CheckCircle, XCircle, Clock, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatters';

export default function ManualApproval() {
  const dispatch = useDispatch();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    setError('');
    try {
      const data = await api.getPendingCommands();
      setPending(data);
      dispatch(setPendingRequestCount(data.length));
    } catch {
      setPending([]);
      dispatch(setPendingRequestCount(0));
      setError('Unable to load pending approvals.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 5000);
    
    // Add socket listeners for real-time updates
    const socket = getSocket();
    const handleApproved = (data) => {
      if (data?.command === 'KILL_SWITCH_OFF') {
        dispatch(setKillSwitch(false));
      }
      setPending(prev => {
        const updated = prev.filter(c => c._id !== data.id);
        dispatch(setPendingRequestCount(updated.length));
        return updated;
      });
    };
    
    const handleRejected = (data) => {
      setPending(prev => {
        const updated = prev.filter(c => c._id !== data.id);
        dispatch(setPendingRequestCount(updated.length));
        return updated;
      });
    };
    
    const handleNewApproval = (data) => {
      if (data?.type === 'kill_switch') {
        fetchPending(); // Refresh to get new pending commands
      }
    };
    
    socket.on('command:approved', handleApproved);
    socket.on('command:rejected', handleRejected);
    socket.on('approval:new', handleNewApproval);
    
    return () => {
      clearInterval(interval);
      socket.off('command:approved', handleApproved);
      socket.off('command:rejected', handleRejected);
      socket.off('approval:new', handleNewApproval);
    };
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      const approved = await api.approveCommand(id);
      if (approved?.command === 'KILL_SWITCH_OFF') {
        dispatch(setKillSwitch(false));
      }
      const updated = pending.filter((c) => c._id !== id);
      setPending(updated);
      dispatch(setPendingRequestCount(updated.length));
      dispatch(removeFromPending(id));
    } catch (err) {
      setError(err.message || 'Approve failed');
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectCommand(id);
      const updated = pending.filter((c) => c._id !== id);
      setPending(updated);
      dispatch(setPendingRequestCount(updated.length));
      dispatch(removeFromPending(id));
    } catch (err) {
      setError(err.message || 'Reject failed');
      console.error('Reject failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <ShieldQuestion size={16} className="text-cyber-glow" />
            <Card.Title>Manual Approval Queue</Card.Title>
            <Badge variant="warning">{pending.length} pending</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchPending}>Refresh</Button>
        </Card.Header>

        {loading && <p className="text-cyber-muted text-sm text-center py-8">Loading...</p>}
        {error && <p className="text-red-400 text-xs text-center py-2">{error}</p>}

        {!loading && pending.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle size={40} className="text-cyber-success mx-auto mb-3 opacity-40" />
            <p className="text-cyber-muted text-sm">No pending approvals</p>
            <p className="text-cyber-muted text-xs mt-1">Commands with medium anomaly scores will appear here</p>
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence>
            {pending.map((cmd) => (
              <motion.div
                key={cmd._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                className="bg-cyber-bg/50 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Clock size={14} className="text-amber-400" />
                      <span className="text-sm font-mono font-semibold text-cyber-text">{cmd.command}</span>
                      <Badge status="pending">PENDING</Badge>
                    </div>
                    <p className="text-xs text-cyber-muted mb-2">
                      Target: <span className="text-cyber-text-dim">{cmd.targetMachine}</span>
                      {' · '}Industry: <span className="text-cyber-text-dim">{cmd.industry}</span>
                      {cmd.createdAt && <>{' · '}{formatDate(cmd.createdAt)}</>}
                      {cmd.holdReason && <>{' · '}Hold: <span className="text-amber-400">{cmd.holdReason}</span></>}
                    </p>

                    {cmd.aiResult && (
                      <div className="bg-cyber-card/50 rounded-lg p-2.5 text-xs">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                          <span className="text-cyber-muted">AI Score:</span>
                          <span className={`font-mono font-semibold ${
                            cmd.aiResult.anomalyScore > 0.6 ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {(cmd.aiResult.anomalyScore * 100).toFixed(1)}%
                          </span>
                          <span className="text-cyber-muted">Confidence:</span>
                          <span className="font-mono text-cyber-text-dim">
                            {(cmd.aiResult.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-cyber-muted leading-relaxed">{cmd.aiResult.explanation}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex w-full gap-2 sm:w-auto sm:shrink-0 sm:flex-col">
                    <Button className="flex-1 sm:flex-none" variant="success" size="sm" icon={CheckCircle} onClick={() => handleApprove(cmd._id)}>
                      Approve
                    </Button>
                    <Button className="flex-1 sm:flex-none" variant="danger" size="sm" icon={XCircle} onClick={() => handleReject(cmd._id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
