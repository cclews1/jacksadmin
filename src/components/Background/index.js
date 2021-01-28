import React from 'react';
import { BottomNavigation, makeStyles, Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  backgroundStyle: {
    'background-color': theme.palette.secondary.light,
    'background-image': "url('/img/3px-tile.png')",
    height: '100%',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  childWrapper: {
    height: '100%',
    width: '100%',
    padding: '1rem',
  },
}));

export default function Background({ children, loggedIn }) {
  const classes = useStyles();
  return (
    <>
      {loggedIn && <Toolbar />}
      <div className={classes.backgroundStyle}>
        <div className={classes.childWrapper}>{children}</div>
      </div>
      {loggedIn && <BottomNavigation />}
    </>
  );
}
