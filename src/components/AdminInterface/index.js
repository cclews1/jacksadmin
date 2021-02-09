import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Inventory from './AdminPages/Inventory';
import NavTemplate from '../NavTemplate';
import PageWrap from '../AdminInterface/PageWrap';
import axios from 'axios';
import { AdminUrlContext } from '../../AdminUrlContext';
import { AdminContext } from './AdminContext';
import Edit from '../AdminInterface/AdminPages/Edit';
import Add from './AdminPages/Add';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function AdminInterface({ logout, loggedIn }) {
  const classes = useStyles();
  const [location, setLocation] = useState('inventory');
  const [inventory, setInventory] = useState();
  const [editVehicle, setEditVehicle] = useState();

  const store = {
    inventory: [inventory, setInventory],
    location: [location, setLocation],
    editVehicle: [editVehicle, setEditVehicle],
  };

  const adminUrl = useContext(AdminUrlContext);

  useEffect(() => {
    async function fetchInventory() {
      const inventory = await axios
        .get(`${adminUrl}/cars`, {
          headers: {
            Authorization: `Bearer ${localStorage.jwt}`,
          },
        })
        .then((res) => {
          setInventory(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchInventory();
  }, [adminUrl]);

  return (
    <AdminContext.Provider value={store}>
      <div className={classes.container}>
        <NavTemplate
          location={location}
          setLocation={setLocation}
          logout={logout}
          loggedIn={loggedIn}
        >
          <PageWrap>
            {location === 'inventory' && <Inventory />}
            {location === 'addVehicle' && <Add />}
            {location === 'editVehicle' && <Edit />}
          </PageWrap>
        </NavTemplate>
      </div>
    </AdminContext.Provider>
  );
}
