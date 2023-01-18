import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import useAuth from "./hooks/useAuth";
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

export default function MyPage() {
  const [user, setUser] = useState("")
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();


  const [itemList, setItemList] = useState([]);
  const [itemNames, setitemNames] = useState([])
  const [snapshots, setSnapshots] = useState('')

  const [itemInfo, setItemInfo] = useState([{
    "itemName": "",
    "itemImages": "",
    "itemID": ""
  }])




  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/api/user/login', {
          signal : controller.signal
        });
        console.log("MyPage 🤑", response.data)
        isMounted && setUser(response.data)
      } catch (err) {
        console.error("FUckYOU", err)
      }
    }

    getUsers();

    return () =>{
      isMounted = false;
      controller.abort();
    }
  },[]);

  const userid = user.id;
  console.log(userid)

  useEffect(() => {
    if (user.id) {
      axios
      .get(`/api/item/${user.id}`)
      .then((response) => {
        console.log(response.data)
        setItemList(response.data)
        const idArr = [];
        for (let item of response.data) {
          idArr.push(item.id)
        }
        // console.log(idArr)
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
    }
  }, [user])



  const from = location.state?.from?.pathname || "/MyPage"
  const addItem = useCallback(()=> navigate('/addItem', {replace: true}), [navigate]);
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

          <Typography
            variant="h4"
            fontFamily="Roboto Slab"
            padding={2}
            color="#D904B5"
          >
            {user.username}

          </Typography>
          <Box
            sx={{
              marginTop: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <Stack direction="row" spacing={8} justifyContent="center">
              <Link onClick={addItem} variant="body1" underline="none" color="#000000">
                My Items
              </Link>

              <Link href="/PendingOffer" variant="body1" underline='none' >
                Pending Offer
              </Link>

              <Link href="/TradedItem" variant="body1" underline='none' >
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
        <Button onClick={addItem}>
          <Icon sx={{ fontSize: 90, marginLeft: 15, marginTop: 3 }}>add_circle</Icon>
        </Button>
      {/* <IconButton variant='contained'>Add an Item</IconButton> */}
    </>
  );
}