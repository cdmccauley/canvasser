import React, { useState, useEffect } from 'react'

import useUser from "../data/use-user";
import useCourses from '../data/use-courses';
import useIReserve from '../data/use-i-reserve';
import useQueue from '../data/use-queue';

import { makeStyles } from '@material-ui/core/styles';

import Submission from '../components/submission'

import {
    Paper,
    Toolbar,
    Typography,
    Tooltip,
    IconButton,
    Menu,
    ListItem,
    TextField,
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

import {
    FormatLineSpacingRounded,
    NewReleasesRounded,
    PriorityHighRounded,
    FilterListRounded,
    RestoreRounded,
    SyncRounded,
    SyncDisabledRounded,

} from '@material-ui/icons';

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
    { id: 'assignmentName', label: 'Assignment' },
    { id: 'courseName', label: 'Course' },
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
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState(null)
    // const [checked, setChecked] = useState(false)
    // const [timer, setTimer] = useState(null)
    // const [reserved, setReserved] = useState([])
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
            setAnchorEl(event.currentTarget);
        };

    const handleMenuClose = () => {
            setAnchorEl(null);
        };

    const handleFilter = (event) => {
            setFilter(event.target.value)
        }

    const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        };

    const handleReserveRequest = (event) => {
        console.log(event.target.checked)
        // queue[event.target.id].status = queue[event.target.id].status === 'unreserved' && queue[event.target.id].status !== 'reserved' ? 'self-reserved' : 'unreserved'
        if (queue[event.target.id].status === 'unreserved') {
            queue[event.target.id].status = 'self-reserved'
        } else if (queue[event.target.id].status === 'self-reserved') {
            queue[event.target.id].status = 'unreserved'
        }
        // setChecked(event.target.checked)
        console.log(event.target.checked)
    }

    const { courses, courseError, mutateCourses } = useCourses({
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey
    })

    const { user, errored, mutate } = useUser(props.canvasUrl && props.apiKey ? `${props.canvasUrl}/api/v1/users/self?access_token=${props.apiKey}` : null);
    
    const { iReserve, iReserveError, mutateIReserve } = useIReserve({
        canvasUrl: props.canvasUrl,
        user: user
    });

    const { queue, queueError, mutateQueue } = useQueue({
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey,
        courses: courses,
        reserve: iReserve
    })

    if (!props.canvasUrl || !props.apiKey) return 'Authorization Required'

    if (courseError) return 'course error';
    if (Object.keys(courses).length === 0) return 'Loading Courses';

    if (queueError) return 'queue error';
    if (Object.keys(queue).length === 0) return 'Loading Queue';

    // for debugging
    if (courses) console.log('courses:', courses)
    if (iReserve) console.log('iReserve:', iReserve)
    if (queue) console.log('queue:', queue)

    if (queue && iReserve && Object.keys(iReserve).length > 0) Object.values(queue).map((submission) => {
        // submission.status = iReserve.reserved.includes(submission.submissionUrl) ? 'reserved' : iReserve.selfReserved.includes(submission.submissionUrl) ? 'self-reserved' : 'unreserved';
        if (iReserve.reserved.includes(submission.submissionUrl)) {
            submission.status = 'reserved'
        } else if (iReserve.selfReserved.includes(submission.submissionUrl)) {
            submission.status = 'self-reserved'
            iReserve.selfReserved.splice(iReserve.selfReserved.indexOf(submission), 1)
        } else {
            submission.status = 'unreserved'
        }
    })

    if (iReserve && iReserve.selfReserved.length > 0) fetch('/api/i-reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'unreserve',
                items: iReserve.selfReserved
            })
        })
        .catch((error) => console.log('unreserve error: ', error))

    return(
        <Paper>
            <Toolbar >
                <Typography style={{flex: '1 1 100%'}}>
                    {Object.keys(queue).length} Total Submissions
                </Typography>
                <Tooltip title='Priorities' placement='top'>
                    <span>
                    <IconButton disabled >
                        <FormatLineSpacingRounded />
                    </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Refresh Timer' placement='top'>
                    <span>
                    <IconButton disabled >
                        <RestoreRounded />
                    </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Filter' placement='top'>
                    <IconButton edge={'end'} onClick={handleMenu}>
                        <FilterListRounded />
                    </IconButton>
                </Tooltip>
                <Menu 
                    anchorEl={anchorEl}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleMenuClose}
                >
                    <ListItem>
                    <TextField 
                        variant='outlined'
                        label='Filter'
                        InputProps={{
                            color: 'secondary'
                        }}
                        InputLabelProps={{
                            color: 'secondary'
                        }}
                        onChange={handleFilter}
                    />
                    </ListItem>
                </Menu>
            </Toolbar>
            <TableContainer style={{marginBottom: '2em'}}>
                <Table>
                    <CustomTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(stableSort( filter ? Object.values(queue).filter((submission) => `${submission.assignmentName} ${courses[submission.courseId].name}`.toLowerCase().includes(filter.toLowerCase())) : Object.values(queue) , getComparator('asc', 'submittedAt')), getComparator(order, orderBy))
                        .map((submission, index) => {
                            return(
                                <Submission 
                                    user={user}
                                    submission={submission}
                                />
                                // <TableRow
                                //     hover
                                //     key={submission.id}
                                // >
                                //     <TableCell padding='checkbox'>
                                //         <Checkbox
                                //             id={submission.id}
                                //             onChange={handleReserveRequest}
                                //             checked={submission.status === 'self-reserved' ? true : false} 
                                //             indeterminate={submission.status === 'reserved' ? true : false}
                                //         />
                                //     </TableCell>
                                //     <TableCell>{submission.priority}</TableCell>
                                //     <TableCell><Link color='inherit' href={submission.submissionUrl} target='_blank' rel='noopener'>{submission.assignmentName}</Link></TableCell>
                                //     <TableCell><Link color='inherit' href={submission.userUrl} target='_blank' rel='noopener'>{courses[submission.courseId].name}</Link></TableCell>
                                //     <TableCell className={styles.timestamp}>{submission.submittedAt.toLocaleString()}</TableCell>
                                // </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}