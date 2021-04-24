import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls
} from 'react-flow-renderer';
import { SideBar } from './sidebar';
import './dnd.css';
import taskNode from './task_node';
const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'taskNode',
    data: { label: 'task node', code: "this is a test" },
    position: { x: 350, y: 5 },
  },
];
let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  taskNode
};


const GraphEditor = ({selectedNode, setSelectedNode}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);

  //const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});

  const [selectedNodeName, setSelectedNodeName] = useState();


  const onElementClick= (evt, node) => setSelectedNode(node);

  useEffect(() => setSelectedNodeName(selectedNode.data.label), [selectedNode]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
        if (el.id === selectedNode.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el.data = {
            ...el.data,
            label: selectedNodeName,
          };
        }
        return el;
      })
    );
  }, [selectedNodeName]);

  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onNodeDragStart = (evt, node) => setSelectedNode(node);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
  };
  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };
    setElements((es) => es.concat(newNode));
    setSelectedNode(newNode);
  };
  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <SideBar />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            elements={elements}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onElementClick = {onElementClick}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStart = {onNodeDragStart}
          >
            <div className="updatenode__controls">
            <label>label:</label>
            <input
              value={selectedNodeName}
              onChange={(evt) => setSelectedNodeName(evt.target.value)}
            />
            
          </div>
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};
export default GraphEditor;