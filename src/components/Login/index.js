import Background from '../Background';
import { AdminUrlContext } from '../../AdminUrlContext';
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
import axios from 'axios';
import { grey } from '@material-ui/core/colors';

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
  const adminUrl = useContext(AdminUrlContext).adminUrl;
  const setCredentials = useContext(AdminUrlContext).setCredentials;
  const classes = useStyles();
  const [values, setValues] = useState({
    email: '',
    password: '',
    errorMessage: '',
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = values;
    const response = await axios
      .post(`${adminUrl}/auth/local`, {
        identifier: email,
        password: password,
      })
      .catch((err) => {
        try {
          let message = err.response.data.message[0].messages[0].message;
          console.log(message);
          setValues({ ...values, errorMessage: message });
        } catch {
          setValues({ ...values, errorMessage: 'something went wrong' });
        }
        return;
      });
    if (!response) return;
    console.log(response);
    localStorage.setItem('jwt', response.data.jwt);
    localStorage.setItem('email', email);
    localStorage.setItem('loggedIn', true);
    setCredentials({
      email: email,
      loggedIn: true,
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
