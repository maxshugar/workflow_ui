import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  isNode,
} from "react-flow-renderer";
import { SideBar } from "./sidebar";
import "./dnd.css";
import { EndNode, ScriptNode, StartNode } from "./node_types";
import dagre from "dagre";
import { Button } from "react-bootstrap";
import { update } from "../../features/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";

// const getLayoutedElements = (elements, direction = "TB") => {
//   const isHorizontal = direction === "LR";
//   dagreGraph.setGraph({ rankdir: direction });

//   elements.forEach((el) => {
//     if (isNode(el)) {
//       dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
//     } else {
//       dagreGraph.setEdge(el.source, el.target);
//     }
//   });

//   dagre.layout(dagreGraph);

//   return elements.map((el) => {
//     if (isNode(el)) {
//       const nodeWithPosition = dagreGraph.node(el.id);
//       el.targetPosition = isHorizontal ? "left" : "top";
//       el.sourcePosition = isHorizontal ? "right" : "bottom";

//       // unfortunately we need this little hack to pass a slightly different position
//       // to notify react flow about the change. Moreover we are shifting the dagre node position
//       // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
//       el.position = {
//         x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
//         y: nodeWithPosition.y - nodeHeight / 2,
//       };
//     }

//     return el;
//   });
// };

// const initialElements = [
//   {
//     id: "Start",
//     type: "StartNode",
//     data: {
//       label: "Start",
//       script: "",
//       breakpoints: [],
//     },
//     position: { x: 250, y: 100 },
//   },
//   {
//     id: "Node_1",
//     type: "ScriptNode",
//     data: {
//       label: "Node_1",
//       script: 'print("1")\nprint("2")\nprint("3")\nprint("4")\nprint("5")',
//       breakpoints: [],
//     },
//     position: { x: 250, y: 200 },
//   },
//   {
//     id: "reactflow__edge-1null-2null",
//     source: "Start",
//     sourceHandle: null,
//     target: "Node_1",
//     targetHandle: null,
//   },
//   {
//     id: "End",
//     type: "EndNode",
//     data: {
//       label: "End",
//       script: "",
//       breakpoints: [],
//     },
//     position: { x: 250, y: 300 },
//   },
//   {
//     id: "reactflow__edge-2null-3null",
//     source: "Node_1",
//     sourceHandle: null,
//     target: "End",
//     targetHandle: null,
//   },
// ];

const updateId = () => {};

// const getId = () => {
//   elements.find((el) => {
//     el.
//   })
//   `dndnode_${id++}`
// };

const nodeTypes = {
  StartNode,
  ScriptNode,
  EndNode,
};

const GraphEditor = ({ selectedNode, setSelectedNode, project, socket }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const socketRef = useRef(socket);
  
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    console.log(project);
    if (project) {
      setElements(JSON.parse(JSON.stringify(project.elements)));
    }
  }, [project]);

  const [elements, setElements] = useState([]);

  const dispatch = useDispatch();

  const [formatLayout, setFormatLayout] = useState(false);

  const handleSave = () => {
    console.log(project);
    console.log(elements);

    let newProject = { ...project };
    newProject.elements = elements;
    dispatch(update(newProject));
  };

  const [selectedNodeName, setSelectedNodeName] = useState("");

  const handleRunSequence = () => {
    // Get nodes on canvas.
    console.log(elements);

    const payload = {
      startNodes: [],
      nodes: {},
    };

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      if (el.type == "ScriptNode") {
        payload.nodes[el.id] = {
          code: el.data.script,
          predecessors: [],
        };
      }

      // Find start nodes.
      if (el.hasOwnProperty("source")) {
        // We know that this is an edge.
        if (el.source === "Start") {
          payload.startNodes.push(el.target);
        } else if (el.target != "End") {
          if (payload.nodes.hasOwnProperty(el.target)) {
            payload.nodes[el.target].predecessors.push(el.source);
          } else {
            throw Error("Node not loaded yet: " + el.target);
          }
        }
      }
    }

    socketRef.current.emit('runSequence', payload);

    console.log(payload);
  };

  const onElementClick = (evt, node) => {
    if (node.type === "ScriptNode") {
      console.log("changing selected node to " + node.data.label);
      setSelectedNode(node);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => setSelectedNodeName(selectedNode.data.label), [selectedNode]);

  useEffect(() => {
    setElements((els) => els.map((el) => {
        if (el.id === selectedNode.id) {
          el.data = {
            ...el.data,
            label: selectedNodeName,
            style: { backgroundColor: "red !important" },
          };
        }
        return el;
      })
    );
  }, [selectedNodeName]);

  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onNodeDragStart = (evt, node) => {
    if (node.type === "ScriptNode") setSelectedNode(node);
  };
  const onNodeDragStop = (evt, node) => {
    setElements((els) => {
      return els.map((el) => {
        if (el.id === node.id) {
          el.position = node.position
        }
        return el;
      });
    });
  };
  const onElementsRemove = (elementsToRemove) => {
    for (let i = 0; i < elementsToRemove.length; i++) {
      const el = elementsToRemove[i];
      if (el.type != "ScriptNode" && !el.hasOwnProperty("source")) {
        console.log("Can't delete node of type " + el.type);
        return;
      }
    }
    setElements((els) => removeElements(elementsToRemove, els));
  };
  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const id = uuid();

    const newNode = {
      id,
      type,
      position,
      data: {
        label: `new node`,
        script: "",
        breakpoints: [],
      },
    };

    setElements([...elements, newNode]);
    setSelectedNode(newNode);
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div style={{ float: "right" }}>
          <Button
            style={{ margin: "5px" }}
            disabled={selectedNode.type !== "ScriptNode"}
            onClick={() => handleRunSequence()}
          >
            Run Sequence
          </Button>
          <Button
            style={{ margin: "5px" }}
            disabled={selectedNode.type !== "ScriptNode"}
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </div>
        <SideBar setFormatLayout={setFormatLayout} />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            elements={elements}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onElementClick={onElementClick}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            snapToGrid={true}
            snapGrid={[15, 15]}
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
