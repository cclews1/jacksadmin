import { useState, useRef } from 'react';
import { PhotoCamera } from '@material-ui/icons';
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  header: {
    fontFamily: theme.typography.jackFont,
  },
  imageUploadHeader: {
    // marginBottom: '-0.5rem',
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
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  cardMedia: {
    height: 100,
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 200,
    margin: '1rem 0',
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
    Object.keys(nestedObj).map((key) => nestedObj[key]);
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
        Images To Upload:
      </Typography>
      <section className={classes.uploadedFilesContainer}>
        {Object.keys(files).map((fileName, i) => {
          let file = files[fileName];
          return (
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={URL.createObjectURL(file)}
                alt={`file preview ${i}`}
              />
              <CardActions>
                <Button
                  size='small'
                  color='secondary'
                  onClick={() => removeFile(fileName)}
                >
                  Remove Image
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

export default FileUpload;
