import React, { useState } from 'react'

import {
    Paper,
    Toolbar,
    Typography,
    Tooltip,
    IconButton,
    Menu,
    Grid,
    ListItem,
    InputBase,
    Button,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableSortLabel,
    TableBody,
    TableRow,
    TableCell,

} from '@material-ui/core';

import {
    FormatLineSpacingRounded,
    CloseRounded,
    MoreVert,
    ArrowDownwardRounded,
    ArrowUpwardRounded,
    AddRounded,
    PermPhoneMsgSharp,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        // padding: '2px 4px',
        display: 'flex',
        // alignItems: 'center',
        // width: '90%',
    },
    input: {
        // marginLeft: theme.spacing(1),
        // flex: 1,
    },
    iconButton: {
        // padding: 10,
    },
    divider: {
        // height: 28,
        // margin: 4,
    },
  }));

export default function Priorities(props) {
    const classes = useStyles();
    const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
    const [newPriority, setNewPriority] = useState(undefined)

    const open = Boolean(priorityAnchorEl);

    const handlePriorityMenu = (event) => {
            setPriorityAnchorEl(event.currentTarget);
        };

    const handlePriorityMenuClose = () => {
            setPriorityAnchorEl(null);
        };

    const handleUpwardAction = (level, index) => {
            let stage = [...props.priorities]
            stage[level - 1].push(props.priorities[level][index])
            stage[level].splice(index, 1)
            if (stage[level].length === 0) stage.splice(level, 1)
            localStorage.setItem('priorities', JSON.stringify([...stage]))
            props.setPriorities([...stage])
        }

    const handleDownwardAction = (level, index) => {
            let stage = [...props.priorities]
            level === stage.length - 1 ? stage.push([props.priorities[level][index]]) : stage[level + 1].push(props.priorities[level][index])
            stage[level].splice(index, 1)
            if (stage[level].length === 0) stage.splice(level, 1)
            localStorage.setItem('priorities', JSON.stringify([...stage]))
            props.setPriorities([...stage])
        }

    const handleRemoveAction = (level, index) => {
            let stage = [...props.priorities]
            stage[level].splice(index, 1)
            if (stage[level].length === 0) stage.splice(level, 1)
            localStorage.setItem('priorities', JSON.stringify([...stage]))
            props.setPriorities([...stage])
        }

    const handleAddAction = (event) => {
            if (newPriority) {
                let stage = [...props.priorities]
                stage.length > 0 ? stage[stage.length - 1].push(newPriority) : stage.push([newPriority])
                localStorage.setItem('priorities', JSON.stringify([...stage]))
                props.setPriorities([...stage])
                setNewPriority('')
            }
        }

    const handlePriorityChange = (event, level, index) => {
            let stage = [...props.priorities]
            stage[level][index] = event.target.value
            props.setPriorities([...stage])
        }

    return(
        <React.Fragment>
            <Tooltip title='Priorities' placement='top'>
                <IconButton onClick={handlePriorityMenu} >
                    <FormatLineSpacingRounded />
                </IconButton>
            </Tooltip>
            <Menu 
                className={classes.root}
                anchorEl={priorityAnchorEl}
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
                onClose={handlePriorityMenuClose}
            >
                {props.priorities.map((level) => level.map((priority) => 
                    <ListItem divider={level.indexOf(priority) === level.length - 1 && props.priorities.indexOf(level) < props.priorities.length - 1 ? true : false}>
                        <InputBase fullWidth value={priority} onChange={(event) => handlePriorityChange(event, props.priorities.indexOf(level), level.indexOf(priority))}/>
                        {props.priorities.indexOf(level) !== 0 ? (
                            <IconButton edge={'end'} size={'small'} onClick={() => handleUpwardAction(props.priorities.indexOf(level), level.indexOf(priority))}>
                                <ArrowUpwardRounded />
                            </IconButton>
                        ) : null}
                        {level.length > 1 ? (
                            <IconButton edge={'end'} size={'small'} onClick={() => handleDownwardAction(props.priorities.indexOf(level), level.indexOf(priority))}>
                                <ArrowDownwardRounded />
                            </IconButton>
                        ) : null }
                        <IconButton edge={'end'} size={'small'} onClick={() => handleRemoveAction(props.priorities.indexOf(level), level.indexOf(priority))}>
                            <CloseRounded />
                        </IconButton>
                    </ListItem>
                ))}
                <ListItem>
                    <TextField 
                        fullWidth 
                        variant={'outlined'} 
                        size={'small'} 
                        label={'Add Priority'}
                        InputProps={{
                            color: 'secondary'
                        }}
                        InputLabelProps={{
                            color: 'secondary'
                        }} 
                        value={newPriority}
                        onChange={(event) => setNewPriority(event.target.value)}
                    />
                    <IconButton edge={'end'} size={'small'} onClick={handleAddAction}>
                        <AddRounded />
                    </IconButton>
                </ListItem>
            </Menu>
        </React.Fragment>
    )
}