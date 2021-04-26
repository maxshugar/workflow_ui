import styles from './index.module.css';

import Terminal from 'react-animated-term'
import 'react-animated-term/dist/react-animated-term.css'

export const Console = () => {

    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    const termLines = [
    {
        text: 'Process Engine',
        cmd: true,
        delay: 80
    },
    {
        text: '✔ Loaded app',
        cmd: false,
        repeat: true,
        repeatCount: 5,
        frames: spinner.map(function (spinner) {
        return {
            text: spinner + ' Loading app',
            delay: 10
        }
        })
    },
    ]

    return(
        <Terminal
            lines={termLines}
            interval={10}
        />
    );
}