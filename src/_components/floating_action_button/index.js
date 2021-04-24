import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './index.module.css';

export const FloatingActionButton = (props) => {
    const handleClick = () => {
        props.action();
    }
    return (
        <div
            onClick={handleClick.bind(this)}
            className={styles.floating_menu}>
            <FontAwesomeIcon className={styles.icon} icon={props.icon}/>
            <h5 className={styles.label}>{props.label}</h5>
        </div>
    );
}