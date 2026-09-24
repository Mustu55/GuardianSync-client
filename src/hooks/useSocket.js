import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getSocket } from '../services/socket';
import {
  setConnected,
  updateThreatScore,
  setKillSwitch,
  setMaintenance,
  setSimulationActive,
  setSimulationMode,
  setPendingRequestCount,
} from '../store/uiSlice';
import { addAlert, setAlertStats } from '../store/alertSlice';
import { addCommandResult } from '../store/commandSlice';
import { addPacket, updateNodeStatus, addCommandPulse, cleanupCommandPulses } from '../store/mapSlice';
import { api } from '../services/api';

export const useSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const offlineNodesRef = useRef(new Set());
  const cleanupTimeoutRef = useRef(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await api.getSimStatus();
        dispatch(setSimulationActive(status.simulationActive));
        dispatch(setSimulationMode(status.simulationMode || 'normal'));
        dispatch(setMaintenance({ active: status.maintenanceActive, window: status.maintenanceWindow }));
      } catch (error) {
        console.warn('Failed to load simulation status:', error.message);
      }
    };

    const loadPendingCount = async () => {
      try {
        const pending = await api.getPendingCommands();
        dispatch(setPendingRequestCount(Array.isArray(pending) ? pending.length : 0));
      } catch (error) {
        dispatch(setPendingRequestCount(0));
      }
    };
    loadStatus();
    loadPendingCount();

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      try {
        dispatch(setConnected(true));
      } catch (error) {
        console.error('Error handling socket connect:', error);
      }
    };

    const handleDisconnect = () => {
      try {
        dispatch(setConnected(false));
      } catch (error) {
        console.error('Error handling socket disconnect:', error);
      }
    };

    const handlePacketNew = (packet) => {
      try {
        if (!packet || typeof packet !== 'object') return;
        dispatch(addPacket(packet));
      } catch (error) {
        console.error('Error handling new packet:', error);
      }
    };

    const handlePacketAnalyzed = (packet) => {
      try {
        if (!packet || typeof packet !== 'object') return;
        dispatch(addPacket(packet));
        if (packet.aiResult) {
          dispatch(updateThreatScore(packet.aiResult.anomalyScore));
          if (packet.targetMachine) {
            const isOffline = offlineNodesRef.current.has(packet.targetMachine);
            const status = isOffline
              ? 'offline'
              : packet.aiResult.action === 'BLOCK'
              ? 'danger'
              : packet.aiResult.anomalyScore > 0.4
              ? 'warning'
              : 'online';
            dispatch(updateNodeStatus({
              nodeId: packet.targetMachine,
              status,
              sensors: packet.parameters,
            }));
          }
        }
      } catch (error) {
        console.error('Error handling analyzed packet:', error);
      }
    };

    const handleCommandResult = (result) => {
      try {
        if (!result || typeof result !== 'object') return;
        dispatch(addCommandResult(result));
        const status = result.status === 'blocked'
          ? 'danger'
          : result.status === 'pending'
          ? 'warning'
          : 'online';
        const command = String(result.command || '').toUpperCase();

        if ((result.status === 'approved' || result.status === 'executed') && result.targetMachine) {
          if (command === 'STOP_MACHINE') {
            offlineNodesRef.current.add(result.targetMachine);
            dispatch(updateNodeStatus({ nodeId: result.targetMachine, status: 'offline' }));
          }
          if (command === 'START_MACHINE') {
            offlineNodesRef.current.delete(result.targetMachine);
            dispatch(updateNodeStatus({ nodeId: result.targetMachine, status: 'online' }));
          }
        }
        if (result.targetMachine) {
          const pulse = {
            id: `${result.targetMachine}-${Date.now()}`,
            nodeId: result.targetMachine,
            status,
            createdAt: Date.now(),
          };
          dispatch(addCommandPulse(pulse));
          if (cleanupTimeoutRef.current) {
            clearTimeout(cleanupTimeoutRef.current);
          }
          cleanupTimeoutRef.current = setTimeout(() => {
            dispatch(cleanupCommandPulses());
            cleanupTimeoutRef.current = null;
          }, 3500);
        }
      } catch (error) {
        console.error('Error handling command result:', error);
      }
    };

    const handleAlertNew = (alert) => {
      try {
        if (!alert || typeof alert !== 'object') return;
        dispatch(addAlert(alert));
      } catch (error) {
        console.error('Error handling new alert:', error);
      }
    };

    const handleAlertsSummary = (stats) => {
      try {
        if (!stats || typeof stats !== 'object') return;
        dispatch(setAlertStats(stats));
      } catch (error) {
        console.error('Error handling alerts summary:', error);
      }
    };

    const handleKillSwitchChanged = (payload) => {
      try {
        if (!payload || typeof payload !== 'object') return;
        dispatch(setKillSwitch(payload.active ?? false));
      } catch (error) {
        console.error('Error handling kill switch change:', error);
      }
    };

    const handleMaintenanceChanged = (payload) => {
      try {
        if (!payload || typeof payload !== 'object') return;
        dispatch(setMaintenance(payload));
      } catch (error) {
        console.error('Error handling maintenance change:', error);
      }
    };

    const handleApprovalChanged = () => {
      loadPendingCount();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('packet:new', handlePacketNew);
    socket.on('packet:analyzed', handlePacketAnalyzed);
    socket.on('command:result', handleCommandResult);
    socket.on('alert:new', handleAlertNew);
    socket.on('alerts:summary', handleAlertsSummary);
    socket.on('killswitch:changed', handleKillSwitchChanged);
    socket.on('maintenance:changed', handleMaintenanceChanged);
    socket.on('approval:new', handleApprovalChanged);
    socket.on('command:approved', handleApprovalChanged);
    socket.on('command:rejected', handleApprovalChanged);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('packet:new', handlePacketNew);
      socket.off('packet:analyzed', handlePacketAnalyzed);
      socket.off('command:result', handleCommandResult);
      socket.off('alert:new', handleAlertNew);
      socket.off('alerts:summary', handleAlertsSummary);
      socket.off('killswitch:changed', handleKillSwitchChanged);
      socket.off('maintenance:changed', handleMaintenanceChanged);
      socket.off('approval:new', handleApprovalChanged);
      socket.off('command:approved', handleApprovalChanged);
      socket.off('command:rejected', handleApprovalChanged);
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      offlineNodesRef.current.clear();
    };
  }, [dispatch]);

  return socketRef;
};
