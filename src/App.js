import Login from './components/Login';
import AdminInterface from './components/AdminInterface';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from './theme';
import { useState, useEffect } from 'react';
import { AdminUrlContext } from './AdminUrlContext';

export default function App() {
  const [credentials, setCredentials] = useState({
    email: '',
    loggedIn: false,
  });
  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      setCredentials({
        email: localStorage.getItem('email'),
        loggedIn: true,
      });
    }
  }, []);

  function logout() {
    setCredentials({
      email: '',
      loggedIn: false,
    });
    localStorage.clear();
  }

  return (
    <>
      <AdminUrlContext.Provider value='http://localhost:1337'>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          {credentials.loggedIn ? (
            <AdminInterface logout={logout} />
          ) : (
            <Login />
          )}
        </ThemeProvider>
      </AdminUrlContext.Provider>
    </>
  );
}
