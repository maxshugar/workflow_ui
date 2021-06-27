import React from 'react';
export const SideBar =  ({setFormatLayout}) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
};

  return (
      <div  style={customNodeStyles} className="dndnode" onDragStart={(event) => onDragStart(event, 'ScriptNode')} draggable>
        New Node
      </div>
  );
};