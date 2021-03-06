import { useState, useContext } from 'react';
import { makeStyles, Button, TextField, Typography } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import FileUpload from '../../FileUpload';
import { AdminContext } from '../../AdminContext';
import { handleSubmit, pullInventory } from '../../../../firebaseUtilities';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: theme.breakpoints.values.sm,
  },
  heading: {
    fontFamily: theme.typography.jackFont,
  },
  textField: {
    margin: '0.5rem',
  },
  descriptionField: {
    width: '14rem',
  },
  textFieldWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  uploadWrapper: {
    height: '100%',
    width: '100%',
    marginTop: '1rem',
  },
  submitButton: {
    marginTop: '1rem',
  },
}));

function Add() {
  const context = useContext(AdminContext);
  const [message, setMessage] = context.message;
  const classes = useStyles();
  const [location, setLocation] = context.location;
  const [uploadForm, setUploadForm] = useState({});
  const [images, setImages] = useState();

  function handleChange(e, value) {
    setUploadForm({ ...uploadForm, [value]: e.target.value });
  }

  async function submit(e) {
    if (!uploadForm.make && !uploadForm.model) {
      return setMessage({
        message: 'Please enter make and model of vehicle.',
        severity: 'warning',
        open: true,
      });
    }
    const newMessage = await handleSubmit(e, uploadForm, images, context);
    await pullInventory(context);
    await setLocation('inventory');
    setMessage({ ...newMessage, open: true });
  }
  return (
    <div className={classes.form}>
      <Typography variant='h5' className={classes.heading}>
        Add Vehicle
      </Typography>
      <TextFields uploadForm={uploadForm} handleChange={handleChange} />
      <div className={classes.uploadWrapper}>
        <FileUpload
          label='Upload Images'
          imagesLabel='Images to Upload'
          multiple
          accept='.jpg,.png,.jpeg'
          updateFilesCb={setImages}
        />
      </div>
      <Button
        className={classes.submitButton}
        variant='contained'
        color='primary'
        startIcon={<Publish />}
        onClick={submit}
      >
        Submit Vehicle
      </Button>
    </div>
  );
}

function TextFields({ uploadForm, handleChange }) {
  const classes = useStyles();
  return (
    <div className={classes.textFieldWrapper}>
      <TextField
        className={classes.textField}
        label='Make'
        color='secondary'
        value={uploadForm.make}
        type='text'
        onChange={(e) => handleChange(e, 'make')}
      />
      <TextField
        className={classes.textField}
        label='Model'
        color='secondary'
        value={uploadForm.model}
        type='text'
        onChange={(e) => handleChange(e, 'model')}
      />
      <TextField
        className={classes.textField}
        label='Year'
        color='secondary'
        value={uploadForm.year}
        type='number'
        onChange={(e) => handleChange(e, 'year')}
      />
      <TextField
        className={classes.textField}
        label='Price'
        color='secondary'
        value={uploadForm.price}
        type='number'
        onChange={(e) => handleChange(e, 'price')}
      />
      <TextField
        className={classes.textField}
        label='Miles'
        color='secondary'
        value={uploadForm.miles}
        type='number'
        onChange={(e) => handleChange(e, 'miles')}
      />
      <TextField
        className={classes.textField + ' ' + classes.descriptionField}
        color='secondary'
        label='Description'
        value={uploadForm.description}
        type='text'
        multiline
        onChange={(e) => handleChange(e, 'description')}
      />
    </div>
  );
}

export default Add;
