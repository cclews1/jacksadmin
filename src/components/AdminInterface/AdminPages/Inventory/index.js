import { Typography, makeStyles } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { AdminUrlContext } from '../../../../AdminUrlContext';
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
  const inventory = useContext(AdminContext).inventory;
  return (
    <>
      <Typography className={classes.heading} variant='h5'>
        Current inventory
      </Typography>
      {inventory && inventory[0] ? <Table /> : <p>Loading...</p>}
    </>
  );
}
