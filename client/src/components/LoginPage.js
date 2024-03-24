import React, { useState, useContext } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import Header from './Header';

const defaultTheme = createTheme();

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const emailErrorEle = document.getElementById('emailError');
  const passwordErrorEle = document.getElementById('passwordError');
  const handleSubmit = async (event) => {
    event.preventDefault();
    emailErrorEle.textContent = '';
    passwordErrorEle.textContent = '';
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json();
      if (!(data.user)) {
        emailErrorEle.textContent = data.errors.email;
        passwordErrorEle.textContent = data.errors.password;

      }
      if (data.user) {
        console.log(data.user)
        setUserInfo(data.user);
        console.log(userInfo)
        setRedirect(true);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  if (redirect) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Header />

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '90%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
              />
              <Typography
                color={'error'}
                name="emailError"
                fullWidth
                id="emailError">

              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
              />
              <Typography
                color={'error'}
                name="passwordError"
                fullWidth
                id="passwordError">

              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container spacing={2}>
                <Grid item marginLeft={'auto'}>
                  <Link href="/signup" variant="body2">
                    "Don't have an account? Sign Up"
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>

        </Container>
      </ThemeProvider>
    </>
  );
}