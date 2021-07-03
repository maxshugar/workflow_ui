import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
} from "react-flow-renderer";
import "./dnd.css";
import { EndNode, ScriptNode, StartNode } from "./node_types";
import { Button } from "react-bootstrap";
import { update } from "../../features/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";

const nodeTypes = {
  StartNode,
  ScriptNode,
  EndNode,
};

const GraphEditor = ({
  selectedNode,
  setSelectedNode,
  project,
  socket,
  sequencerState,
}) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const socketRef = useRef(socket);

  const resetTaskIcons = () => {
    setElements((els) =>
      els.map((el) => {
        if (el.type === "ScriptNode") {
          el.data.state = "STATE_SEQ_TASK_IDLE";
        }
        return el;
      })
    );
  };

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (project) {
      if(project.hasOwnProperty('elements')){
        setElements(JSON.parse(JSON.stringify(project.elements)));
        resetTaskIcons();
      }
    }
  }, [project]);

  const [elements, setElements] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(sequencerState);
    if (!sequencerState) return;
    const { state, taskId } = sequencerState;
    if (!state) return;
    setElements((els) =>
      els.map((el) => {
        if (el.id === taskId) {
          el.data.state = state;
        }
        return el;
      })
    );
  }, [sequencerState]);

  const handleSave = () => {
    let newProject = { ...project };
    newProject.elements = elements;
    console.log(newProject)
    dispatch(update(newProject));
  };

  const [selectedNodeName, setSelectedNodeName] = useState("");

  const handleAdd = () => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: reactFlowBounds.left - 500,
      y: reactFlowBounds.top,
    });

    console.log(reactFlowBounds)

    const id = uuid();

    const newNode = {
      id,
      type: "ScriptNode",
      position,
      data: {
        label: `new node`,
        script: "",
        language: selectedNode.data.language || "python",
        breakpoints: [],
        state: "STATE_SEQ_TASK_IDLE",
      },
    };

    setElements([...elements, newNode]);
    setSelectedNode(newNode);
  }

  const handleRunSequence = () => {
    // Get nodes on canvas.
    console.log(elements);

    const payload = {
      startNodes: [],
      nodes: {},
    };

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      if (el.type === "ScriptNode" || el.type === "EndNode") {
        payload.nodes[el.id] = {
          code: el.data.script,
          predecessors: [],
          language: el.data.language,
          name: el.data.label,
          type: el.type
        };
      }

      // Find start nodes.
      if (el.hasOwnProperty("source")) {
        // We know that this is an edge.
        if (el.source === "Start") {
          payload.startNodes.push(el.target);
        } else if (payload.nodes.hasOwnProperty(el.target)) {
          payload.nodes[el.target].predecessors.push(el.source);
        }
      }
    }
    resetTaskIcons();
    socketRef.current.emit("runSequence", payload);
  };

  useEffect(() => {
    // Save previously selected node.
    if(selectedNode){
      setElements((els) =>
        els.map((el) => {
          if (el.id === selectedNode.id) {
            el = selectedNode;
          }
          return el;
        })
      );
    }
  }, [selectedNode])

  const onElementClick = (evt, node) => {
    if (node.type === "ScriptNode") {
      setSelectedNode(node);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => setSelectedNodeName(selectedNode.data.label), [selectedNode]);

  useEffect(() => {
    setElements((els) =>
      els.map((el) => {
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
          el.position = node.position;
        }
        return el;
      });
    });
  };
  const onElementsRemove = (elementsToRemove) => {
    for (let i = 0; i < elementsToRemove.length; i++) {
      const el = elementsToRemove[i];
      if (el.type !== "ScriptNode" && !el.hasOwnProperty("source")) {
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
  // const onDrop = (event) => {
  //   event.preventDefault();
  //   const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
  //   const type = event.dataTransfer.getData("application/reactflow");
  //   const position = reactFlowInstance.project({
  //     x: event.clientX - reactFlowBounds.left,
  //     y: event.clientY - reactFlowBounds.top,
  //   });

  //   const id = uuid();

  //   const newNode = {
  //     id,
  //     type,
  //     position,
  //     data: {
  //       label: `new node`,
  //       script: "",
  //       breakpoints: [],
  //       state: "STATE_SEQ_TASK_IDLE",
  //     },
  //   };

  //   setElements([...elements, newNode]);
  //   setSelectedNode(newNode);
  // };

  return (
    // <Wrapper>
    <div style={{ padding: '.5rem' }}>
      <div style={{ backgroundColor: "hsl(225, 6%, 13%)" }} className={`editor-title`}>
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
        <Button
          style={{ margin: "5px" }}
          onClick={() => handleAdd()}
        >
          Add Task
        </Button>
        <div className="updatenode__controls">
          <label>Selected Task:</label>
          <input
            value={selectedNodeName}
            onChange={(evt) => setSelectedNodeName(evt.target.value)}
          />
        </div>
      </div>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              elements={elements}
              nodeTypes={nodeTypes}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onElementClick={onElementClick}
              onLoad={onLoad}
              // onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};
export default GraphEditor;