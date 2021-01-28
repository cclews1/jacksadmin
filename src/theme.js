import { createMuiTheme } from '@material-ui/core/styles';
import { yellow, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow[500],
    },
    secondary: {
      main: grey[900],
    },
    background: {
      default: '#fff',
    },
    lightGrey: {
      main: grey[300],
    },
    white: {
      main: grey[100],
    },
  },
  typography: {
    jackFont: "'Roboto Slab', serif",
  },
});

export default theme;
