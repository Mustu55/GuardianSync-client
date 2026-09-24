import { createSlice } from '@reduxjs/toolkit';

const commandSlice = createSlice({
  name: 'commands',
  initialState: {
    recent: [],
    pending: [],
    lastResult: null,
    isSubmitting: false,
    stats: { total: 0, blocked: 0, approved: 0, pending: 0 },
  },
  reducers: {
    addCommandResult: (state, action) => {
      state.recent.unshift(action.payload);
      if (state.recent.length > 200) state.recent.pop();
      state.lastResult = action.payload;
    },
    setRecentCommands: (state, action) => {
      state.recent = action.payload;
    },
    setPendingCommands: (state, action) => {
      state.pending = action.payload;
    },
    removeFromPending: (state, action) => {
      state.pending = state.pending.filter((c) => c._id !== action.payload);
    },
    setCommandStats: (state, action) => {
      state.stats = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  addCommandResult, setRecentCommands, setPendingCommands,
  removeFromPending, setCommandStats, setSubmitting,
} = commandSlice.actions;
export default commandSlice.reducer;
