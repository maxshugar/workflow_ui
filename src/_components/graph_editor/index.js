import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls
} from 'react-flow-renderer';
import { SideBar } from './sidebar';
import './dnd.css';
import { EndNode, ScriptNode, StartNode } from './node_types';
const initialElements = [
  {
    id: '1',
    type: 'StartNode',
    data: { label: 'Start Sequence'},
    position: { x: 250, y: 100 },
  },
  {
    data: {
      label: "Script Node", code: ""
    },
    id: "2",
    position: {x: 250, y: 200},
    type: "ScriptNode"
  },
  {
    id: "reactflow__edge-1null-2null",
    source: "1",
    sourceHandle: null,
    target: "2",
    targetHandle: null
  }
];
let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  StartNode,
  ScriptNode,
  EndNode
};

const GraphEditor = ({selectedNode, setSelectedNode}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);

  //const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});

  const [selectedNodeName, setSelectedNodeName] = useState(null);


  const onElementClick= (evt, node) => { 
    
    if(node.type === 'ScriptNode'){
      console.log(node.type);
      return setSelectedNode(node)
    }
    else return false;
    };

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
        console.log(elements)
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
  const onDrop = (event, test) => {
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
      data: { label: `${type} node`, code: '' },
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