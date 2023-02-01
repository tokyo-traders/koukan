import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CardActionArea } from '@mui/material';


import Divider from '@mui/material/Divider';

import Container from '@mui/material/Container';
import { styled, } from '@mui/material/styles';

import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000/api'


const BrownButton = styled(Button)(() => ({
	backgroundColor: "#4d3e38",
	borderRadius: "8px",
	color: "#def4f6",
	"&:hover": {
		background: "#332925",
	},
	// padding: "15px 36px",
	fontSize: "16px",
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const REGISTER_URL = '/api/create-offer';

function OfferForm(props) {

  const { user } = props
  const { listingId } = useParams();

  const [listing, setListing] = useState(null);
  const [offer, setOffer] = useState(null);
  const [date, setDate] = useState('');

  const navigate = useNavigate();
  const location = useLocation();



  const from = location.state?.from?.pathname || "/MyPage"
  const myPage = useCallback(() => navigate('/MyPage', { replace: true }), [navigate]);



  const [itemInfo, setItemInfo] = useState([{
    "itemName": "",
    "itemImages": "",
    "itemID": ""
  }])

  useEffect(() => {
    if (user) {
      axios.get(`/api/all-info/${user.id}`)
        .then(response => {
          setItemInfo([...response.data])
        })
    }
    if (listingId) {
      axios.get(`/api/listing/${listingId}`)
        // .then(response => setItemData(response.data))
        .then(response => {
          setListing(response.data[0])
        })
    }
  }, [user])
// console.log(listing)
  // useEffect(() => {
  //   if (listingId) {
  //     axios.get(`/api/listing/${listingId}`)
  //       // .then(response => setItemData(response.data))
  //       .then(response => {
  //         setListing(response.data)
  //       })
  //   }
  // }, [listingId])

  console.log("LISTING", listing)
  console.log("ITEM INFO", itemInfo)
  const makeOffer = async () => {
    console.log(offer.itemID)
    console.log(listing.post.id)
    const offerObj = {
      post_id: listing.post.id,
      offered_item: offer.itemID,
      acceptance: false
    }
    console.log(offerObj)
    const response = await axios.post(
      REGISTER_URL,

      JSON.stringify(offerObj),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true

      });

    console.log(JSON.stringify(response.data))
    myPage();
  }

  return (
    <>
      <Typography
        marginTop={4} 
        variant="h4"
        fontFamily="Roboto Slab"
        padding={2}
        color="#4d3e38"
        align='center'
      >
        SELECT FROM YOUR ITEM
      </Typography>
      <Box 
        sx={{
          backgroundColor: 'none',
          width:'80%',
          display: "flex",
          margin: "auto",
          }}>
      <Grid
        container
        // width="80%"
        // direction="row"
        justifyContent="center"
        // lg={12}
        // spacing={2}
      >
        {user && itemInfo?.map(item => (
          <Card
            elevation={6}
            sx={{ maxWidth: 200, margin: 2}}
            onClick={() => {
              console.log(item)
              setOffer(item)
            }}
          >
            <CardMedia
              sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5',}}
              component="img"
              image={BASE_URL + `${item.itemImages[0]}`}
              height="150"
            />
            <CardContent>
              <Typography noWrap>{item?.itemName}</Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
      </Box>

      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 2 }} variant="middle" />
      </Box>

      <Box
       sx={{
        width: "80%",
        margin: "auto",
        marginTop: 2,
        display: "flex",
        flexDirection: "column"
       }}
      >

      <Grid container spacing={2} 
          sx={{
            flexGrow: 1,
            backgroundColor: "none",
            marginTop: 2,
            display: "flex",
            justifyContent:"center",
            alignItems:"center"
            }}>

        <Grid item xs={5} 
          sx={{
            flexGrow: 1,
            marginTop: 2,
            display: "flex",
            justifyContent:"center",
            alignItems:"center"
          }}
          >
           <Card
            elevation={6}
            sx={{ maxHeight: 340, margin: 2}}
           >
            <CardActionArea>
            <CardMedia
              sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5'}}
              component="img"
              image={listing && BASE_URL + `${listing.images[0]}`}
              height="150"
            />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                   {listing && listing.item.item_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 Owner : {listing && listing.username}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {listing && listing.item.details}
                </Typography> */}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={2}
            sx={{
            flexGrow: 1,
            marginTop: 2,
            display: "flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
            <BrownButton
            onClick={makeOffer}
          >Trade</BrownButton>
        </Grid>

        
        <Grid item xs={5}
              sx={{
            flexGrow: 1,
            marginTop: 2,
            display: "flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
            <Card
            elevation={6}
            sx={{ maxHeight: 340, margin: 2}}
           >
            <CardActionArea>
             <CardMedia
              sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5'}}
              component="img"
              image={offer && BASE_URL + `${offer?.itemImages[0]}`}
              height="150"
            />
              {/* <CardMedia
                component="img"
                height="220"
                width="220"
                sx={{objectFit:"contain" }}
                image={offer && BASE_URL + `${offer?.itemImages[0]}`}
                alt="please select your item"
              /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                   {offer && offer.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {offer && offer.username}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      </Box>






      {/* this is the listing item   */}
      <Container sx={{ display: "flex", }}>
        <Box sx={{ width: '30%', margin: 'auto', marginLeft: 15, marginTop: 2, display: 'flex', flexDirection: 'column', float: 'left' }}>
          <Grid container spacing={1} sx={{ backgroundColor: "none", marginTop: 2 }}>
            <Grid item xs={5} sx={{ margin: '10px' }}>
              <Container sx={{ height: 350, width: 350 }}>

                {/* {listing && <Img alt="image1" src={BASE_URL + `${listing.images[0]}`} />}
                {listing && <Typography variant='h3'>
                  {listing.item.item_name}
                </Typography>} */}
                
                {listing && <Img alt="image1" src={BASE_URL + `${listing.images[0]}`}/>}
                <Typography variant='h4'>
                  {listing && listing.item.item_name}
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Box>


        <Container sx={{ height: 350, width: 70, margin: "auto" }}>
          <BrownButton
            onClick={makeOffer}
          >Trade</BrownButton>
        </Container>

        {/* this is the trading item  */}
        <Box sx={{ width: '30%', margin: 'auto', marginLeft: 2, marginTop: 2, display: 'flex', flexDirection: 'column', float: 'right' }}>
          <Grid container spacing={1} sx={{ backgroundColor: "none", marginTop: 2 }}>
            <Grid item xs={5} sx={{ margin: '10px' }}>
              <Container sx={{ height: 350, width: 350 }}>
                {offer && <img alt="image1" width="100%" src={BASE_URL + `${offer?.itemImages[0]}`} />}
                {offer && <Typography variant='h3'>
                  {offer.itemName}
                </Typography>}
              </Container>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default OfferForm