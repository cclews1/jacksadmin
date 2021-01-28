import {
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { AdminUrlContext } from '../../../../AdminUrlContext';
import { useContext } from 'react';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: theme.typography.jackFont,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: '1rem',
    maxWidth: theme.breakpoints.values.sm,
    backgroundColor: theme.palette.lightGrey.main,
  },
  cardImage: {
    minWidth: '100px',
    minHeight: '100px',
  },
  carDetails: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  cardContent: {
    width: '100%',
    // height: '500px'
  },
  cardActions: {
    display: 'flex',
    maxHeight: '100px',
    flexDirection: 'column',
    padding: '0.5rem',
    justifyContent: 'space-between',
  },
  button: {
    // width: '5rem',
    margin: 0,
  },
  information: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0.25rem',
  },
  chipField: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.white.main,
    padding: '0 5px',
    borderTopLeftRadius: '7px',
    borderBottomLeftRadius: '7px',
  },
  chipInfo: {
    border: `${theme.palette.secondary.main} solid 1px`,
    padding: '0 5px',
    borderTopRightRadius: '7px',
    borderBottomRightRadius: '7px',
  },
}));

export default function Inventory({ inventory }) {
  const classes = useStyles();
  const adminUrl = useContext(AdminUrlContext);
  return (
    <>
      <Typography className={classes.heading} variant='h5'>
        Current Inventory
      </Typography>
      {inventory
        ? inventory.map((car) => <CarCard adminUrl={adminUrl} details={car} />)
        : null}
    </>
  );
}

function CarCard({ details, adminUrl }) {
  const classes = useStyles();
  const { make, model, pictures, price, year, description, mileage } = details;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  let image;
  pictures[0]
    ? (image = `${adminUrl}${pictures[0].formats.thumbnail.url}`)
    : (image = null);
  return (
    <>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardImage}
          image={image}
          title='car image'
        />
        <div className={classes.carDetails}>
          <CardContent className={classes.cardContent}>
            <CardMedia image={image} />
            <div className={classes.information}>
              {make && <Chip field='make' info={make} />}
              {model && <Chip field='model' info={model} />}
              {year && <Chip field='year' info={year} />}
              {mileage && <Chip field='mileage' info={mileage} />}
              {price && <Chip field='price' info={price} />}
            </div>
          </CardContent>
          <div className={classes.cardActions}>
            {mobile ? (
              <IconButton color='secondary' aria-label='edit'>
                <Edit />
              </IconButton>
            ) : (
              <Button
                className={classes.button}
                size='small'
                variant='contained'
                color='primary'
                endIcon={<Edit />}
              >
                Edit
              </Button>
            )}
            {mobile ? (
              <IconButton color='secondary' aria-label='edit'>
                <Delete />
              </IconButton>
            ) : (
              <Button
                className={classes.button}
                size='small'
                variant='outlined'
                color='secondary'
                endIcon={<Delete />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

function Chip({ field, info }) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.chip}>
        <Typography className={classes.chipField}>{field}</Typography>
        <Typography className={classes.chipInfo}>{info}</Typography>
      </div>
    </>
  );
}
