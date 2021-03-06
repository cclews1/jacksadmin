import Background from '../../Background';
import { AuthContext } from '../../../AuthContext';
import {
  makeStyles,
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useState, useContext } from 'react';
import { Email, VpnKey } from '@material-ui/icons';
import firebase from '../../../firebase';

const useStyles = makeStyles((style) => ({
  container: {
    padding: '1rem',
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: '1rem 0',
  },
  login: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
  },
  jacksText: {
    fontFamily: "'Roboto Slab', serif",
  },
  inputWrapper: {
    margin: '0.5rem 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: '1rem 0',
  },
}));

export default function Login() {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: '',
    password: '',
    errorMessage: '',
  });
  const { useCredentials } = useContext(AuthContext);

  const [credentials, setCredentials] = useCredentials;

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = values;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        console.log(userCredentials);
        setCredentials({ email: userCredentials.user.email });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <Background loggedIn={false}>
      <div className={classes.container}>
        <form onSubmit={handleSubmit}>
          <Paper className={classes.login}>
            <Typography
              variant='h5'
              className={classes.jacksText + ' ' + classes.title}
            >
              Admin Login
            </Typography>
            <div className={classes.inputWrapper}>
              <TextField
                label='Email'
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                type='email'
                variant='outlined'
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className={classes.inputWrapper}>
              <TextField
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                type='password'
                label='Password'
                variant='outlined'
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            {values.errorMessage ? (
              <Alert severity='error'>{values.errorMessage}</Alert>
            ) : null}
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.button + ' ' + classes.jacksText}
            >
              Login
            </Button>
          </Paper>
        </form>
      </div>
    </Background>
  );
}
