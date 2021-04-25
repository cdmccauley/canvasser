import React from 'react'

import useUser from "../data/use-user";

import { Avatar } from '@material-ui/core';

import {
    AccountCircle,
    Error
} from '@material-ui/icons';

export default function User(props) {
    // console.log('user props: ', props)
    const { user, errored, mutate } = useUser(props.canvasUrl && props.apiKey ? `${props.canvasUrl}/api/v1/users/self?access_token=${props.apiKey}` : null);

    if (errored) return <Avatar style={{height: 36, width: 36}}><Error /></Avatar>;
    if (!user) return <Avatar style={{height: 36, width: 36}}><AccountCircle style={{ fontSize: 36 }} /></Avatar>;

    // for debugging
    if (user) console.log(user)

    return (
        <Avatar src={user.avatar_url} alt={user.name} style={{height: 36, width: 36, border: '2px solid white' }} />
    )
}