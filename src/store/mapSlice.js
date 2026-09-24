import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    currentIndustry: 'power_plant',
    industries: [],
    nodes: [],
    edges: [],
    nodeStatuses: {},
    packets: [],
    svgMarkup: null,
    svgMeta: null,
    mapSource: 'preset',
    commandPulses: [],
  },
  reducers: {
    setCurrentIndustry: (state, action) => {
      try {
        if (action.payload && typeof action.payload === 'string') {
          state.currentIndustry = action.payload;
        }
      } catch (error) {
        console.error('Error setting current industry:', error);
      }
    },
    setIndustries: (state, action) => {
      try {
        if (Array.isArray(action.payload)) {
          state.industries = action.payload;
        }
      } catch (error) {
        console.error('Error setting industries:', error);
      }
    },
    setNodesAndEdges: (state, action) => {
      try {
        const { nodes, edges } = action.payload || {};
        if (Array.isArray(nodes) && Array.isArray(edges)) {
          state.nodes = nodes;
          state.edges = edges;
        }
      } catch (error) {
        console.error('Error setting nodes and edges:', error);
      }
    },
    setIndustryData: (state, action) => {
      try {
        const { nodes, edges, svgMarkup, svgMeta, mapSource } = action.payload || {};
        state.nodes = Array.isArray(nodes) ? nodes : [];
        state.edges = Array.isArray(edges) ? edges : [];
        state.svgMarkup = typeof svgMarkup === 'string' ? svgMarkup : null;
        state.svgMeta = svgMeta || null;
        state.mapSource = typeof mapSource === 'string' ? mapSource : state.mapSource;
      } catch (error) {
        console.error('Error setting industry data:', error);
      }
    },
    updateNodeStatus: (state, action) => {
      try {
        const { nodeId, status, sensors } = action.payload || {};
        if (nodeId && typeof nodeId === 'string') {
          state.nodeStatuses[nodeId] = {
            status: typeof status === 'string' ? status : 'unknown',
            sensors: sensors || {},
            lastUpdate: Date.now(),
          };
        }
      } catch (error) {
        console.error('Error updating node status:', error);
      }
    },
    addPacket: (state, action) => {
      try {
        const packet = action.payload;
        if (packet && typeof packet === 'object') {
          const packetId = packet.packetId;
          const existingIndex = packetId
            ? state.packets.findIndex((item) => item.packetId === packetId)
            : -1;

          if (existingIndex >= 0) {
            state.packets[existingIndex] = {
              ...state.packets[existingIndex],
              ...packet,
            };
          } else {
            state.packets.unshift(packet);
          }
          if (state.packets.length > 100) state.packets.pop();
        }
      } catch (error) {
        console.error('Error adding packet:', error);
      }
    },
    addCommandPulse: (state, action) => {
      try {
        const pulse = action.payload;
        if (pulse && typeof pulse === 'object' && pulse.id) {
          state.commandPulses.unshift(pulse);
          if (state.commandPulses.length > 40) state.commandPulses.pop();
        }
      } catch (error) {
        console.error('Error adding command pulse:', error);
      }
    },
    cleanupCommandPulses: (state, action) => {
      try {
        const cutoff = typeof action.payload === 'number' ? action.payload : Date.now() - 4000;
        state.commandPulses = state.commandPulses.filter((p) => p.createdAt > cutoff);
      } catch (error) {
        console.error('Error cleaning up command pulses:', error);
      }
    },
    clearPackets: (state) => {
      state.packets = [];
    },
  },
});

export const {
  setCurrentIndustry, setIndustries, setNodesAndEdges,
  setIndustryData, updateNodeStatus, addPacket, addCommandPulse,
  cleanupCommandPulses, clearPackets,
} = mapSlice.actions;
export default mapSlice.reducer;
