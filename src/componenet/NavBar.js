import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { color } from '@mui/system';


const RoundedButton = styled(Button)(() => ({
    borderRadius: 35,
    backgroundColor: "#D904B5",
    color: "#46C8F5",
    padding: "15px 36px",
    fontSize: "18px"
}));


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  borderRadius: '23px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{background:"#2E038C"}} position="static">
        <Toolbar
          sx={{
            justifyContent: "space-between"
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5"
          >
            <div>TOKYO</div>
            <div>TRADERS</div>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Looking for something?"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <RoundedButton variant='contained'>LOG IN</RoundedButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
