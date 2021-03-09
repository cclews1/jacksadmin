import { useState, useContext, useEffect } from 'react';
import {
  Typography,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@material-ui/core';
import { Publish, DeleteForever } from '@material-ui/icons';
import { AdminContext } from '../../AdminContext';
import FileUpload from '../../FileUpload';
import {
  update,
  pullInventory,
  removeVehicle,
} from '../../../../firebaseUtilities';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: theme.typography.jackFont,
  },
  pictureHeading: {
    marginTop: '1rem',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: theme.breakpoints.values.sm,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: theme.breakpoints.values.sm,
  },
  textField: {
    margin: '0.5rem',
  },
  descriptionField: {
    width: '14rem',
  },
  imageCard: {
    width: '100%',
  },
  cardMedia: {
    height: 200,
    width: 300,
    maxWidth: '100%',
  },
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  deleteButton: {
    width: '100%',
    marginTop: '1rem',
  },
}));

function Edit() {
  const classes = useStyles();
  const context = useContext(AdminContext);
  const [location, setLocation] = context.location;
  const [editVehicle, setEditVehicle] = context.editVehicle;
  const [inventory, setInventory] = context.inventory;
  const [message, setMessage] = context.message;
  const [loading, setLoading] = context.loading;
  const [editValues, setEditValues] = useState(editVehicle);
  const [newImages, setNewImages] = useState([]);
  const [prevImages, setPrevImages] = useState([]);

  useEffect(() => {
    if (inventory) {
      setEditValues(editVehicle);
      setPrevImages(editVehicle.images);
      setNewImages([]);
    }
  }, [editVehicle, inventory]);

  async function changeVehicle(e) {
    await setEditVehicle(e.target.value);
  }

  function handleChange(e, field) {
    setEditValues({ ...editValues, [field]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true)
    const userMessage = await update(
      newImages,
      editValues,
      prevImages,
      editVehicle
    );
    setLoading(false)
    setEditVehicle(inventory[0]);
    setMessage({ ...userMessage, open: true });
    await pullInventory(context);
  }

  async function handleDelete() {
    const userMessage = await removeVehicle(editVehicle);
    setMessage({ ...userMessage, open: true });
    await pullInventory(context);
    setLocation('inventory');
  }

  return (
    <>
      <Typography className={classes.heading} variant='h5'>
        Edit Vehicle
      </Typography>
      {inventory && inventory[0] ? (
        <div className={classes.formContainer}>
          <FormControl className={classes.formControl} color='secondary'>
            <InputLabel>Vehicle</InputLabel>
            <Select value={editVehicle} onChange={changeVehicle}>
              {inventory.map((car) => {
                return (
                  <MenuItem value={car} key={car.id}>
                    {car.year} {car.make} {car.model}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <div className={classes.form}>
            <TextField
              className={classes.textField}
              value={editValues.make}
              label='Make'
              color='secondary'
              onChange={(e) => handleChange(e, 'make')}
            />
            <TextField
              className={classes.textField}
              value={editValues.model}
              color='secondary'
              label='Model'
              onChange={(e) => handleChange(e, 'model')}
            />
            <TextField
              className={classes.textField}
              value={editValues.year}
              color='secondary'
              label='Year'
              type='number'
              onChange={(e) => handleChange(e, 'year')}
            />
            <TextField
              className={classes.textField}
              value={editValues.price}
              color='secondary'
              label='Price'
              type='number'
              onChange={(e) => handleChange(e, 'price')}
            />
            <TextField
              className={classes.textField}
              value={editValues.miles}
              color='secondary'
              label='Mileage'
              type='number'
              onChange={(e) => handleChange(e, 'miles')}
            />
            <TextField
              className={classes.textField + ' ' + classes.descriptionField}
              value={editValues.description}
              color='secondary'
              label='Description'
              multiline
              type='text'
              onChange={(e) => handleChange(e, 'description')}
            />
          </div>
          <FileUpload
            prevImages={prevImages}
            updatePrevFilesCb={setPrevImages}
            label='Add or Remove Images'
            imagesLabel='New Images'
            prevImagesLabel='Current Images'
            multiple
            accept='.jpg,.png,.jpeg'
            updateFilesCb={setNewImages}
          />
          <div className={classes.buttonsWrapper}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Publish />}
              onClick={handleSubmit}
            >
              Submit Changes
            </Button>
            <Button
              variant='contained'
              className={classes.deleteButton}
              startIcon={<DeleteForever />}
              onClick={handleDelete}
            >
              Delete Vehicle
            </Button>
          </div>
        </div>
      ) : (
        <p>No vehicles to edit.</p>
      )}
    </>
  );
}

export default Edit;
