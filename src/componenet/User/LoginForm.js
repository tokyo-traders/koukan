import {useRef, useState, useEffect, useCallback, useContext } from "react";
import useAuth from "../hooks/useAuth";
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
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation} from "react-router-dom";

const REGISTER_URL = '/api/user/login';

const RoundedButton = styled(Button)(() => ({
    borderRadius: 35,
    backgroundColor: "#D904B5",
    color: "#46C8F5",
    padding: "15px 36px",
    fontSize: "18px"
}));

const theme = createTheme();

function LoginForm({ Login, error }) {

  const { setAuth } = useAuth();
  const [details, setDetails] = useState({email:"", password:""});
  const [success, setSucess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage"
  const signup = useCallback(()=> navigate('/signup', {replace: true}), [navigate]);
  const myPage = useCallback(()=> {
    if (from === "/signup") {
      navigate('/MyPage', {replace: true})
    } else {
      navigate(from, {replace: true})
    }
    }, [navigate]);



  useEffect(() => {
    if (success) myPage();
  },[success])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(REGISTER_URL,
      JSON.stringify({email:details.email.toLowerCase(), password:details.password}),
        {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
        }
      )
      const accessToken = response?.data.jwt
      setAuth({user: details.email, password: details.password, accessToken});
      setSucess(true);

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
    } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
    } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
    } else {
        setErrMsg('Login Failed');
    }
    }
  
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
            color="#D904B5"
          >
            Welcome Back!
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
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
                <Link
                  onClick={signup}
                >
                  Don't have an account? Sign Up
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