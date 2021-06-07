import React from 'react';
export const SideBar =  ({setFormatLayout}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'ScriptNode')} draggable>
        ScriptNode
      </div>
      <button onClick={setFormatLayout(true)}>Format Layout</button>
    </aside>
  );
};