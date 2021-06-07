import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  isNode
} from 'react-flow-renderer';
import { SideBar } from './sidebar';
import './dnd.css';
import { EndNode, ScriptNode, StartNode } from './node_types';
import dagre from 'dagre';
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? 'left' : 'top';
      el.sourcePosition = isHorizontal ? 'right' : 'bottom';

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
};


const initialElements = [
  {
    id: '1',
    type: 'StartNode',
    data: { 
      label: 'Start Sequence',
      script: '',
      breakpoints: []
    },
    position: { x: 250, y: 100 },
  },
  {
    data: {
      label: "Script Node", 
      script: 'print("hello")',
      breakpoints: []
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
  }, 
  {
    id: '3',
    type: 'EndNode',
    data: { 
      label: 'End Sequence',
      script: '',
      breakpoints: []
    },
    position: { x: 250, y: 300 },
  },
  {
    id: "reactflow__edge-2null-3null",
    source: "2",
    sourceHandle: null,
    target: "3",
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


const layoutedElements = getLayoutedElements(initialElements, "LR");


const GraphEditor = ({selectedNode, setSelectedNode}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(layoutedElements);

  const [formatLayout, setFormatLayout] = useState(false);

  useEffect(() => {
    if(formatLayout){
        setFormatLayout(false);
        const layoutedElements = getLayoutedElements(elements, "LR");
        setElements(layoutedElements);
    }
  }, formatLayout);

  //const [selectedNode, setSelectedNode] = useState({id: -1, data: {label: 'test'}});

  const [selectedNodeName, setSelectedNodeName] = useState(null);

  const onElementClick= (evt, node) => { 
    if(node.type === 'ScriptNode'){
      console.log('changing selected node to ' + node.data.label)
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
            style: { backgroundColor: 'red !important' }
          };
          //el.style = { backgroundColor: 'red' };
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
    const id = getId();
    const newNode = {
      id,
      type,
      position,
      data: { 
        label: `node ${id}`, 
        script: "",
        breakpoints: []
      },
    };
    setElements((es) => es.concat(newNode));
    setSelectedNode(newNode);
  };

  // useEffect(() => {
  //     const layoutedElements = getLayoutedElements(elements, "LR");
  //     setElements(layoutedElements);
  //   },
  //   [elements]
  // );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <SideBar setFormatLayout={setFormatLayout} />
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