import React, { useState, useContext } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Header from './Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext';
import { red, green } from '@mui/material/colors';
const defaultTheme = createTheme();

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(null);
  // const [emailedOtp,setEmailedOtp] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const userNameErrorEle = document.getElementById('userNameError');
  const emailErrorEle = document.getElementById('emailError');
  const passwordErrorEle = document.getElementById('passwordError');
  const otpMesgEle = document.getElementById('otpMesg');
  const [isVerified, setVerified] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    userNameErrorEle.textContent = '';
    emailErrorEle.textContent = '';
    passwordErrorEle.textContent = '';
    try {
      const response = await fetch('https://glidethrough-backend.vercel.app/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json();

      if (!(data.user)) {
        userNameErrorEle.textContent = data.errors.username;
        emailErrorEle.textContent = data.errors.email;
        passwordErrorEle.textContent = data.errors.password;

      }
      if (data.user) {
        setUserInfo(data.user);
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

  async function sendOtp(email) {
    emailErrorEle.textContent = "";
    try {
      const response = await fetch('https://glidethrough-backend.vercel.app/getotp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json(); //otp or errormesg
      console.log(data);
      if (!(data.otp)) {
        emailErrorEle.textContent = data.errors;
      }
      // else{
      //   setEmailedOtp(data.otp);
      // }
    }
    catch (err) {
      console.log(err);
    }
  }

  async function verifyOtp(otp) {
    try {
      const response = await fetch('https://glidethrough-backend.vercel.app/verifyotp', {
        method: 'POST',
        body: JSON.stringify({ otp }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json(); //otp or errormesg
      console.log(data);
      if (data.otp) {
        otpMesgEle.textContent = "Verified";
        setVerified(1);
      }
      else {
        otpMesgEle.textContent = "Incorrect OTP";
        setVerified(0);
      }
      // else{
      //   setEmailedOtp(data.otp);
      // }
    }
    catch (err) {
      console.log(err);
    }
    
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                  <Typography
                    color={'error'}
                    name="emailError"
                    fullWidth
                    id="emailError">

                  </Typography>
                  <Button onClick={() => sendOtp(email)}>Get OTP</Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="Otp"
                    required
                    fullWidth
                    id="otp"
                    label="Enter Code"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                  />
                  <Typography
                    color={(isVerified === 1) ? green[500] : red[500]}
                    name="otpMesg"
                    fullWidth
                    id="otpMesg">
                  </Typography>
                  <Button onClick={() => verifyOtp(otp)}>Verify</Button>


                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="userName"
                    required
                    fullWidth
                    id="userName"
                    label="user name"
                    value={username} onChange={e => setUsername(e.target.value)}
                    disabled={(!isVerified) ? true : false}
                  />
                  <Typography
                    color={'error'}
                    name="userNameError"
                    fullWidth
                    id="userNameError">

                  </Typography>
                </Grid>


                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    disabled={(!isVerified) ? true : false}
                  />
                  <Typography
                    color={'error'}
                    name="passwordError"
                    fullWidth
                    id="passwordError">

                  </Typography>
                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Log in
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
