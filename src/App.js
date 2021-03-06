import Login from './components/AuthSections/Login';
import AdminInterface from './components/AuthSections/AdminInterface';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from './theme';
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import firebase from './firebase';

export default function App() {
  const [credentials, setCredentials] = useState({});

  useEffect(() => {
    firebase
      .auth()
      .onAuthStateChanged((userCredentials) =>
        setCredentials(
          userCredentials ? { email: userCredentials.email } : false
        )
      );
  }, []);

  async function logout() {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        setCredentials({ email: null });
      })
      .catch((err) => {
        console.log('A logout error occurred.');
      })
      .finally(async () => {
        localStorage.clear();
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
          {credentials.email ? <AdminInterface logout={logout} /> : <Login />}
        </ThemeProvider>
      </AuthContext.Provider>
    </>
  );
}
