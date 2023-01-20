import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import  Divider  from '@mui/material/Divider';

import Container from '@mui/material/Container';
import { styled, } from '@mui/material/styles';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { height } from '@mui/system';

const BASE_URL = 'http://127.0.0.1:8000/api'

const RoundedButton = styled(Button)(() => ({
  borderRadius: 50,
  backgroundColor: "#D904B5",
  color: "#46C8F5",
  fontSize: "1rem",
  height: "70px",
  width: "70px",
  margin: "auto",
  padding: "0px"
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const REGISTER_URL = '/api/create-offer';

function OfferForm(props) {

    const {user} = props
    const {listingId} = useParams();

    const [listing, setListing] = useState(null);
    const [offer, setOffer] = useState(null);
    const [date, setDate] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    
  

    const from = location.state?.from?.pathname || "/MyPage"
    const myPage = useCallback(()=> navigate('/MyPage', {replace: true}), [navigate]);
  

   
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
      }, [user])

      useEffect(() => {
        if (listingId) {
            axios.get(`/api/listing/${listingId}`)
            // .then(response => setItemData(response.data))
            .then(response => {
                setListing(response.data)
            })
        }
      }, [])


    const makeOffer = async () => {
      console.log(offer.itemID)
      console.log(listing.post.id)
      console.log(false)
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
    console.log(JSON.stringify(response.data) )
    myPage();
    }

    return (
      <>
      <Typography gutterBottom variant='h3' component='div'>
                  Would you like to make an Offer?
      </Typography>
      <Grid
        container
        width="80$"
        direction="row"
        justifyContent="center"
        alignItems="center" 
        lg={12}
        spacing={3}
      >
        {user && itemInfo?.map(item => (
            <Card 
              elevation={6} 
              sx={{ maxWidth: 250, mt: 10, marginLeft: 4 }}
              onClick={() => {
                console.log(item)
                setOffer(item)
              }}
              >
              <CardMedia
                component="img"
                style={{ Width: 250 }}
                image={BASE_URL + `${item.itemImages[0]}`}
                height="140"
              />
              <CardContent >
                <Typography gutterBottom variant="body">{item.itemName}</Typography>
                <Box display="flex" justify="space-between">
                  <Typography gutterBottom variant="subtitle1"></Typography>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Grid>

      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Divider sx={{ borderBottomWidth: 3 }} variant="middle" />
      </Box>


            {/* this is the listing item   */}
      <Container sx={{display: "flex", }}>    
      <Box  sx={{ width: '30%', margin: 'auto', marginLeft: 15, marginTop: 2, display: 'flex', flexDirection: 'column', float:'left'}}>
        <Grid container spacing={1} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={5} sx={{ margin: '10px'}}>
          <Container sx={{ height: 350, width:350  }}>
              {listing && <Img alt="image1" src={BASE_URL + `${listing.images[0]}`} />}
              {listing && <Typography variant='h3'>
                    {listing.item.item_name}
                  </Typography>}
            </Container>
          </Grid>
        </Grid>
      </Box>


      <Container sx={{ height: 350, width:70, margin: "auto"}}>
        <RoundedButton 
        onClick={makeOffer}
        >Trade</RoundedButton>
      </Container>

                    {/* this is the trading item  */}
      <Box  sx={{ width: '30%', margin: 'auto', marginLeft: 2, marginTop: 2, display: 'flex', flexDirection: 'column', float:'right' }}>
        <Grid container spacing={1} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={5} sx={{ margin: '10px'}}>
            <Container sx={{ height: 350, width:350  }}>
              {offer && <img alt="image1" width="100%" src={BASE_URL + `${offer.itemImages[0]}`} />}
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