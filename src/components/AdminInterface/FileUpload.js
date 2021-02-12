import { useState, useRef } from 'react';
import { PhotoCamera, Close } from '@material-ui/icons';
import {
  Button,
  Card,
  IconButton,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  header: {
    fontFamily: theme.typography.jackFont,
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  uploadSection: {
    margin: '1rem 0',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100%',
    padding: ' 1rem',
    border: '2px dotted lightgrey',
  },
  uploadedFilesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '1rem 0',
  },
  cardMedia: {
    height: 180,
    width: '100%',
  },
  card: {
    width: 270,
  },
  cardContainer: {
    position: 'relative',
    margin: '0.75rem',
  },
  input: {
    backgroundColor: 'lightgrey',
    fontSize: '18px',
    display: 'block',
    width: '100%',
    border: 'none',
    textTransform: 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,

    '&:focus': {
      outline: 'none',
    },
  },
  imageDelete: {
    backgroundColor: 'lightgrey',
    position: 'absolute',
    top: '-15px',
    right: '-15px',
  },
}));

function FileUpload({
  label,
  images,
  updateFilesCb,
  maxFileSizeInBytes = 500000,
  ...otherProps
}) {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

  const classes = useStyles();

  function handleUploadClick() {
    fileInputField.current.click();
  }

  function handleFileUpload(e) {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  }

  function addNewFiles(newFiles) {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  }

  function convertNestedObjectToArray(nestedObj) {
    return Object.keys(nestedObj).map((key) => nestedObj[key]);
  }

  function callUpdateFilesCb(files) {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  }

  function removeFile(fileName) {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  }

  return (
    <div className={classes.fileUploadContainer}>
      <Typography className={classes.header}>{label}</Typography>
      <section className={classes.uploadSection}>
        <Typography>Drag and drop or</Typography>
        <Button
          variant='contained'
          color='secondary'
          startIcon={<PhotoCamera />}
          onClick={handleUploadClick}
        >
          Upload
        </Button>
        <input
          className={classes.input}
          type='file'
          ref={fileInputField}
          onChange={handleFileUpload}
          title=''
          value=''
          {...otherProps}
        />
      </section>

      <Typography className={classes.imageUploadHeader}>
        Images To Upload: {images && images[0] ? images.length : 0}
      </Typography>
      <section className={classes.uploadedFilesContainer}>
        {Object.keys(files).map((fileName, i) => {
          let file = files[fileName];
          return (
            <div key={i} className={classes.cardContainer}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={URL.createObjectURL(file)}
                  alt={`file preview ${i}`}
                />
              </Card>
              <IconButton
                size='small'
                className={classes.imageDelete}
                onClick={() => removeFile(fileName)}
              >
                <Close />
              </IconButton>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default FileUpload;
