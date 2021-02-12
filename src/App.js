import Login from './components/AuthSections/Login';
import AdminInterface from './components/AuthSections/AdminInterface';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from './theme';
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import firebase from './firebase';

export default function App() {
  const [credentials, setCredentials] = useState({
    email: null,
  });

  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     setCredentials({
  //       email: user.email,
  //     });
  //   }
  // });

  function logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setCredentials({ email: null });
      })
      .catch((err) => {
        console.log('A logout error occurred.');
      });
  }

  return (
    <>
      <CssBaseline />
      <AuthContext.Provider
        value={{
          useCredentials: [credentials, setCredentials],
        }}
      >
        <ThemeProvider theme={theme}>
          {credentials.loggedIn ? (
            <AdminInterface logout={logout} />
          ) : (
            <Login />
          )}
        </ThemeProvider>
      </AuthContext.Provider>
    </>
  );
}
