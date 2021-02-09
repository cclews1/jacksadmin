import { useState, useContext } from 'react';
import {
  makeStyles,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Card,
  CardMedia,
} from '@material-ui/core';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Edit,
  DeleteForever,
} from '@material-ui/icons';
import { AdminUrlContext } from '../../../../AdminUrlContext';
import { AdminContext } from '../../AdminContext';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(4n+1)': {
      backgroundColor: theme.palette.lightGrey.main,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  tableBody: {
    // backgroundColor: theme.palette.lightGrey.main,
  },
  container: {
    padding: '1rem 0',
  },
  pictureBox: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  pictureCard: {
    margin: '0.4rem',
  },
}));

export default function InventoryTable() {
  const [inventory, setInventory] = useContext(AdminContext).inventory;
  const classes = useStyles();
  return (
    <TableContainer className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Delete</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Uploaded</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Make</StyledTableCell>
            <StyledTableCell>Model</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Odometer</StyledTableCell>
            <StyledTableCell>Pictures</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.tableBody}>
          {inventory[0] ? (
            inventory.map((car) => <Row car={car} />)
          ) : (
            <p>Loading Inventory...</p>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row({ car }) {
  const classes = useStyles();
  const adminUrl = useContext(AdminUrlContext);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useContext(AdminContext).editVehicle;
  const [location, setLocation] = useContext(AdminContext).location;
  function openEditor(e) {
    e.preventDefault();
    setEditVehicle(car);
    setLocation('editVehicle');
  }
  return (
    <>
      <StyledTableRow key={car.id} classes={classes.tableRow}>
        <TableCell>
          <IconButton aria-label='Delete Vehicle' size='small'>
            <DeleteForever />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label='Edit Vehicle'
            size='small'
            onClick={openEditor}
          >
            <Edit />
          </IconButton>
        </TableCell>
        <TableCell>{getFormattedDate(car.created_at)}</TableCell>
        <TableCell>{car.year}</TableCell>
        <TableCell>{car.make}</TableCell>
        <TableCell>{car.model}</TableCell>
        <TableCell>{car.price}</TableCell>
        <TableCell>{car.miles}</TableCell>
        <TableCell>
          {car.pictures[0] ? (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          ) : (
            'No pictures.'
          )}
        </TableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1} className={classes.pictureBox}>
              {car.pictures.map((picture) => {
                const imgUrl = `${adminUrl}${picture.formats.thumbnail.url}`;
                return (
                  <>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                    <Card className={classes.pictureCard}>
                      <CardMedia
                        style={{ height: 100, width: 100 }}
                        image={imgUrl}
                      />
                    </Card>
                  </>
                );
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function getFormattedDate(date) {
  let newDate = new Date(date);
  let month = newDate.getMonth() + 1;
  let day = newDate.getDay();
  let year = newDate.getFullYear();
  let formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}
