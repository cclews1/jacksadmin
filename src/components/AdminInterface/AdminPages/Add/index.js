import { useState } from 'react';
import { makeStyles, TextField, Typography } from '@material-ui/core';
import firebase from '../../../../firebase';
import uuid from 'uuid/dist/v4';
import FileUpload from '../../FileUpload';

const carDB = firebase.database().ref('cars/');
const storage = firebase.storage().ref();

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
    margin: '1rem 0',
    width: '100%',
  },
  uploadWrapper: {
    height: '100%',
    width: '100%',
    marginTop: '1rem',
  },
}));

export default function Add() {
  const classes = useStyles();
  const [uploadForm, setUploadForm] = useState({});
  const [images, setImages] = useState([]);

  function updateUploadedFiles(files) {
    setImages(files);
  }

  function handleChange(e, value) {
    setUploadForm({ ...uploadForm, [value]: e.target.value });
  }
  function uploadFile(newKey, image) {
    const imgId = uuid();
    const fileRef = storage.child(imgId);
    fileRef.put(image);
    carDB.child(newKey + '/images').push(imgId);
  }
  function handleSubmit(e) {
    // const newKey = carDB.push().key;
    // carDB.child(newKey).set(uploadForm, (err) => {
    //   if (err) {
    //     console.log(err.message);
    //   } else {
    //     uploadFile(newKey);
    //   }
    // });
    // console.log(image);
  }

  function handleImage(index, e) {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);
  }
  return (
    <div className={classes.form}>
      <Typography variant='h5' className={classes.heading}>
        Add Vehicle
      </Typography>
      <TextField
        className={classes.textField}
        label='Make'
        value={uploadForm.make}
        type='text'
        onChange={(e) => handleChange(e, 'make')}
      />
      <TextField
        className={classes.textField}
        label='Model'
        value={uploadForm.model}
        type='text'
        onChange={(e) => handleChange(e, 'model')}
      />
      <TextField
        className={classes.textField}
        label='Year'
        value={uploadForm.year}
        type='number'
        onChange={(e) => handleChange(e, 'year')}
      />
      <TextField
        className={classes.textField}
        label='Price'
        value={uploadForm.price}
        type='number'
        onChange={(e) => handleChange(e, 'price')}
      />
      <TextField
        className={classes.textField}
        label='Miles'
        value={uploadForm.miles}
        type='number'
        onChange={(e) => handleChange(e, 'miles')}
      />
      <div className={classes.uploadWrapper}>
        <FileUpload
          images={images}
          label='Upload Images'
          multiple
          accept='.jpg,.png,.jpeg'
          updateFilesCb={updateUploadedFiles}
        />
      </div>
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
}
