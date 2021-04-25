import Head from 'next/head'
import React, { useState, useEffect } from 'react'

import {
  Container,
  Switch,
  createMuiTheme,
  ThemeProvider,
  CssBaseline
} from '@material-ui/core';

import Authorize from '../components/authorize.js'
import User from '../components/user.js'
import Queue from '../components/queue.js'

// import styles from '../styles/Index.module.css'

export default function Index() {
  const [darkMode, setDarkMode] = useState(true);
  const [authorized, setAuthorized] = useState(false)
  const [canvasUrl, setCanvasUrl] = useState()
  const [apiKey, setApiKey] = useState()

  useEffect(() => {
    if (localStorage.getItem('canvasUrl')) setCanvasUrl(localStorage.getItem('canvasUrl'))
    if (localStorage.getItem('apiKey')) setApiKey(localStorage.getItem('apiKey'))
    if (canvasUrl && apiKey) setAuthorized(true)
  })

  // https://material.io/design/color/the-color-system.html#tools-for-picking-colors
  // https://material-ui.com/customization/color/#playground
  // https://imagecolorpicker.com/
  // https://hexcolor.co/
  const theme = createMuiTheme({
    palette: darkMode ? {
      type: 'dark',
      primary: {
        main: '#383434',
      },
      secondary: {
        main: '#68a7de',
      },
    } :
    {
      type: 'light',
      secondary: {
        main: '#68a7de',
      },
    }
  })

  // may change Container to Box when working on nav
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
        <title>Canvasser</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </Head>
      <CssBaseline />
      <Container>
        <Authorize 
          authorized={ authorized }
          setAuthorized={ setAuthorized }
          apiKey={ apiKey }
          setApiKey={ setApiKey }
          canvasUrl={ canvasUrl }
          setCanvasUrl={ setCanvasUrl }
          />
        <User 
          canvasUrl={ canvasUrl }
          apiKey={ apiKey } />
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        <Queue 
          canvasUrl={ canvasUrl }
          apiKey={ apiKey } />
      </Container>
    </ThemeProvider>
  )
}
// process.env.NEXT_PUBLIC_CANVAS_URL
// process.env.NEXT_PUBLIC_API_KEY