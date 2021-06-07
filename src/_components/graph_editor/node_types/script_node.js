import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
};

export const ScriptNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <Handle
          type="target"
          position="left"
          style={{ height: '10px', width: '10px' }}
        />
        <div>{data.label}</div>
        <Handle
          type="source"
          position="right"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };