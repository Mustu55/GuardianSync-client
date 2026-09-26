import { useSelector, useDispatch } from 'react-redux';
import { setCurrentIndustry } from '../../store/mapSlice';
import { INDUSTRY_TEMPLATES } from '../../utils/industryPresets';
import NodeGraph from './NodeGraph';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Map, Factory } from 'lucide-react';

export default function IndustryMap({ fullscreen }) {
  const dispatch = useDispatch();
  const currentIndustry = useSelector((s) => s.map.currentIndustry);
  const nodes = useSelector((s) => s.map.nodes);
  const edges = useSelector((s) => s.map.edges);
  const svgMarkup = useSelector((s) => s.map.svgMarkup);
  const svgMeta = useSelector((s) => s.map.svgMeta);
  const mapSource = useSelector((s) => s.map.mapSource);
  const template = INDUSTRY_TEMPLATES[currentIndustry];

  return (
    <Card className={fullscreen ? 'h-full flex flex-col' : ''}>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Map size={16} className="text-cyber-glow" />
          <Card.Title>Industry Map</Card.Title>
          <Badge variant="glow">{template?.label || currentIndustry}</Badge>
          {mapSource !== 'preset' && (
            <Badge variant="secondary">{mapSource.toUpperCase()}</Badge>
          )}
          {svgMeta?.nodesExtracted && (
            <span className="text-[10px] text-cyber-muted">{svgMeta.nodesExtracted} nodes</span>
          )}
        </div>
        {fullscreen && (
          <div className="flex items-center gap-1.5">
            {Object.entries(INDUSTRY_TEMPLATES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => dispatch(setCurrentIndustry(key))}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  key === currentIndustry
                    ? 'bg-cyber-glow/20 text-cyber-accent border border-cyber-glow/30'
                    : 'bg-cyber-bg text-cyber-muted hover:text-cyber-text-dim border border-cyber-border'
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        )}
      </Card.Header>

      <div className={`${fullscreen ? 'h-[55vh] min-h-[420px] xl:h-auto xl:flex-1 xl:min-h-0' : 'h-[350px]'} rounded-lg overflow-hidden border border-cyber-border bg-cyber-bg relative`}>
        {svgMarkup && (
          <div
            className="absolute inset-0 opacity-70 pointer-events-none flex items-center justify-center svg-blueprint"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
        {nodes.length > 0 ? (
          <NodeGraph nodes={nodes} edges={edges} />
        ) : (
          <div className="h-full flex items-center justify-center text-cyber-muted">
            <Factory size={40} className="opacity-30 mr-3" />
            <span>Loading industry map...</span>
          </div>
        )}
      </div>
    </Card>
  );
}
