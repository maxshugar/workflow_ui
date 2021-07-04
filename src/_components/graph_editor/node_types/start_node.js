import React from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#5680E9',
    color: '#FFF',
    padding: 10,
    fontFamily: 'croma_sans_regular',
    borderRadius: '10px',
};

export const StartNode = ({ data }) => {
    return (
      <div style={customNodeStyles}>
        <div>Start</div>
        <Handle
          type="source"
          position="bottom"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };