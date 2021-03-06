import { useState, useContext, useEffect } from 'react';
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
  Popper,
  Paper,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Edit,
  Visibility,
  VisibilityOff,
  DeleteForever,
} from '@material-ui/icons';
import { AdminContext } from '../../AdminContext';
import firebase from '../../../../../firebase';
import { removeVehicle, pullInventory } from '../../../../firebaseUtilities';
const storage = firebase.storage();

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
  description: {
    padding: '1rem',
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
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Pictures</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.tableBody}>
          {inventory[0] ? (
            inventory.map((car, i) => <Row car={car} key={i} />)
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
  const [open, setOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const context = useContext(AdminContext);
  const [editVehicle, setEditVehicle] = context.editVehicle;
  const [location, setLocation] = context.location;
  const [message, setMessage] = context.message;

  function openEditor(e) {
    e.preventDefault();
    setEditVehicle(car);
    setLocation('editVehicle');
  }

  async function handleDelete(e) {
    const newMessage = await removeVehicle(car);
    await pullInventory(context);
    setMessage({ ...newMessage, open: true });
  }
  return (
    <>
      <StyledTableRow key={car.id} classes={classes.tableRow}>
        <TableCell>
          <IconButton
            aria-label='Delete Vehicle'
            size='small'
            onClick={handleDelete}
          >
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
        <TableCell>{car.date}</TableCell>
        <TableCell>{car.year}</TableCell>
        <TableCell>{car.make}</TableCell>
        <TableCell>{car.model}</TableCell>
        <TableCell>{car.price}</TableCell>
        <TableCell>{car.miles}</TableCell>
        <TableCell>
          {car.description ? (
            <DescriptionPopup description={car.description} />
          ) : (
            'No description.'
          )}
        </TableCell>
        <TableCell>
          {car.images && car.images[0] ? (
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout='auto' unmountOnExit={true}>
            <Box margin={1} className={classes.pictureBox}>
              {car.images && car.images[0]
                ? car.images.map((image) => {
                    return <InventoryImage img={image} key={image} />;
                  })
                : null}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
function InventoryImage({ img }) {
  const classes = useStyles();
  const [imgUrl, setImgUrl] = useState();
  const height = 100;
  const width = 100;
  useEffect(() => {
    storage
      .ref(`${img}`)
      .getDownloadURL()
      .then((url) => setImgUrl(url))
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      {imgUrl ? (
        <Card className={classes.pictureCard}>
          <CardMedia style={{ height: height, width: width }} image={imgUrl} />
        </Card>
      ) : (
        <Skeleton
          variant='rect'
          className={classes.pictureCard}
          width={width}
          height={height}
        />
      )}
    </>
  );
}

function DescriptionPopup({ description }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(e) {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'description' : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        open={open}
        type='button'
        onClick={(e) => handleClick(e)}
      >
        {open ? <Visibility /> : <VisibilityOff />}
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Paper className={classes.description}>{description}</Paper>
      </Popper>
    </div>
  );
}
