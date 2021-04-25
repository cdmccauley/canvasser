import React, { useState } from 'react'

import useCourses from '../data/use-courses';
import useQueue from '../data/use-queue';

import { makeStyles } from '@material-ui/core/styles';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableSortLabel,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    Link,

} from '@material-ui/core';

import styles from '../styles/Queue.module.css';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// id should be name of object property for sorting
const sortCells = [
    { id: 'priority', label: 'Priority' },
    { id: 'courseName', label: 'Course' },
    { id: 'assignmentName', label: 'Assignment' },
    { id: 'submittedAt', label: 'Submitted' },
  ];

function CustomTableHead(props) {
    const { order, orderBy, onRequestSort, classes } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell>Status</TableCell>
                {sortCells.map((sortCell) => (
                    <TableCell
                        key={sortCell.id}
                        sortDirection={orderBy === sortCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === sortCell.id}
                            direction={orderBy === sortCell.id ? order : 'asc'}
                            onClick={createSortHandler(sortCell.id)}
                        >
                            {sortCell.label}
                            {orderBy === sortCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

const useStyles = makeStyles((theme) => ({
            visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }));

export default function Queue(props) {
    // console.log('queue props: ', props)
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('priority');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

    const { courses, courseError, mutateCourses } = useCourses({
        firstPage: `${props.canvasUrl}/api/v1/courses?enrollment_type=teacher&access_token=`,
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey
    })

    const { queue, queueError, mutateQueue } = useQueue({
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey,
        courses: courses,
    })

    if (!props.canvasUrl || !props.apiKey) return 'Authorization Required'

    if (courseError) return 'course error';
    if (Object.keys(courses).length === 0) return 'loading courses';

    if (queueError) return 'queue error';
    if (Object.keys(queue).length === 0) return 'loading queue';

    // for debugging
    if (courses) console.log('courses:', courses)
    if (queue) console.log('queue:', queue)

    return(
        <Paper>
            <TableContainer>
                <Table>
                    <CustomTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(stableSort(Object.values(queue), getComparator('asc', 'submittedAt')), getComparator(order, orderBy))
                        .map((submission, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return(
                                <TableRow
                                    hover
                                    key={submission.id}
                                >
                                    <TableCell padding='checkbox'><Checkbox /></TableCell>
                                    <TableCell>{submission.priority}</TableCell>
                                    <TableCell><Link color='inherit' href={submission.userUrl} target='_blank' rel='noopener'>{courses[submission.courseId].name}</Link></TableCell>
                                    <TableCell><Link color='inherit' href={submission.submissionUrl} target='_blank' rel='noopener'>{submission.assignmentName}</Link></TableCell>
                                    <TableCell className={styles.timestamp}>{submission.submittedAt.toLocaleString()}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}