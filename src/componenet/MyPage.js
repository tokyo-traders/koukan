import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/system';
import useAxiosPrivate from "./hooks/axiosPrivate"
import { setUseProxies } from 'immer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActions, IconButton } from '@mui/material';
import Button from '@mui/material/Button';



import Icon from '@mui/material/Icon';
import AddItem from './AddItem';

import axios from "axios";
import { ContactlessOutlined } from '@mui/icons-material';

const BASE_URL = 'http://127.0.0.1:8000/api'


export default function MyPage(props) {
  const {user} = props

  const navigate = useNavigate();
  const location = useLocation();


  const from = location.state?.from?.pathname || "/MyPage"
  const itemList = useCallback(()=> navigate("/MyPage", {replace: true}), [navigate]);
  const myPage = useCallback(()=> {
    if (from === "/signup") {
      navigate('/MyPage', {replace: true})
    } else {
      navigate(from, {replace: true})
    }
    }, [navigate]);


  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          {/* get logged in user name and display */}

         {user &&
          <Typography
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5"
          >
            {user.username}

          </Typography>}
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <Stack direction="row" spacing={8} justifyContent="center">
              <Link onClick={itemList} variant="body1" underline="none" color="#000000">
                My Items
              </Link>

              <Link onClick={itemList} variant="body1" underline='none' >
              </Link>

              <Link onClick={itemList} variant="body1" underline='none' >
                Traded Items
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
      </Box>
     <Outlet />
    </>
  );
}