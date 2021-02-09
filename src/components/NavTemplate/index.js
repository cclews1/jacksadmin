import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core';
import { List, AddCircleOutline, Edit } from '@material-ui/icons';
import Background from '../Background';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: theme.typography.jackFont,
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  content: {
    width: '100%',
  },
}));

export default function NavTemplate({
  location,
  setLocation,
  children,
  logout,
  loggedIn,
}) {
  const classes = useStyles();

  return (
    <>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarContainer}>
            <Typography variant='h4' className={classes.headerText}>
              Jacks Admin
            </Typography>
            <Button onClick={logout}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <Background loggedIn={true}>{children}</Background>
      </div>
      <BottomNavigation
        value={location}
        onChange={(event, newLocation) => {
          setLocation(newLocation);
        }}
        showLabels
        className={classes.bottomNav}
      >
        <BottomNavigationAction
          value='inventory'
          label='Inventory'
          icon={<List />}
        />
        <BottomNavigationAction
          value='addVehicle'
          label='Add Vehicle'
          icon={<AddCircleOutline />}
        />
        <BottomNavigationAction
          value='editVehicle'
          label='Edit Vehicle'
          icon={<Edit />}
        />
      </BottomNavigation>
    </>
  );
}
