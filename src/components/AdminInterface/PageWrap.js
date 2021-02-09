import { Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: theme.breakpoints.values.md,
    width: '100%',
    // backgroundColor: theme.palette.lightGrey.main,
  },
}));

export default function PageWrap({ children }) {
  const classes = useStyles();
  return <Paper className={classes.container}>{children}</Paper>;
}
