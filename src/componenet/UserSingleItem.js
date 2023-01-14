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
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import axios from "axios";

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const RoundedButton = styled(Button)(() => ({
    borderRadius: 35,
    backgroundColor: "#D904B5",
    color: "#46C8F5",
    fontSize: "1rem",
    display: "block"

}));

export default function UserSingleItem() {

  const [itemList, setItemList] = useState([]);
  const [snapshots, setSnapshots] = useState([])

  const userid = 0;

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
            //   console.log(image)
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
              <Typography href="/MyItems" variant="body1" underline="none" color="inherit">
                My Items
              </Typography>

              <Typography href="/PendingOffer" variant="body1" underline='none'>
                Pending Offer
              </Typography>

              <Typography href="/TradedItem" variant="body1" underline='none'>
                Traded Items
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>
      <Box sx={{ width: '60%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
      </Box>


      <Box sx={{ width: '60%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} sx={{backgroundColor:"none", marginTop: 2}}>
                <Grid  item xs={2} spacing={3}>
                    <Box sx={{marginBottom: 2}}>
                        <Img alt="image2" src="https://m.media-amazon.com/images/I/51l3-TEATkL._AC_.jpg" />
                    </Box>
                    <Box sx={{marginBottom: 2}}>
                        <Img alt="image3" src="https://m.media-amazon.com/images/I/61fD7B8KaUL._AC_SL1056_.jpg" />
                    </Box>
                    <Box  sx={{marginBottom: 2}}>
                        <Img alt="image4" src="https://m.media-amazon.com/images/I/31q3v4ynTaL._AC_.jpg" />
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{margin: '10px'}}>
                    <Container  sx={{height: 350 }}>
                        <Img alt="image1" src="https://m.media-amazon.com/images/I/71vHeoTBtiL._AC_SL1500_.jpg" />
                    </Container>
                </Grid>
                <Grid item xs={5} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Box
                            sx={{
                                backgroundColor: "white",
                                marginTop: 2,
                            }}
                            >
                                <Typography variant='h5'>
                                     {itemList[1].item_name}
                                </Typography>

                                <Box sx={{marginLeft: 50}}><ModeEditIcon/></Box>

                                 <RoundedButton
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    >
                                   MAKE POST
                                    </RoundedButton>
                            </Box>

                            <Box
                            sx={{
                                backgroundColor: "white",
                                marginTop: 4,
                               
                            }}
                            >
                                <Typography gutterBottom variant='h5' component='div'>
                                    Description
                                </Typography>
                                <Typography gutterBottom variant='body'>
                                    {itemList[1].details}
                                </Typography>
                            </Box>

                            <Box
                            sx={{
                                backgroundColor: "white",
                                marginTop: 4,
                            }}
                            >
                                <Typography gutterBottom variant='h5' component='div'>
                                    Desire Item
                                </Typography>
                                <Typography gutterBottom variant='body'>
                                    {itemList[1].desire}
                                </Typography>
                            </Box>
                            
                            <Box
                            sx={{
                                backgroundColor: "white",
                                marginTop: 4,
                            }}
                            >
                                <Typography gutterBottom variant='h5' component='div'>
                                    Expired By
                                </Typography>
                                <Typography gutterBottom variant='body'>
                                    {itemList[1].offer_period}
                                </Typography>
                            </Box>
                        
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
      </Box>
 
    </>
  );
}