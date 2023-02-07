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
import { createTheme, CssBaseline, IconButton, Menu } from '@mui/material';
import useAuth from './hooks/useAuth';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { hover } from '@testing-library/user-event/dist/hover';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';

const GreenButton = styled(Button)(() => ({
  // borderRadius: 8,
  backgroundColor: "#3cd64b",
  color: "#def4f6",
  "&:hover": {
    background: "#32B13E"
  }
  // padding: "15px 36px",
  // fontSize: "14px"
}));

const customTheme = createTheme({
  root: {
    backgroundColor: "#def4f6",
  }

});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  borderRadius: '4px',
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
  color: '#4d3e38',
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
    color: '#4d3e38',
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '45ch',
      },
    },
  },
}));

function NavBar(props) {

  const { user, setUser, setUserState, handleSearchChange } = props
  const { setAuth } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  // const displayUser = () => {
  //   console.log(user)
  // }

  const logOut = () => {
    setAuth({});
    setUser(undefined);
    setUserState(false);
    home();
  }

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleSearchChange = (event) => {
  //   setSearchValue(event.target.value);
  // }

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   props.onSearch(searchValue);
  // }


  return (
    <>
      {/* <ThemeProvider theme={customTheme}> */}
      <CssBaseline />
      <Box sx={{ flexGrow: 1, }} bgcolor={'blue'}>
        <AppBar position="static" sx={{ background: "#def4f6" }}>
          <Toolbar
            sx={{
              justifyContent: "space-between"
            }}
          >
            <Link
              variant="body1"
              fontFamily="Roboto Slab"
              padding={2}
              paddingLeft={3}
              color="#3cd64b"
              onClick={home}
              underline='none'
            >
              <div>TOKYO</div>
              <div>TRADERS</div>
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Looking for something?"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
              />
            </Search>
            {!user ? <GreenButton variant='contained' onClick={login}>LOG IN</GreenButton> :
              <div>
                <span style={{ color: "black" }} fontFamily="Roboto Slab">{user.username}</span>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="#3CD64B"
                >
                  <AccountCircle sx={{ fontSize: "40px" }} />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >

                  <MenuItem variant='contained' onClick={myPage}>My Page</MenuItem>
                  <MenuItem variant='contained' onClick={logOut}>Log Out</MenuItem>

                </Menu>
              </div>}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
      {/* </ThemeProvider> */}
    </>
  );
}

export default NavBar;