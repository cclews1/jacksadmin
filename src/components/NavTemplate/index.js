import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Hidden,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Fade,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  List,
  AddCircleOutline,
  Edit,
  AccountCircle,
  ExpandMore,
} from '@material-ui/icons';
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
  navButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    margin: '0 0.4rem',
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
  contentAndBottomNavWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomNav: {
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
  },
}));

export default function NavTemplate({
  location,
  setLocation,
  children,
  logout,
}) {
  const classes = useStyles();
  const [anchor, setAnchor] = useState(null);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const locationMap = {
    inventory: {
      name: 'Inventory',
      icon: <List />,
    },
    addVehicle: {
      name: 'Add Vehicle',
      icon: <AddCircleOutline />,
    },
    editVehicle: {
      name: 'Edit Vehicles',
      icon: <Edit />,
    },
    logout: {
      name: 'Logout',
      icon: <AccountCircle />,
    },
  };

  function handleClick(e) {
    setAnchor(e.currentTarget);
  }

  function handleClose() {
    setAnchor(null);
  }

  return (
    <>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarContainer}>
            <Typography
              variant={mobile ? 'h5' : 'h4'}
              className={classes.headerText}
            >
              Jacks Admin
            </Typography>
            <div className={classes.navButtonsContainer}>
              <Hidden xsDown>
                <Button onClick={handleClick} endIcon={<ExpandMore />}>
                  {locationMap[location].name}
                </Button>
                <Menu
                  anchorEl={anchor}
                  keepMounted
                  open={Boolean(anchor)}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <NavButton value='inventory'>Inventory</NavButton>
                  <NavButton value='addVehicle'>Add Vehicle</NavButton>
                  <NavButton value='editVehicle'>Edit Vehicle</NavButton>
                  <NavButton value='logout' isLogout>
                    Logout
                  </NavButton>
                </Menu>
              </Hidden>
              <Hidden smUp>
                <Button onClick={logout}>Logout</Button>
              </Hidden>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.contentAndBottomNavWrapper}>
        <div className={classes.content}>
          <Background loggedIn={true}>{children}</Background>
        </div>
        <Hidden smUp>
          <BottomNavigation
            value={location}
            onChange={(event, newLocation) => {
              setLocation(newLocation);
            }}
            showLabels
            className={classes.bottomNav}
          >
            <BottomNavigationAction
              label='Inventory'
              value='inventory'
              icon={<List />}
            />
            <BottomNavigationAction
              label='Add Vehicle'
              value='addVehicle'
              icon={<AddCircleOutline />}
            />
            <BottomNavigationAction
              label='Edit Vehicle'
              value='editVehicle'
              icon={<Edit />}
            />
          </BottomNavigation>
        </Hidden>
      </div>
    </>
  );
  function NavButton({ value, isLogout }) {
    async function handleClick(e) {
      if (isLogout) {
        await logout();
      } else {
        setLocation(value);
      }
      handleClose();
    }
    return (
      <MenuItem dense onClick={handleClick}>
        <ListItemIcon>{locationMap[value].icon}</ListItemIcon>
        <ListItemText primary={locationMap[value].name} />
      </MenuItem>
    );
  }
}

// function logout() {
//   firebase
//     .auth()
//     .signOut()
//     .then(() => {
//       setCredentials({ email: null });
//     })
//     .catch((err) => {
//       console.log('A logout error occurred.');
//     });
// }
