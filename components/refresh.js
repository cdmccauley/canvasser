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
        let rate = 60;
        if (!isNaN(event.target.value.trim())) {
            rate = parseFloat(event.target.value.trim()) > 0 ? parseFloat(event.target.value.trim()) : 0
        }
        props.setRefreshRate(rate)
        localStorage.setItem('refreshRate', rate)
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