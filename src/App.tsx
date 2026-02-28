import { ReactFlowProvider } from '@xyflow/react';
import GraphView from './components/GraphView';

export default function App() {
  return (
    <ReactFlowProvider>
      <GraphView />
    </ReactFlowProvider>
  );
}
