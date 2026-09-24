import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import MachineNode from './MachineNode';
import FlowEdge from './FlowEdge';

const nodeTypes = { machineNode: MachineNode };
const edgeTypes = { default: FlowEdge };

export default function NodeGraph({ nodes, edges }) {
  const nodeStatuses = useSelector((s) => s.map.nodeStatuses);
  const commandPulses = useSelector((s) => s.map.commandPulses);
  const flowNodes = useMemo(() =>
    nodes.map((n) => ({
      ...n,
      type: n.type || 'machineNode',
    })), [nodes]
  );

  const flowEdges = useMemo(() => {
    const pulseMap = new Map();
    commandPulses.forEach((pulse) => pulseMap.set(pulse.nodeId, pulse));

    return edges.map((e) => {
      const sourceStatus = nodeStatuses[e.source]?.status;
      const targetStatus = nodeStatuses[e.target]?.status;
      const status = sourceStatus === 'danger' || targetStatus === 'danger'
        ? 'danger'
        : sourceStatus === 'warning' || targetStatus === 'warning'
        ? 'warning'
        : 'online';
      const pulse = pulseMap.get(e.source) || pulseMap.get(e.target);
      return {
        ...e,
        type: 'default',
        animated: true,
        data: { label: e.label, status, pulse },
      };
    });
  }, [edges, nodeStatuses, commandPulses]);

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.3}
      maxZoom={2}
      attributionPosition="bottom-left"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1e293b" gap={30} size={1} />
      <Controls />
      <MiniMap
        nodeColor={() => '#06b6d4'}
        maskColor="rgba(10, 14, 26, 0.85)"
        style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8 }}
      />
    </ReactFlow>
  );
}
