import React, { useState } from 'react'

import {
    TableRow,
    TableCell,
    Checkbox,
    Link,
} from '@material-ui/core';

import styles from '../styles/Submission.module.css';

export default function Submission(props) {

    const [checked, setChecked] = useState(props.submission.status === 'self-reserved' ? true : false)

    const handleReserveRequest = (event) => {
        // queue[event.target.id].status = queue[event.target.id].status === 'unreserved' && queue[event.target.id].status !== 'reserved' ? 'self-reserved' : 'unreserved'
        // if (queue[event.target.id].status === 'unreserved') {
        //     queue[event.target.id].status = 'self-reserved'
        // } else if (queue[event.target.id].status === 'self-reserved') {
        //     queue[event.target.id].status = 'unreserved'
        // }
        // setChecked(event.target.checked)
        // console.log(event.target.dataset.indeterminate)
        if (event.target.dataset.indeterminate === 'false') setChecked(event.target.checked)
        
    }

    return(
        <TableRow
            hover
            key={props.submission.id}
        >
            <TableCell padding='checkbox'>
                <Checkbox
                    id={props.submission.id}
                    onChange={handleReserveRequest}
                    checked={checked} 
                    indeterminate={props.submission.status === 'reserved' ? true : false}
                />
            </TableCell>
            <TableCell>{props.submission.priority}</TableCell>
            <TableCell><Link color='inherit' href={props.submission.submissionUrl} target='_blank' rel='noopener'>{props.submission.assignmentName}</Link></TableCell>
            <TableCell><Link color='inherit' href={props.submission.userUrl} target='_blank' rel='noopener'>{props.submission.courseName}</Link></TableCell>
            <TableCell className={styles.timestamp}>{props.submission.submittedAt.toLocaleString()}</TableCell>
        </TableRow>
    )
}