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
import { ContactlessOutlined } from '@mui/icons-material';

export default function MyPage() {

  const [itemList, setItemList] = useState([]);
  const [itemNames, setitemNames] = useState([])
  const [snapshots, setSnapshots] = useState('')

  const [itemInfo, setItemInfo] = useState([{
    "itemName": "",
    "itemImages": "",
    "itemID": ""
  }])


  const userid = 1;
  const itemid = 177;

  // const updateItem = (name, image) => {
  //   setItemInfo(prevItem => )
  // }

  // useEffect(() => {
  //   axios
  //     .get(`/api/item/${userid}`)
  //     .then((response) => {
  //       console.log(response.data)
  //       setItemList(response.data)
  //       // const idArr = [];
  //       console.log(itemList)
  //       for (let item of itemList) {
  //         console.log(item)
  //         axios.get(`/api/all-item/${userid}/${item.id}`)


  //           .then(item => {
  //             console.log(item.data[0].image)
  //             console.log(item.data[0].itemName)
  //             itemInfo.push({
  //               "itemName": item.data[0].itemName,
  //               "imageUrl": item.data[0].image
  //             })
  //           })
  //         itemNames.push(item.item_name);
  //       }
  //       console.log(itemInfo)
  //       // idArr.map(itemid => {

  //       // })
  //     })
  // }, [])

  // useEffect(() => {
  //   axios
  //     .get(`/api/item/${userid}`)
  //     .then(response => {
  //       setItemList(response.data)
  //     })
  //     .then(() => {
  //       for (let item of itemList) {
  //         itemNames.push(item.item_name)
  //       }
  //     })
  // }, [])

  useEffect(() => {
    axios.get(`/api/all-info/${userid}`)
      .then(response => {
        setItemInfo([...response.data])
      })
  }, [])
  console.log(itemInfo)
  // useEffect(() => {
  //   axios
  //     .get(`/api/item/${userid}`)
  //     .then((response) => {
  //       console.log(response.data)
  //     })
  // }, [])

  // useEffect(() => {
  //   axios.get(`/api/all-info/${userid}/${itemid}`)
  //     .then(res => {
  //       console.log(res.data)
  //       setItemInfo()
  //     })
  // }, [])

  // const getSnapshot = async function (itemId) {
  //   const data = await axios.get(`api/item-image/${itemId}`)
  //   setSnapshot(data)
  // }

  // useEffect(() => {
  //   axios
  //     .get(`/api/item/${userid}`)
  //     .then(response =>
  //       console.log(response.data)
  //     )
  // })
  console.log(itemList, itemNames)

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

      {itemInfo?.map(item => (
        <div key={item.id}>
          {/* {console.log(item)} */}
          {item.itemName}
          {/* <img src='../../backend/api/backend/media/2023/01/14/natural_leaf.jpg'></img> */}
          <img src={`http://127.0.0.1:8000/api${item.itemImages[0]}`} width="50px" />
        </div>
        // <Card elevation={6}>
        //   <CardMedia
        //     style={{ height: 350 }}
        //     // image={snapshots} // need to check
        //     title={item.itemName}

        //   />
        //   <CardContent >
        //     <Typography gutterBottom variant="h5">{item.item_name}</Typography>
        //     <Box display="flex" justify="space-between">
        //       <Typography variant="subtitle1">{item.description}</Typography>
        //       <Typography gutterBottom variant="subtitle1"></Typography>
        //     </Box>
        //   </CardContent>
        // </Card>
      ))}
    </>
  );
}