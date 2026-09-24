import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import commandReducer from './commandSlice';
import mapReducer from './mapSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    alerts: alertReducer,
    commands: commandReducer,
    map: mapReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
