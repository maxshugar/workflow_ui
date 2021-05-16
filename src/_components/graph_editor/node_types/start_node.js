import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
};

export const StartNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <div>Start Sequence</div>
        <Handle
          type="source"
          position="bottom"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };