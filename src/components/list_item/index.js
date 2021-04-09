import React, { useState } from 'react';
import './index.css';

export const ListItem = props => {
    //const [collapsed] = useState(true);

    

    return (
        <li onClick={props.onClick}>{props.text} </li>
    )
}