import { useCallback, useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import axios from "./hooks/axios";
import { CssBaseline, IconButton, Menu } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import useAuth from "./hooks/useAuth";

const GreenButton = styled(Button)(() => ({
  // borderRadius: 8,
  backgroundColor: "#3cd64b",
  color: "#def4f6",
  "&:hover": {
    background: "#32B13E",
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  borderRadius: "4px",
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  color: "#4d3e38",
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    color: "#4d3e38",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "40ch",
      "&:focus": {
        width: "45ch",
      },
    },
  },
}));

function NavBar(props) {
  // const { setUserState, handleSearchChange } = props;
  const { setAuth, auth } = useAuth();
  const user = auth?.user;

  const [search, setSearch] = useState("");
  const [searchView, setSearchView] = useState(true);
  const [searchSuccess, SetSearchSuccess] = useState(true);
  const [searchValue, setSearchValue] = useState([]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setSearchView(true);
  };

  const handleView = (e) => {
    if (e.target.value) {
      setSearch(e.target.value);
      setSearchView(true);
    }
  };

  useEffect(() => {
    if (search.length) {
      axios
        .get(`/api/search?search=${search}`)
        .then((res) => {
          console.log(res.data);
          setSearchValue(res.data);
        })
        .then(() => {
          SetSearchSuccess(false);
        });
    } else {
      SetSearchSuccess(true);
      setSearchView(false);
    }
  }, [search]);

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/MyPage";
  const myPage = useCallback(
    () => navigate("/MyPage", { replace: true }),
    [navigate]
  );
  const login = useCallback(
    () => navigate("/login", { replace: true }),
    [navigate]
  );
  const home = useCallback(() => navigate("/", { replace: true }), [navigate]);
  const logup = useCallback(() => {
    if (from === "/signup") {
      navigate("/MyPage", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  }, [navigate]);

  const logOut = () => {
    setAuth({});
    home();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setSearchView(false);
    }, 150);
  };
  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position='static'
          sx={{ background: "#def4f6" }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              maxHeight: "90px",
              minHeight: "90px",
            }}
          >
            <Link
              variant='body1'
              fontFamily='Roboto Slab'
              padding={2}
              paddingLeft={3}
              color='#3cd64b'
              onClick={home}
              underline='none'
              style={{
                cursor: "pointer",
              }}
            >
              <div>TOKYO</div>
              <div>TRADERS</div>
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Looking for something?'
                inputProps={{ "aria-label": "search" }}
                value={search}
                onChange={handleSearch}
                onClick={handleView}
                onBlur={handleBlur}
              />
            </Search>
            {searchView && (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "62px",
                  marginLeft: "-210px",
                  color: "black",
                  minWidth: "460px",
                  bgcolor: "background.paper",
                  zIndex: 9999,
                  borderRadius: "10px",
                }}
              >
                <List>
                  {searchSuccess ? (
                    <ListItem disablePadding>
                      <img
                        src='loading-green-loading.gif'
                        style={{
                          height: "30px",
                          width: "30px",
                          opacity: 0.2,
                          margin: "auto",
                        }}
                      />
                    </ListItem>
                  ) : (
                    <>
                      {!searchValue.length ? (
                        <ListItem disablePadding>
                          <ListItemButton onClick={() => setSearch("")}>
                            <ListItemText primary="Oop's we don't have that" />
                          </ListItemButton>
                        </ListItem>
                      ) : (
                        searchValue.map((item) => {
                          return (
                            <ListItem disablePadding>
                              <ListItemButton
                                onClick={() => {
                                  setSearch("");
                                  navigate(`/listing/${item.id}`);
                                }}
                              >
                                <ListItemText
                                  primary={item.item_id.item_name}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })
                      )}
                    </>
                  )}
                </List>
              </Box>
            )}
            {!user ? (
              <GreenButton
                variant='contained'
                onClick={login}
              >
                LOG IN
              </GreenButton>
            ) : (
              <div>
                <span
                  style={{
                    // color: "black",
                    fontFamily: "Roboto Slab",
                    color: "#332925",
                  }}
                >
                  {user.username}
                </span>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='#3CD64B'
                >
                  <AccountCircle sx={{ fontSize: "40px" }} />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    variant='contained'
                    onClick={myPage}
                  >
                    My Page
                  </MenuItem>
                  <MenuItem
                    variant='contained'
                    onClick={logOut}
                  >
                    Log Out
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}

export default NavBar;
