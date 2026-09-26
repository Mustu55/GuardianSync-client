const configuredApiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const API_BASE = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

async function request(endpoint, options = {}, retryCount = 0) {
  try {
    const token = localStorage.getItem('gs_token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(`${API_BASE}${endpoint}`, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok && retryCount < MAX_RETRIES && res.status >= 500) {
      await new Promise(r => setTimeout(r, RETRY_DELAY * (retryCount + 1)));
      return request(endpoint, options, retryCount + 1);
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export const api = {
  // Auth
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  verifyOtp: (payload) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  googleLogin: (access_token, role) => request('/auth/google-login', { method: 'POST', body: JSON.stringify({ access_token, role }) }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Commands
  submitCommand: (cmd) => request('/commands', { method: 'POST', body: JSON.stringify(cmd) }),
  getRecentCommands: (limit = 50) => request(`/commands/recent?limit=${limit}`),
  getPendingCommands: () => request('/commands/pending'),
  approveCommand: (id) => request(`/commands/${id}/approve`, { method: 'PUT' }),
  rejectCommand: (id) => request(`/commands/${id}/reject`, { method: 'PUT' }),

  // Kill switch & simulation
  toggleKillSwitch: (active) => request('/commands/killswitch', { method: 'POST', body: JSON.stringify({ active }) }),
  controlSimulation: (action, industry, mode) => request('/commands/simulation', { method: 'POST', body: JSON.stringify({ action, industry, mode }) }),
  toggleMaintenance: (active, windowMinutes) => request('/commands/maintenance', { method: 'POST', body: JSON.stringify({ active, windowMinutes }) }),
  getSimStatus: () => request('/commands/simulation/status'),

  // Alerts
  getAlerts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/alerts?${qs}`);
  },
  acknowledgeAlert: (id) => request(`/alerts/${id}/acknowledge`, { method: 'PUT' }),
  getAlertStats: () => request('/alerts/stats'),

  // Map
  getIndustries: () => request('/map'),
  getIndustry: (name) => request(`/map/${name}`),
  uploadBlueprint: (payload) => request('/map/upload', { method: 'POST', body: JSON.stringify(payload) }),

  // Forensic
  getForensicLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/forensic?${qs}`);
  },
  getForensicStats: () => request('/forensic/stats'),
  exportLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/forensic/export?${qs}`);
  },

  // Health
  health: () => request('/health'),
};
