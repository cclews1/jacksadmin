import { useState, useRef, useEffect, useContext } from 'react';
import { PhotoCamera, Close } from '@material-ui/icons';
import {
  Button,
  Card,
  IconButton,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { imageGet } from '../../firebaseUtilities';
import { AdminContext } from './AdminContext';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  header: {
    fontFamily: theme.typography.jackFont,
  },
  fileUploadContainer: {
    marginTop: '2rem',
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
  imageUploadHeader: {
    fontFamily: theme.typography.jackFont,
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
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 270,
  },
  cardContainer: {
    position: 'relative',
    margin: '0.75rem',
  },
  imageDelete: {
    backgroundColor: 'lightgrey',
    position: 'absolute',
    top: '-15px',
    right: '-15px',
  },
}));

export default function FileUpload({
  label,
  prevImages,
  updatePrevFilesCb,
  imagesLabel,
  prevImagesLabel,
  updateFilesCb,
  maxFileSizeInBytes = 5000000,
  ...otherProps
}) {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const context = useContext(AdminContext);
  const [inventory, setInventory] = context.inventory;
  const classes = useStyles();

  useEffect(() => {
    setFiles({});
  }, [inventory]);

  const handleUploadClick = () => {
    fileInputField.current.click();
  };

  const handleFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
      console.log(files);
    }
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size < maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const convertNestedObjectToArray = (nestedObj) => {
    // Object.keys(nestedObj).map((key) => nestedObj[key]);
    return Object.values(nestedObj);
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  function removePrevImage(imageName) {
    const filteredImages = prevImages.filter((image) => image !== imageName);
    updatePrevFilesCb(filteredImages);
  }

  return (
    <div className={classes.fileUploadContainer}>
      <Typography variant='h5' className={classes.header}>
        {label}
      </Typography>
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

      {files && Object.keys(files)[0] ? (
        <>
          <Typography className={classes.imageUploadHeader}>
            {imagesLabel}:{' '}
            {files && Object.keys(files)[0] ? Object.keys(files).length : 0}
          </Typography>
          <section className={classes.uploadedFilesContainer}>
            {Object.keys(files).map((fileName) => {
              const file = files[fileName];
              return (
                <ImageRender
                  key={fileName}
                  removeFile={removeFile}
                  fileName={fileName}
                  fileData={file}
                />
              );
            })}
          </section>
        </>
      ) : null}
      {prevImages ? (
        <>
          <Typography className={classes.imageUploadHeader}>
            {prevImagesLabel}: {prevImages.length}
          </Typography>
          <section className={classes.uploadedFilesContainer}>
            {prevImages.map((image) => {
              return (
                <ImageRender
                  isPrevImage
                  key={image}
                  removeFile={removePrevImage}
                  fileName={image}
                />
              );
            })}
          </section>
        </>
      ) : null}
    </div>
  );
}

function ImageRender({ removeFile, fileData, fileName, isPrevImage }) {
  const classes = useStyles();

  const [file, setFile] = useState();

  useEffect(() => {
    if (isPrevImage) {
      // console.log(file);
      imageGet(fileName).then((imgUrl) => {
        setFile(imgUrl);
      });
    } else {
      setFile(URL.createObjectURL(fileData));
    }
  }, [fileName]);

  return (
    <div className={classes.cardContainer}>
      <Card className={classes.card}>
        {file === undefined ? (
          <Skeleton variant='rect' className={classes.cardMedia} />
        ) : (
          <CardMedia
            className={classes.cardMedia}
            image={file}
            alt={`file preview ${fileName}`}
          />
        )}
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
}
