import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#5680E9',
    color: '#FFF',
    borderRadius: '10px',
    fontFamily: 'croma_sans_regular',
    padding: 10,
};

export const EndNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <div>End</div>
        <Handle
          type="target"
          position="top"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };