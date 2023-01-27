import * as React from 'react';
import { useState, useEffect, useCallback, useContext } from 'react'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Link from '@mui/material/Link';
import { createTheme, CssBaseline, Menu } from '@mui/material';
import useAuth from './hooks/useAuth';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ThemeProvider } from 'styled-components';


// const RoundedButton = styled(Button)(() => ({
//     borderRadius: 35,
//     backgroundColor: "#D904B5",
//     color: "#46C8F5",
//     padding: "15px 36px",
//     fontSize: "18px"
// }));

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#3cd64b',
      contrastText: 'white',
    },
    secondary: {
      main: '#4d3e38'
    },
  },
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

function NavBar(props) {

  const { user, setUser, setUserState, handleSearchChange, searchValue } = props
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // const [searchValue, setSearchValue] = useState('');
  console.log(searchValue)


  const from = location.state?.from?.pathname || "/MyPage"
  const myPage = useCallback(() => navigate('/MyPage', { replace: true }), [navigate]);
  const login = useCallback(() => navigate('/login', { replace: true }), [navigate]);
  const home = useCallback(() => navigate('/', { replace: true }), [navigate]);
  const logup = useCallback(() => {
    if (from === "/signup") {
      navigate('/MyPage', { replace: true })
    } else {
      navigate(from, { replace: true })
    }
  }, [navigate]);

  const displayUser = () => {
    console.log(user)
  }

  const logOut = () => {

    setAuth({});
    setUser(undefined);
    setUserState(false);
    home();
  }

  // const handleSearchChange = (event) => {
  //   setSearchValue(event.target.value);
  // }

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   props.onSearch(searchValue);
  // }


  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: "white" }}>
            <Toolbar
              sx={{
                justifyContent: "space-between"
              }}
            >
              <Link
                variant="body1"
                fontFamily="Roboto Slab"
                padding={2}
                color="secondary"
                onClick={home}
                underline='none'
              >
                <div>TOKYO</div>
                <div>TRADERS</div>
              </Link>
              <Search onChange={handleSearchChange}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Looking for something?"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
              {!user ? <Button color='secondary' variant='contained' onClick={login}>LOG IN</Button> :
                <div>
                  <Button color='secondary' variant='contained' onClick={myPage}>My Page</Button>
                  <Button variant='contained' onClick={logOut}>Log Out</Button>
                </div>}
            </Toolbar>
          </AppBar>
        </Box>
        <Outlet />
      </ThemeProvider>
    </>
  );
}

export default NavBar;
