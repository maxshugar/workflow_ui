import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
} from "react-flow-renderer";
import "./dnd.css";
import { EndNode, ScriptNode, StartNode } from "./node_types";
import { Button } from "react-bootstrap";
import { update } from "../../features/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import {
  faPlayCircle,
  faPlusCircle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const nodeTypes = {
  StartNode,
  ScriptNode,
  EndNode,
};

const GraphEditor = ({
  selectedNode,
  setSelectedNode,
  prevSelectedNode,
  setPrevSelectedNode,
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
      if (project.hasOwnProperty("elements")) {
        setElements(JSON.parse(JSON.stringify(project.elements)));
        resetTaskIcons();
      }
    }
  }, [project]);

  const [elements, setElements] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
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
    let selectedId = null;
    for(let i = 0; i < newProject.elements.length; i++){
      let el = newProject.elements[i];
      if(el.type === 'ScriptNode'){
        if(el.data.selected)
          selectedId = el.id;
        el.data.selected = false;
      }
    }
    dispatch(update(newProject));
    if(selectedId){
      setElements((els) =>
        els.map((el) => {
          if (el.id === selectedId) {
            el.data.selected = true;
          }
          return el;
        })
      );
    }
  };

  const [selectedNodeName, setSelectedNodeName] = useState("");

  const handleAdd = () => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: reactFlowBounds.left - 500,
      y: reactFlowBounds.top,
    });

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
  };

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
          type: el.type,
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

  const onElementClick = (evt, node) => {
    if (node.type === "ScriptNode") {
      setSelectedNode(node);

      setElements((els) =>
        els.map((el) => {
          if (prevSelectedNode) {
            // Unselect previous node.
            if (el.id === prevSelectedNode.id) el.data.selected = false;
          }
          // Select new node.
          if (el.id === node.id) {
            el.data.selected = true;
          }
          return el;
        })
      );

      setPrevSelectedNode(node);
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

  return (
    <div
      style={{
        border: '3px solid black',
        flexGrow: 1,
        flexBasis: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{ backgroundColor: "hsl(225, 6%, 13%)" }}
        className={`editor-title`}
      >
          <label
            style={{
              fontFamily: "myriad_pro_bold",
              fontSize: "20px",
              margin: "5px 20px",
            }}
          >
            {project && project.id}
          </label>
        
        <Button style={{ margin: "5px" }} onClick={() => handleRunSequence()}>
          Run
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faPlayCircle} />
        </Button>
        <Button style={{ margin: "5px" }} onClick={() => handleAdd()}>
          Add
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faPlusCircle} />
        </Button>

        <Button
          style={{ margin: "5px", float: "right" }}
          onClick={() => handleSave()}
        >
          Save
          <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faSave} />
        </Button>
        <div className="updatenode__controls" style={{ float: "right" }}>
          <label
            style={{
              fontFamily: "myriad_pro_bold",
              fontSize: "20px",
              margin: "5px",
            }}
          >
            Edit:
          </label>
          <input
            style={{
              margin: "5px",
              borderRadius: "5px",
              fontFamily: "croma_sans_regular",
              height: "38px",
              width: "100px",
              padding: "5px",
            }}
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
              onDragOver={onDragOver}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Background variant="lines" gap={16} size={1} color="#dee9f2" />
              <Controls />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};
export default GraphEditor;
