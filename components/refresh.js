import React, {useState} from 'react';

import {
    Tooltip,
    IconButton,
    Menu,
    ListItem,
    InputBase,
    TextField,
} from '@material-ui/core';

import {
    RestoreRounded,
} from '@material-ui/icons';

export default function Refresh(props) {
    const [refreshAnchorEl, setRefreshAnchorEl] = useState(null);
    const [newRefresh, setNewRefresh] = useState(undefined)

    const open = Boolean(refreshAnchorEl);

    const handleRefreshMenu = (event) => {
            setRefreshAnchorEl(event.currentTarget);
        };

    const handleRefreshMenuClose = () => {
            setRefreshAnchorEl(null);
        };

    const handleRefreshChange = (event) => {
        props.setRefreshRate(event.target.value > 0 ? event.target.value : 0)
        localStorage.setItem('refreshRate', event.target.value > 0 ? event.target.value : 0)
    }

    return (
        <React.Fragment>
            <Tooltip title='Refresh Timer' placement='top'>
                <IconButton onClick={handleRefreshMenu}>
                    <RestoreRounded />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={refreshAnchorEl}
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
                onClose={handleRefreshMenuClose}
            >
                <ListItem>
                    <TextField 
                        fullWidth
                        value={props.refreshRate}
                        onChange={handleRefreshChange}
                        variant={'outlined'} 
                        size={'small'} 
                        label={'Refresh Rate (Seconds)'}
                        InputProps={{
                            color: 'secondary'
                        }}
                        InputLabelProps={{
                            color: 'secondary'
                        }} 
                    />
                </ListItem>
            </Menu>
        </React.Fragment>
    )
}