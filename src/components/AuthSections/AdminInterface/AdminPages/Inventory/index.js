import { Typography, makeStyles } from '@material-ui/core';
import { AdminContext } from '../../AdminContext';
import { useContext } from 'react';
import Table from './Table';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: theme.typography.jackFont,
  },
}));

export default function Inventory() {
  const classes = useStyles();
  const [inventory, setInventory] = useContext(AdminContext).inventory;
  return (
    <>
      <Typography className={classes.heading} variant='h5'>
        Current inventory
      </Typography>
      {Array.isArray(inventory) && inventory[0] ? (
        <Table />
      ) : (
        <p>Inventory is empty.</p>
      )}
    </>
  );
}
