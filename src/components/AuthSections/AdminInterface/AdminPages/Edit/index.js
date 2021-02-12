import { useState, useContext } from 'react';
import {
  Typography,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardMedia,
} from '@material-ui/core';
import { AdminContext } from '../../AdminContext';
import { AdminUrlContext } from '../../../../AdminUrlContext';

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
  },
  textField: {
    margin: '0.7rem 0',
  },
  imageCard: {
    width: '100%',
  },
  cardMedia: {
    height: 200,
    width: 300,
    maxWidth: '100%',
  },
}));

export default function Edit() {
  const classes = useStyles();
  const adminUrl = useContext(AdminUrlContext);
  const [editVehicle, setEditVehicle] = useContext(AdminContext).editVehicle;
  const [inventory, setInventory] = useContext(AdminContext).inventory;
  const [editor, setEditor] = useState(editVehicle);
  function handleChange(e, field) {
    setEditor({ ...editor, [field]: e.target.value });
  }
  function changeVehicle(e) {
    setEditVehicle(e.target.value);
    setEditor(e.target.value);
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
                  <MenuItem value={car}>
                    {car.year} {car.make} {car.model}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            className={classes.textField}
            value={editor.make}
            label='Make'
            color='secondary'
            onChange={(e) => handleChange(e, 'make')}
          />
          <TextField
            className={classes.textField}
            value={editor.model}
            color='secondary'
            label='Model'
            onChange={(e) => handleChange(e, 'model')}
          />
          <TextField
            className={classes.textField}
            value={editor.year}
            color='secondary'
            label='Year'
            type='number'
            onChange={(e) => handleChange(e, 'year')}
          />
          <TextField
            className={classes.textField}
            value={editor.miles}
            color='secondary'
            label='Mileage'
            type='number'
            onChange={(e) => handleChange(e, 'miles')}
          />
          <Typography
            className={classes.heading + ' ' + classes.pictureHeading}
          >
            Pictures
          </Typography>
          {editor.pictures[0] ? (
            editor.pictures.map((picture) => {
              let imgUrl;
              if (picture.formats.large) {
                imgUrl = picture.formats.large.url;
              } else if (picture.formats.medium) {
                imgUrl = picture.formats.medium.url;
              } else if (picture.formats.small) {
                imgUrl = picture.formats.small.url;
              } else imgUrl = picture.url;

              return (
                <Card className={classes.imageCard}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={adminUrl + imgUrl}
                  />
                </Card>
              );
            })
          ) : (
            <p>Loading Images . . .</p>
          )}
        </div>
      ) : (
        <p>loading editor...</p>
      )}
    </>
  );
}
