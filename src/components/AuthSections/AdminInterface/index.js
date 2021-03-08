import { useState, useEffect } from 'react';
import {
  makeStyles,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Inventory from './AdminPages/Inventory';
import NavTemplate from '../../NavTemplate';
import PageWrap from './PageWrap';
import { AdminContext } from './AdminContext';
import Edit from './AdminPages/Edit';
import Add from './AdminPages/Add';
import { pullInventory } from '../../firebaseUtilities';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function AdminInterface({ logout }) {
  const classes = useStyles();
  const [location, setLocation] = useState('inventory');
  const [inventory, setInventory] = useState();
  const [editVehicle, setEditVehicle] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    open: false,
    message: '',
    severity: '',
  });

  const store = {
    inventory: [inventory, setInventory],
    location: [location, setLocation],
    editVehicle: [editVehicle, setEditVehicle],
    pullInventory: pullInventory,
    message: [message, setMessage],
    loading: [loading, setLoading],
  };

  useEffect(() => {
    pullInventory(store);
  }, []);

  return (
    <>
      <AdminContext.Provider value={store}>
        <div className={classes.container}>
          <Backdrop open={loading} className={classes.backdrop}>
            <CircularProgress color='primary' />
          </Backdrop>
          <NavTemplate
            location={location}
            setLocation={setLocation}
            logout={logout}
            loggedIn={true}
          >
            <PageWrap>
              {location === 'inventory' && <Inventory />}
              {location === 'addVehicle' && <Add />}
              {location === 'editVehicle' && <Edit />}
            </PageWrap>
          </NavTemplate>
        </div>
        <DisplayMessage message={message} setMessage={setMessage} />
      </AdminContext.Provider>
    </>
  );
}
function DisplayMessage({ message, setMessage }) {
  if (typeof message.message !== 'string') {
    if (typeof message.message.message === 'string') {
      message.message = message.message.message;
    } else {
      message.message = 'An error has occurred.';
    }
  }
  function handleClose(e) {
    setMessage({ message: '', severity: '', open: false });
  }
  return (
    <Snackbar
      open={message.open}
      autoHideDuration={8000}
      onClose={handleClose}
      style={{
        marginBottom: '2rem',
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert elevation={6} severity={message.severity} onClose={handleClose}>
        {message.message}
      </Alert>
    </Snackbar>
  );
}
