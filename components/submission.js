import React, { useState } from 'react'

import {
    TableRow,
    TableCell,
    Checkbox,
    Link,
} from '@material-ui/core';

import styles from '../styles/Submission.module.css';

export default function Submission(props) {
    // const [submission, setSubmission] = useState(props.submission)
    const [checked, setChecked] = useState(props.submission.status === 'self-reserved' ? true : false)

    const handleReserveRequest = (event) => {
        if (event.target.dataset.indeterminate === 'false') {
            if (event.target.checked) {
                Object.assign(document.createElement('a'), {
                    target: '_blank',
                    href: props.submission.submissionUrl
                }).click()
                fetch('/api/i-reserve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'reserve',
                        _id: props.submission.submissionUrl,
                        grader: `*${props.user.name}`,
                        reserved_at: new Date().toLocaleString().replace(',', '')
                    })
                })
                .catch((error) => console.log('/components/submission.handleReserveRequest error: ', error))
            } else {
                fetch('/api/i-reserve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'unreserve',
                        items: [props.submission.submissionUrl]
                    })
                })
                .catch((error) => console.log('/components/submission.handleReserveRequest error: ', error))
            }
            setChecked(event.target.checked)
        }
            // if (event.target.dataset.indeterminate === 'false') setChecked(event.target.checked)
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