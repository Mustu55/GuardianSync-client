import { memo } from 'react';
import { getBezierPath, BaseEdge } from 'reactflow';

function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const status = data?.status || 'online';
  const stroke = status === 'danger' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#06b6d4';
  const pulse = data?.pulse;
  const pulseColor = pulse?.status === 'danger' ? '#ef4444' : pulse?.status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <>
      {/* Glow behind the edge */}
      <BaseEdge
        id={`${id}-glow`}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: 6,
          strokeOpacity: 0.15,
          filter: 'blur(4px)',
        }}
      />
      {/* Main animated edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: 2,
          strokeDasharray: '8 4',
          animation: 'dataFlow 1.5s linear infinite',
          ...style,
        }}
      />
      {/* Label */}
      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            className="fill-cyber-muted text-[10px] font-mono"
            dy="-8"
          >
            {data.label}
          </textPath>
        </text>
      )}

      {pulse && (
        <>
          <path id={`${id}-motion`} d={edgePath} fill="none" />
          <circle r="4" fill={pulseColor}>
            <animateMotion
              key={pulse.id}
              dur="1.2s"
              path={edgePath}
              repeatCount="1"
            />
          </circle>
        </>
      )}
    </>
  );
}

export default memo(FlowEdge);
