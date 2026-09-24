export const formatTimestamp = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatDate = (ts) => {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatScore = (score) => {
  if (typeof score !== 'number') return '—';
  return (score * 100).toFixed(1) + '%';
};

export const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

export const truncate = (str, len = 60) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
