import React, { useState, useEffect, useRef } from 'react'

import { useIsMount } from '../libs/use-is-mount';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    InputAdornment,
    DialogActions,
    Button,

} from '@material-ui/core';

import {
    Public,
    VpnKey,
    Check
} from '@material-ui/icons';

export default function Authorize(props) {
    const [keyError, setKeyError] = useState(false)
    const [urlError, setUrlError] = useState(false)
    const [keyValid, setKeyValid] = useState(false)
    const [urlValid, setUrlValid] = useState(false)
    const [keyHelperText, setKeyHelperText] = useState(null)
    const [urlHelperText, setUrlHelperText] = useState(null)
    const isMount = useIsMount();
    const urlRef = useRef();
    const keyRef = useRef();

    useEffect(() => {
        // isMount indicates useEffect is being called on first component render
        if (!isMount) if (!keyError && !urlError) {
            // TODO: more parsing/validation
            let url = urlRef.current.value.trim();
            if (url && url.endsWith('/')) url = url.slice(0, url.length - 1)
            localStorage.setItem('canvasUrl', url);
            localStorage.setItem('apiKey', keyRef.current.value.trim());
            props.setCanvasUrl(url)
            props.setApiKey(keyRef.current.value)
            props.setAuthorized(true)
        }
    }, [keyError, urlError, keyValid, urlValid])

    const handleSaveClick = (event) => {
        // TODO: regex for urls
        if (urlRef.current.value && urlRef.current.value !== '') {
            setUrlValid(true)
            setUrlError(false)
            setUrlHelperText(null)
        } else {
            setUrlValid(false)
            setUrlError(true)
            setUrlHelperText('*Required')
        }
        if (keyRef.current.value && keyRef.current.value !== '') {
            setKeyValid(true)
            setKeyError(false)
            setKeyHelperText(null)
        } else {
            setKeyValid(false)
            setKeyError(true)
            setKeyHelperText('*Required')
        }
        // useEffect will be called after setUrlValid, setKeyError, or setUrlError are called
    }

    return(
        <Dialog
            fullWidth
            maxWidth={ 'xs' }
            disableBackdropClick
            disableEscapeKeyDown
            open = { !props.authorized }
        >
            <DialogTitle>
                Authorize
            </DialogTitle>
            <DialogContent>
                <TextField 
                    inputRef={urlRef}
                    fullWidth 
                    margin="normal" 
                    variant="outlined" 
                    label='Canvas URL'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Public />
                            </InputAdornment>
                        ),
                        endAdornment: !urlValid ? null : (
                            <InputAdornment position="end">
                                <Check />
                            </InputAdornment>
                        ),
                        color: 'secondary'
                    }}
                    InputLabelProps={{
                        color: 'secondary'
                    }}
                    error={urlError}
                    helperText={urlHelperText}
                />
                <TextField 
                    inputRef={keyRef}
                    fullWidth 
                    margin="normal" 
                    variant="outlined" 
                    label='API Key'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKey />
                            </InputAdornment>
                        ),
                        endAdornment: !keyValid ? null : (
                            <InputAdornment position="end">
                                <Check />
                            </InputAdornment>
                        ),
                        color: 'secondary'
                    }}
                    InputLabelProps={{
                        color: 'secondary'
                    }}
                    error={keyError}
                    helperText={keyHelperText}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveClick}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}