import React, { useState, useEffect, useCallback } from 'react'
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
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "axios";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import AlternateEmailSharpIcon from '@mui/icons-material/AlternateEmailSharp';
import LocalPostOfficeSharpIcon from '@mui/icons-material/LocalPostOfficeSharp';
import EmailIcon from '@mui/icons-material/Email';

import "./LisitingSingleItem.css"

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
  display: "block",
  width: "250px"
}));

const BASE_URL = 'http://127.0.0.1:8000/api'

export default function ListingSingleItem(props) {

  const { user } = props

  const { listingId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage"
  const makeOffer = useCallback(() => navigate(`/listing/${listingId}/offer`, { replace: true }), [navigate]);
  const login = useCallback(() => navigate(`/login`, { replace: true }), [navigate]);
  const goBack = useCallback(() => {
    navigate(from, { replace: true })
  }, [navigate]);

  const [listing, setListing] = useState(null);
  const [date, setDate] = useState('');
  const [offersMade, setOffersMade] = useState(null);
  const [offersItems, setOffersItems] = useState(null);

  const display = () => {
    if (listing) {
      makeOffer();
    }
  }

  const acceptOffer = () => {
    if (listing) {
      makeOffer();
    }
  }

  useEffect(() => {
    if (listingId) {
      axios.get(`/api/listing/${listingId}`)
        .then(response => {
          setListing(response.data)
        })
    }
  }, [])


  useEffect(() => {

    const getOffers = async () => {
      let response = await axios.get(`/api/create-offer`)
      console.log(response.data.filter(item => item.post_id == listingId)[0])
      setOffersMade(response.data.filter(item => item.post_id == listingId)[0])

    }
    getOffers()

  }, [])

  useEffect(() => {
    const getItem = async () => {
      let response = await axios.get(`/api/all-item/${offersMade.offered_item}`)
      setOffersItems(response.data[0])
    }
    if (offersMade) {
      getItem();
    }
  }, [offersMade])

  const Mailto = () => {
    return (

      <a href={`mailto:flavioripa@hotmail.com`}> <EmailIcon sx={{ fontSize: "35px" }} /> </a>
    );
  };

  return (
    <div >
      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          {listing?.images.length > 1 && <Grid item xs={2} spacing={3}>
            {listing.images.filter((x, index) => !!index).map((img) => {
              return (
                <Box sx={{ marginBottom: 2 }}>
                  <Img alt="image2" src={BASE_URL + `${img}`} />
                </Box>
              )
            })
            }
          </Grid>}
          <Grid item xs={5} sx={{ margin: '10px' }}>
            <Container sx={{ height: 350 }}>
              <Box>
                <Button><NavigateBeforeIcon /></Button>
              </Box>
              {listing && <Img alt="image1" src={BASE_URL + `${listing.images[0]}`} />}
              <Button onClick={() => {
                console.log(offersItems)
              }
              }><NavigateNextIcon /></Button>
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
                  {listing && <Typography variant='h3'>
                    {listing.item.item_name}
                  </Typography>}

                  {user?.id !== listing?.item.user_id &&
                    <>
                      <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>
                      <RoundedButton
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={acceptOffer}
                      >
                        MAKE AN OFFER
                      </RoundedButton>
                      <Typography >
                        <a
                          href="https://wa.me/8107039783864"
                          class="whatsapp_float"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i class="fa fa-whatsapp whatsapp-icon"></i>
                        </a>
                      </Typography>
                      <Typography color="secondary" variant="h4">
                        <Mailto > </Mailto>
                      </Typography>

                    </>}
                </Box>
                <Box
                  sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                  }}
                >
                  <Typography gutterBottom variant='h4' component='div'>
                    {listing?.post.price ? "Free to a Good Home" : "Looking to Trade"}
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {listing.post.desire}
                  </Typography>}
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
                  {listing && <Typography gutterBottom variant='body'>
                    {listing.item.details}
                  </Typography>}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                  }}
                >
                  <Typography gutterBottom variant='h5' component='div'>
                    Desired Item
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {listing.post.desire}
                  </Typography>}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                  }}
                >
                  <Typography gutterBottom variant='h5' component='div'>
                    Trade By
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {new Date(listing.post.expiration).toDateString()}
                  </Typography>}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* ____________________________________________________________________________________________________________________________       */}
      {
        offersItems &&
        <>
          <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
            <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
          </Box>


          <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
              <Grid item xs={5} sx={{ margin: '10px' }}>
                <Container sx={{ height: 350 }}>
                  {listing && <Img alt="image1" src={BASE_URL + `${offersItems.image[0]}`} />}
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
                      <Typography variant='h3'>
                        {offersItems.itemName}
                      </Typography>

                      {user?.id === listing?.item.user_id &&
                        <>
                          <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>
                          <RoundedButton
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={display}
                          >
                            ACCEPT OFFER
                          </RoundedButton>
                        </>}
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
                        {offersItems.details}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "white",
                        marginTop: 4,
                      }}
                    >
                      <Typography gutterBottom variant='h5' component='div'>
                        Date Of Offer
                      </Typography>
                      <Typography gutterBottom variant='body'>
                        {new Date(offersMade.date_offered).toDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      }
    </div >
  );
}