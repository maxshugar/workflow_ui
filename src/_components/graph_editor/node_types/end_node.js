import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
};

export const EndNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <div>End Sequence</div>
        <Handle
          type="target"
          position="top"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };