import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Inventory from './AdminPages/Inventory';
import NavTemplate from '../NavTemplate';
import PageWrap from '../AdminInterface/PageWrap';
import axios from 'axios';
import { AdminUrlContext } from '../../AdminUrlContext';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function AdminInterface({ logout }) {
  const classes = useStyles();
  const [location, setLocation] = useState('inventory');
  const [inventory, setInventory] = useState();
  const adminUrl = useContext(AdminUrlContext);
  console.log(adminUrl);
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
    <div className={classes.container}>
      <NavTemplate
        location={location}
        setLocation={setLocation}
        logout={logout}
      >
        <PageWrap>
          {location === 'inventory' && (
            <Inventory inventory={inventory} adminUrl={adminUrl} />
          )}
          {location === 'addVehicle' && <AddVehicle />}
          {location === 'editVehicle' && <EditVehicle />}
        </PageWrap>
      </NavTemplate>
    </div>
  );
}

function AddVehicle() {
  return <h1>Add Vehicle</h1>;
}

function EditVehicle() {
  return <h1>Edit Vehicle</h1>;
}
