// https://stackoverflow.com/questions/50685175/react-material-ui-warning-prop-classname-did-not-match
// https://github.com/mui-org/material-ui/tree/master/examples/nextjs
// may be needed for _document.js
import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;