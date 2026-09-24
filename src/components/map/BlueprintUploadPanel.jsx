import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UploadCloud, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { api } from '../../services/api';
import { setCurrentIndustry, setIndustryData } from '../../store/mapSlice';

export default function BlueprintUploadPanel() {
  const dispatch = useDispatch();
  const [name, setName] = useState('custom_blueprint');
  const [label, setLabel] = useState('Custom Blueprint');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleFile = async (file) => {
    if (!file) return;
    const text = await file.text();
    setSvgMarkup(text);
  };

  const handleUpload = async () => {
    if (!svgMarkup.trim()) return;
    setStatus({ state: 'loading', message: 'Parsing blueprint...' });
    try {
      const result = await api.uploadBlueprint({ name, label, svgMarkup });
      dispatch(setCurrentIndustry(result.name));
      dispatch(setIndustryData({
        nodes: result.nodes,
        edges: result.edges,
        svgMarkup: result.svgMarkup,
        svgMeta: result.svgMeta,
        mapSource: 'upload',
      }));
      setStatus({ state: 'success', message: 'Blueprint uploaded successfully.' });
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Upload failed.' });
    }
  };

  return (
    <Card className="h-full">
      <Card.Header>
        <div className="flex items-center gap-2">
          <UploadCloud size={16} className="text-cyber-glow" />
          <Card.Title>Blueprint Import</Card.Title>
        </div>
      </Card.Header>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s+/g, '_'))}
            placeholder="Blueprint ID"
            className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text-dim focus:outline-none focus:border-cyber-glow"
          />
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Blueprint label"
            className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text-dim focus:outline-none focus:border-cyber-glow"
          />
        </div>

        <label className="flex items-center justify-between gap-3 bg-cyber-bg/50 border border-dashed border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text-dim cursor-pointer">
          <span>Upload SVG file</span>
          <input
            type="file"
            accept="image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        <Button
          variant="primary"
          size="sm"
          onClick={handleUpload}
          disabled={!svgMarkup.trim() || status.state === 'loading'}
        >
          {status.state === 'loading' ? 'Processing...' : 'Parse & Bind'}
        </Button>

        {status.state !== 'idle' && (
          <div className={`text-xs ${status.state === 'success' ? 'text-emerald-400' : status.state === 'error' ? 'text-red-400' : 'text-cyber-muted'}`}>
            {status.state === 'success' && <CheckCircle size={12} className="inline-block mr-1" />}
            {status.message}
          </div>
        )}
      </div>
    </Card>
  );
}
