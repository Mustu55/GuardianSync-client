import { createSlice } from '@reduxjs/toolkit';

const initialSidebarOpen = typeof window === 'undefined' || window.innerWidth >= 1024;

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: initialSidebarOpen,
    activeView: 'dashboard',
    killSwitchActive: false,
    simulationActive: false,
    simulationMode: 'normal',
    maintenanceActive: false,
    maintenanceWindow: null,
    connected: false,
    user: null,
    token: (() => {
      try {
        return localStorage.getItem('gs_token') || null;
      } catch {
        return null;
      }
    })(),
    threatScore: 0,
    threatHistory: [],
    theme: (() => {
      try {
        return localStorage.getItem('gs_theme') || 'dark';
      } catch {
        return 'dark';
      }
    })(),
    pendingRequestCount: 0,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = !!action.payload;
    },
    setActiveView: (state, action) => {
      try {
        if (action.payload && typeof action.payload === 'string') {
          state.activeView = action.payload;
        }
      } catch (error) {
        console.error('Error setting active view:', error);
      }
    },
    setKillSwitch: (state, action) => {
      try {
        state.killSwitchActive = !!action.payload;
      } catch (error) {
        console.error('Error setting kill switch:', error);
      }
    },
    setSimulationActive: (state, action) => {
      try {
        state.simulationActive = !!action.payload;
      } catch (error) {
        console.error('Error setting simulation active:', error);
      }
    },
    setSimulationMode: (state, action) => {
      try {
        if (action.payload && typeof action.payload === 'string') {
          state.simulationMode = action.payload;
        }
      } catch (error) {
        console.error('Error setting simulation mode:', error);
      }
    },
    setMaintenance: (state, action) => {
      try {
        const payload = action.payload || {};
        state.maintenanceActive = !!payload.active;
        state.maintenanceWindow = payload.window || null;
      } catch (error) {
        console.error('Error setting maintenance:', error);
      }
    },
    setConnected: (state, action) => {
      try {
        state.connected = !!action.payload;
      } catch (error) {
        console.error('Error setting connected:', error);
      }
    },
    setUser: (state, action) => {
      try {
        if (action.payload === null || (action.payload && typeof action.payload === 'object')) {
          state.user = action.payload;
        }
      } catch (error) {
        console.error('Error setting user:', error);
      }
    },
    setToken: (state, action) => {
      try {
        state.token = action.payload || null;
        if (action.payload) {
          try {
            localStorage.setItem('gs_token', action.payload);
          } catch {
            console.warn('Failed to save token to localStorage');
          }
        } else {
          try {
            localStorage.removeItem('gs_token');
          } catch {
            console.warn('Failed to remove token from localStorage');
          }
        }
      } catch (error) {
        console.error('Error setting token:', error);
      }
    },
    updateThreatScore: (state, action) => {
      try {
        const score = typeof action.payload === 'number' ? action.payload : 0;
        state.threatScore = Math.max(0, Math.min(1, score));
        state.threatHistory.push({
          score: state.threatScore,
          time: Date.now(),
        });
        if (state.threatHistory.length > 60) state.threatHistory.shift();
      } catch (error) {
        console.error('Error updating threat score:', error);
      }
    },
    setTheme: (state, action) => {
      try {
        const allowedThemes = ['dark', 'light', 'graphite', 'ocean', 'emerald', 'sunset', 'ice'];
        if (action.payload && allowedThemes.includes(action.payload)) {
          state.theme = action.payload;
          try {
            localStorage.setItem('gs_theme', action.payload);
          } catch {
            console.warn('Failed to save theme to localStorage');
          }
        }
      } catch (error) {
        console.error('Error setting theme:', error);
      }
    },
    toggleTheme: (state) => {
      try {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem('gs_theme', state.theme);
        } catch {
          console.warn('Failed to save theme to localStorage');
        }
      } catch (error) {
        console.error('Error toggling theme:', error);
      }
    },
    setPendingRequestCount: (state, action) => {
      try {
        const count = typeof action.payload === 'number' ? action.payload : 0;
        state.pendingRequestCount = Math.max(0, count);
      } catch (error) {
        console.error('Error setting pending request count:', error);
      }
    },
    logout: (state) => {
      try {
        state.user = null;
        state.token = null;
        try {
          localStorage.removeItem('gs_token');
        } catch {
          console.warn('Failed to remove token from localStorage');
        }
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
  },
});

export const {
  toggleSidebar, setSidebarOpen, setActiveView, setKillSwitch, setSimulationActive,
  setSimulationMode, setMaintenance, setConnected, setUser, setToken,
  updateThreatScore, setTheme, toggleTheme, setPendingRequestCount, logout,
} = uiSlice.actions;
export default uiSlice.reducer;
