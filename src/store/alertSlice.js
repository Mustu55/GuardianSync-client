import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: [],
    stats: { total: 0, critical: 0, high: 0, unacknowledged: 0 },
    latestAlert: null,
    showAlertModal: false,
  },
  reducers: {
    addAlert: (state, action) => {
      try {
        const alert = action.payload;
        if (!alert || typeof alert !== 'object') return;
        
        state.items.unshift(alert);
        if (state.items.length > 200) state.items.pop();
        state.latestAlert = alert;
        
        // Update stats
        state.stats.total = Math.max(0, state.stats.total + 1);
        if (!alert.acknowledged) {
          state.stats.unacknowledged = Math.max(0, state.stats.unacknowledged + 1);
        }
        if (alert.severity === 'CRITICAL') {
          state.stats.critical = Math.max(0, state.stats.critical + 1);
        } else if (alert.severity === 'HIGH') {
          state.stats.high = Math.max(0, state.stats.high + 1);
        }
        
        if (alert.severity === 'CRITICAL') {
          state.showAlertModal = true;
        }
      } catch (error) {
        console.error('Error adding alert:', error);
      }
    },
    setAlerts: (state, action) => {
      try {
        const alerts = action.payload;
        if (Array.isArray(alerts)) {
          state.items = alerts;
        }
      } catch (error) {
        console.error('Error setting alerts:', error);
      }
    },
    setAlertStats: (state, action) => {
      try {
        const stats = action.payload;
        if (stats && typeof stats === 'object') {
          state.stats = {
            total: Math.max(0, stats.total ?? 0),
            critical: Math.max(0, stats.critical ?? 0),
            high: Math.max(0, stats.high ?? 0),
            unacknowledged: Math.max(0, stats.unacknowledged ?? 0),
          };
        }
      } catch (error) {
        console.error('Error setting alert stats:', error);
      }
    },
    acknowledgeAlert: (state, action) => {
      try {
        const alertId = action.payload;
        const alert = state.items.find((a) => a._id === alertId);
        if (alert && !alert.acknowledged) {
          alert.acknowledged = true;
          state.stats.unacknowledged = Math.max(0, state.stats.unacknowledged - 1);
        }
      } catch (error) {
        console.error('Error acknowledging alert:', error);
      }
    },
    acknowledgeAllAlerts: (state) => {
      try {
        let unacknowledged = 0;
        state.items.forEach((alert) => {
          if (!alert.acknowledged) {
            alert.acknowledged = true;
            unacknowledged += 1;
          }
        });
        if (unacknowledged > 0) {
          state.stats.unacknowledged = Math.max(0, state.stats.unacknowledged - unacknowledged);
        }
      } catch (error) {
        console.error('Error acknowledging all alerts:', error);
      }
    },
    dismissAlertModal: (state) => {
      state.showAlertModal = false;
    },
  },
});

export const { addAlert, setAlerts, setAlertStats, acknowledgeAlert, acknowledgeAllAlerts, dismissAlertModal } = alertSlice.actions;
export default alertSlice.reducer;
