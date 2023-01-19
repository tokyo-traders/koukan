import React, { useState, useEffect } from 'react'
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
import { adaptV4Theme, CardActions, IconButton } from '@mui/material';
import Button from '@mui/material/Button';


import Icon from '@mui/material/Icon';
import AddItem from './AddItem';

import axios from "axios";
import { ContactlessOutlined } from '@mui/icons-material';

const BASE_URL = 'http://127.0.0.1:8000/api'

export default function MyPage() {
  const [user, setUser] = useState("")

  const [itemInfo, setItemInfo] = useState([{
    "itemName": "",
    "itemImages": "",
    "itemID": ""
  }])

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/api/user/login', {
          signal: controller.signal
        });
        console.log("MyPage", response.data.username)
        isMounted && setUser(response.data.username)
      } catch (err) {
        console.error("FUckYOU", err)
      }
    }

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, []);


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

          <Typography
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5"
          >
            {user}

          </Typography>
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <Stack direction="row" spacing={8} justifyContent="center">
              <Link href="/MyItems" variant="body1" underline="none" color="inherit">
                My Items
              </Link>

              <Link href="/PendingOffer" variant="body1" underline='none'>
                Pending Offer
              </Link>

              <Link href="/TradedItem" variant="body1" underline='none'>
                Traded Items
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box sx={{ width: '50%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
      </Box>
      <Grid
        direction="row"

        justifyContent="center"
        alignItems="center" md={4}
      // spacing={3}
      >
        {itemInfo?.map(item => (
          <div key={item.id}>
            <Card elevation={6} sx={{ maxWidth: 345, mt: 10, marginLeft: 4 }}>
              <CardMedia
                component="img"
                style={{ width: 350 }}
                image={BASE_URL + `${item.itemImages[0]}`}
                height="140"
              />
              <CardContent >
                <Typography gutterBottom variant="h5">{item.itemName}</Typography>
                <Box display="flex" justify="space-between">
                  <Typography gutterBottom variant="subtitle1"></Typography>
                </Box>
              </CardContent>
            </Card>
          </div>
        ))}
      </Grid>
      <Link href='/addItem'>
        <Button >
          <Icon sx={{ fontSize: 90, marginLeft: 15, marginTop: 3 }}>add_circle</Icon>
        </Button>
      </Link>
      {/* <IconButton variant='contained'>Add an Item</IconButton> */}
    </>
  );
}