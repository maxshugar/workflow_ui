import React from 'react';
export const SideBar =  () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'StartNode')} draggable>
        StartNode
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'ScriptNode')} draggable>
        ScriptNode
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'EndNode')} draggable>
        EndNode
      </div>
    </aside>
  );
};