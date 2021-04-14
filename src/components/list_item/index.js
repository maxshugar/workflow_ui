import React, { useState } from 'react';
import './index.css';

export const ListItem = props => {
    const className = `list-group-item list-group-item-action${props.isActive ? ' active' : ''}`;

    return (
        <li className={className} onClick={props.onClick}>{props.text} </li>
    )
}