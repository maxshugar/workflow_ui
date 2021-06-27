import { faCheckCircle, faCircleNotch, faCog, faExclamationCircle, faExclamationTriangle, faHourglass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';
import Styled from "styled-components";

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
          position="top"
          style={{ height: '10px', width: '10px' }}
        />
        <div>{data.label}</div>
        <div style={{margin: '0 auto', width: '20%'}}>
        {
          data.state === 'STATE_SEQ_TASK_IDLE' &&
          <FontAwesomeIcon icon={faHourglass} />
        }
        {
          data.state === 'STATE_SEQ_TASK_RUNNING' &&
          <FontAwesomeIcon icon={faCog} className="fa-spin" style={{color: 'aqua'}} />
        }
        {
          data.state === 'STATE_SEQ_TASK_COMPLETE' &&
          <FontAwesomeIcon icon={faCheckCircle} style={{color: 'lime'}} />
        }
        {
          data.state === 'STATE_SEQ_TASK_ERROR' &&
          <FontAwesomeIcon icon={faExclamationTriangle} style={{color: '#FF3131'}} />
        }
        </div>
        <Handle
          type="source"
          position="bottom"
          style={{ height: '10px', width: '10px' }}
        />
      </div>
    );
  };