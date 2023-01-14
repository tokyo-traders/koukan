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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { adaptV4Theme, CardActions } from '@mui/material';
import Button from '@mui/material/Button';

import axios from "axios";




export default function MyPage() {

  const [itemList, setItemList] = useState([]);
  const [snapshots, setSnapshots] = useState([])

  const userid = 1;

  useEffect(() => {
    axios
      .get(`/api/item/${userid}`)
      .then((response) => {
        setItemList(response.data)
        const idArr = [];
        for (let item of response.data) {
          idArr.push(item.id)
        }
        console.log(idArr)
        idArr.map(id => {
          axios.get(`api/item-image/${id}`)
            .then(image => {
              console.log(image)
              // setSnapshots(...image[0], snapshots)
            })
        })
      })
      .then((response) => {

      })
  }, [])

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
            USER NAME
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

      {itemList?.map(item => (
        <Card elevation={6}>
          <CardMedia
            style={{ height: 350 }}
            image={item.image} // need to check
            title={item.item_name}

          />
          <CardContent >
            <Typography gutterBottom variant="h5">{item.item_name}</Typography>
            <Box display="flex" justify="space-between">
              <Typography variant="subtitle1">{item.description}</Typography>
              <Typography gutterBottom variant="subtitle1"></Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
}