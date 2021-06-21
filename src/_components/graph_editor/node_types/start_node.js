import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    backgroundColor: 'blue',
    color: '#FFF',
    padding: 10,
};

export const StartNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <div>START</div>
        <Handle
          type="source"
          position="bottom"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };