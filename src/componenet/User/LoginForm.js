import { useRef, useState, useEffect, useCallback, useContext } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { padding } from "@mui/system";
import jwt_decode from "jwt-decode";

const REGISTER_URL = "api/user/login";

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "8px",
  color: "#def4f6",
  "&:hover": {
    background: "#332925",
  },
  // padding: "15px 36px",
  fontSize: "16px",
}));

function LoginForm(props) {
  const { setUserState, userState } = props;

  const { setAuth } = useAuth();
  const [details, setDetails] = useState({ email: "", password: "" });
  const [success, setSucess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage";
  const signup = useCallback(
    () => navigate("/signup", { replace: true }),
    [navigate]
  );
  const myPage = useCallback(() => {
    if (from === "/signup") {
      navigate("/MyPage", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (success) myPage();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          email: details.email.toLowerCase(),
          password: details.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      const accessToken = response?.data.jwt;
      const decoded = accessToken ? jwt_decode(accessToken) : undefined;
      console.log(decoded);
      if (decoded) {
        setAuth({ user: decoded.info, accessToken });
      }
      // setUserState(true);
      // setSucess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // marginLeft: '40%'
        }}
      >
        <Typography
          variant='h4'
          fontFamily='Roboto Slab'
          padding={2}
          color='#4d3e38'
        >
          Welcome Back!
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          component='form'
          onSubmit={handleSubmit}
          justifyContent={"center"}
        >
          <TextField
            margin='normal'
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            value={details.email}
          />
          <TextField
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='new-password'
            onChange={(e) =>
              setDetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  value='remember'
                  color='primary'
                />
              }
              label='Remember me'
            />
          </Box>
          <BrownButton
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </BrownButton>
          <Grid container>
            {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
            <Grid
              item
              marginBottom={3}
            >
              <Link onClick={signup}>Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default LoginForm;
