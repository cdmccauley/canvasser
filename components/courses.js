import React, { useState } from 'react'

import {
    Tooltip,
    IconButton,
    Menu,
    ListItem,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';

import {
    AppsRounded
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        formControlLabel: {
            marginLeft: 0
        }
    }));

function Course(props) {
    const classes = useStyles();
    const [checked, setChecked] = useState(props.course.active)

    const handleCourseCheckboxChange = (event) => {
        setChecked(event.target.checked)
        props.course.active = event.target.checked
        props.setActiveCourses(event.target.checked ? [...props.activeCourses, props.course.code] : [...props.activeCourses.filter((courseCode) => courseCode !== props.course.code)])
        localStorage.setItem('activeCourses', event.target.checked ? JSON.stringify([...props.activeCourses, props.course.code]) : JSON.stringify([...props.activeCourses.filter((courseCode) => courseCode !== props.course.code)]))
    }

    return (
        <FormControlLabel 
            className={classes.formControlLabel}
            key={props.course.code}
            label={props.course.code}
            labelPlacement="start"
            control={
                <Checkbox 
                    checked={checked} 
                    onChange={handleCourseCheckboxChange} 
                    name={props.courseId}
                />}
        />
    )
}

export default function Courses(props) {
    const classes = useStyles();
    const [coursesAnchorEl, setCoursesAnchorEl] = useState(null);

    const open = Boolean(coursesAnchorEl);

    const handleCoursesMenu = (event) => {
            setCoursesAnchorEl(event.currentTarget);
        };

    const handleCoursesMenuClose = () => {
            setCoursesAnchorEl(null);
        };
    
    // if (props.courses && !props.activeCourses) {
    //     props.setActiveCourses(Array.from(Object.values(props.courses), (course) => course.code))
    //     localStorage.setItem('activeCourses', Array.from(Object.values(props.courses), (course) => course.code))
    // }

    return(
        <React.Fragment>
            <Tooltip title='Courses' placement='top'>
                <IconButton onClick={handleCoursesMenu} >
                    <AppsRounded />
                </IconButton>
            </Tooltip>
            <Menu 
                className={classes.root}
                anchorEl={coursesAnchorEl}
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
                onClose={handleCoursesMenuClose}
            >
                <ListItem>
                    <FormControl component="fieldset">
                        <FormGroup>
                            {Object.values(props.courses).sort((a, b) => a.code.localeCompare(b.code)).map((course) => 
                                <Course 
                                    key={Object.keys(props.courses)[Object.values(props.courses).indexOf(course)]}
                                    courseId={Object.keys(props.courses)[Object.values(props.courses).indexOf(course)]}
                                    course={course}
                                    activeCourses={props.activeCourses}
                                    setActiveCourses={props.setActiveCourses}
                                />
                            )}
                        </FormGroup>
                    </FormControl>
                </ListItem>
            </Menu>
        </React.Fragment>
    )
}