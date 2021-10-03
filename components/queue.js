import React, { useState, useEffect } from 'react'

import useUser from "../data/use-user";
import useCourses from '../data/use-courses';
import useIReserve from '../data/use-i-reserve';
import useQueue from '../data/use-queue';

import { filteredQueue } from "../libs/filtered-queue";
import {
    descendingComparator,
    getComparator,
    stableSort
} from '../libs/table-sorters'

import Courses from '../components/courses'
import Priorities from '../components/priorities'
import Refresh from '../components/refresh'
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
} from '@material-ui/core';

/*/
 *  icons that may be used:
 *  NewReleasesRounded,
 *  PriorityHighRounded,
 *  SyncRounded,
 *  SyncDisabledRounded,
/*/
import {
    FormatLineSpacingRounded,
    FilterListRounded,
    RestoreRounded,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

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
                            {orderBy === sortCell.id 
                                ? (<span className={classes.visuallyHidden}>{order === 'desc' 
                                ? 'sorted descending' 
                                : 'sorted ascending'}</span>)
                                : null}
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
    
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('priority');
    const [anchorEl, setAnchorEl] = useState(null);
    const [filter, setFilter] = useState(null)
    const [priorities, setPriorities] = useState([])
    const [refreshRate, setRefreshRate] = useState(60)
    const [count, setCount] = useState(0)
    const [activeCourses, setActiveCourses] = useState(null)

    useEffect(() => {
        if (localStorage.getItem('priorities')) setPriorities(JSON.parse(localStorage.getItem('priorities')))
        if (localStorage.getItem('refreshRate')) setRefreshRate(localStorage.getItem('refreshRate'))
        if (localStorage.getItem('activeCourses')) setActiveCourses(JSON.parse(localStorage.getItem('activeCourses')))
    }, [])

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

    const { user, userError, mutateUser } = useUser(props.canvasUrl && props.apiKey ? `${props.canvasUrl}/api/v1/users/self?access_token=${props.apiKey}` : null);

    const { courses, courseError, mutateCourses } = useCourses({
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey,
        user: user,
        activeCourses: activeCourses,
        setActiveCourses: setActiveCourses
    })
    
    const { iReserve, iReserveError, mutateIReserve } = useIReserve({
        canvasUrl: props.canvasUrl,
        user: user,
        refreshRate: refreshRate
    });

    const { queue, queueError, mutateQueue } = useQueue({
        canvasUrl: props.canvasUrl,
        apiKey: props.apiKey,
        courses: courses,
        reserve: iReserve,
        priorities: priorities,
        refreshRate: refreshRate
    })

    // testing filteredQueue, jest test needs troubleshooting
    // if (queue) {
    //     console.log(queue)
    //     console.log(filteredQueue(["ITEC 1457"], courses, queue, null))
    // }

    if (!props.canvasUrl || !props.apiKey) return 'Authorization Required'

    if (userError) return 'Error Loading User Information';
    if (!user) return 'Loading User Information'

    if (courseError) return 'Error Loading Courses';
    if (!courses) return 'Loading Courses';

    if (!queue && queueError) return 'Error Loading Submissions';
    if (queue && Object.keys(queue).length === 0) {
        props.setSubTotal(0)
    };

    // debugging
    // if (courses) console.log('courses:', courses)
    // if (iReserve) console.log('iReserve:', iReserve)
    // if (queue) console.log('queue:', queue)

    if (courses && !activeCourses) {
        setActiveCourses(Array.from(Object.values(courses), (course) => course.code))
        localStorage.setItem('activeCourses', JSON.stringify(Array.from(Object.values(courses), (course) => course.code)))
    }

    if (queue && iReserve && Object.keys(iReserve).length > 0) {
        // set reservation statuses on each submission
        Object.values(queue).map((submission) => {
            if (iReserve.reserved.includes(submission.submissionUrl)) {
                submission.status = 'reserved'
            } else if (iReserve.selfReserved.includes(submission.submissionUrl)) {
                submission.status = 'self-reserved'
                // remove active self reservations to prepare for inactive to be removed
                iReserve.selfReserved.splice(iReserve.selfReserved.indexOf(submission), 1)
            } else {
                submission.status = 'unreserved'
            }
        })
        // clear inactive self reservations from db
        if (iReserve && iReserve.selfReserved.length > 0) {
                fetch('/api/i-reserve', {
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
        }
    }    

    
    if (queue) {
        
        if (filter) {
            props.setSubTotal(Object.values(queue)
            .filter((submission) => activeCourses.includes(courses[submission.courseId].code))
            .filter((submission) => `${submission.assignmentName} ${courses[submission.courseId].name}`.toLowerCase().includes(filter.toLowerCase())).length)
        } else {
            props.setSubTotal(Object.values(queue)
            .filter((submission) => activeCourses.includes(courses[submission.courseId].code)).length)
        }
    } else {
        props.setSubTotal(null)
    }

    return(
        <Paper>
            <Toolbar >
                <Typography style={{flex: '1 1 100%'}}>
                    {props.subTotal ? `${props.subTotal.toString()} Submissions` : 'Requesting Submissions'}
                </Typography>
                <Courses 
                    courses={courses}
                    activeCourses={activeCourses}
                    setActiveCourses={setActiveCourses}
                />
                <Priorities 
                    priorities={priorities}
                    setPriorities={setPriorities}
                />
                <Refresh
                    refreshRate={refreshRate}
                    setRefreshRate={setRefreshRate}
                />
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
                        size={'small'} 
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
                    {queue && activeCourses ? <TableBody>
                        {stableSort(
                            stableSort(
                                filter ? 
                                    Object.values(queue)
                                    .filter((submission) => activeCourses.includes(courses[submission.courseId].code))
                                    .filter((submission) => `${submission.assignmentName} ${courses[submission.courseId].name}`.toLowerCase().includes(filter.toLowerCase())) 
                                    : 
                                    Object.values(queue)
                                    .filter((submission) => activeCourses.includes(courses[submission.courseId].code)), getComparator('asc', 'submittedAt')), getComparator(order, orderBy))
                        .map((submission) => 
                            <Submission 
                                key={submission.id}
                                user={user}
                                submission={submission}
                                updateIReserve={mutateIReserve}
                            />)}
                    </TableBody> : null}
                </Table>
            </TableContainer>
        </Paper>
    )
}