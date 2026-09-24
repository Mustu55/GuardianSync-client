import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { setSubmitting } from '../store/commandSlice';

export const useCommandStream = () => {
  const dispatch = useDispatch();
  const [commandHistory, setCommandHistory] = useState([]);
  const isSubmitting = useSelector((s) => s.commands.isSubmitting);
  const lastResult = useSelector((s) => s.commands.lastResult);

  useEffect(() => {
    const socket = getSocket();

    const handleCommandResult = (result) => {
      if (!result || !result.id) return;
      setCommandHistory((prev) => {
        const index = prev.findIndex((entry) => entry?.result?.id === result.id);
        if (index === -1) return prev;
        const next = [...prev];
        next[index] = { ...next[index], result };
        return next;
      });
    };

    socket.on('command:result', handleCommandResult);
    return () => {
      socket.off('command:result', handleCommandResult);
    };
  }, []);

  const sendCommand = useCallback(async (command, targetMachine, industry, parameters) => {
    dispatch(setSubmitting(true));
    try {
      const result = await api.submitCommand({ command, targetMachine, industry, parameters });
      setCommandHistory((prev) => [{ input: command, result, time: Date.now() }, ...prev].slice(0, 50));
      return result;
    } catch (err) {
      setCommandHistory((prev) => [
        { input: command, error: err.message, time: Date.now() },
        ...prev,
      ].slice(0, 50));
      throw err;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [dispatch]);

  return { sendCommand, commandHistory, isSubmitting, lastResult };
};
