import {useRef, useState, useEffect } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled, alpha } from '@mui/material/styles';

const RoundedButton = styled(Button)(() => ({
    borderRadius: 35,
    backgroundColor: "#D904B5",
    color: "#46C8F5",
    padding: "15px 36px",
    fontSize: "18px"
}));

const theme = createTheme();

function LoginForm({ Login, error }) {
  const [details, setDetails] = useState({email:"", password:""});


  const handleSubmit = e => {
    e.preventDefault();

    console.log({email:details.email, password:details.password})

    axios
    .post('/api/user/login', 
    JSON.stringify({email:details.email, password:details.password})
    )
    .then((res) => {
      console.log(res)
     })
    .catch((err) => alert("error!"));
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5">
            Welcome Back!
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={e => setDetails({...details, email:e.target.value})}
              value={details.email}
              />
            <TextField
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={e => setDetails({...details, password:e.target.value})}
              value={details.password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <RoundedButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </RoundedButton>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link component="button" href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginForm