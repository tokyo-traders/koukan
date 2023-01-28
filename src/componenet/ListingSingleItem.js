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
// import Carousel from 'react-material-ui-carousel'
import EmailIcon from '@mui/icons-material/Email';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ImageGallery from 'react-image-gallery';



import "./LisitingSingleItem.css"
import { CollectionsBookmarkOutlined } from '@mui/icons-material';

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
  const [images, setImages] = useState([])

  const display = () => {
    if (listing) {
      makeOffer();
    }
  }


  const acceptOffer = async (obj) => {
    const response = await axios.put(
      `/api/itemHandover`,
      JSON.stringify(obj),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )
    console.log(response.data)
  }


  useEffect(() => {
    if (listingId) {
      axios.get(`/api/listing/${listingId}`)
        .then(response => {
          console.log(response.data)
          setListing(response.data[0])
        })
    }
  }, [])

  useEffect(() => {
    if (listingId) {
      axios.get(`/api/listing/${listingId}`)
        .then(response => {
          console.log(response.data[0].images)
          images.concat(response.data[0].images)
        })
    }
  }, [])

  useEffect(() => {

    const getOffers = async () => {
      let response = await axios.get(`/api/create-offer`)
      // console.log(response.data.filter(item => item.post_id == listingId)[0])
      setOffersMade(response.data.filter(item => item.post_id == listingId)[0])


    }
    getOffers()

  }, [])

  useEffect(() => {

    const getItem = async () => {
      let responseArray = offersMade.map((offer) => {
        return axios.get(`/api/all-item/${offer.offered_item}`)
      })

      Promise.all(responseArray).then((res) => {
        console.log(res)
        return res.map((item) => {
          return item.data[0]
        })
      })
        .then((res) => setOffersItems(res))

      return responseArray
    }

    if (offersMade) {
      getItem()
    }
  }, [offersMade])

  const Mailto = () => {
    return (
      <a href={`mailto:${listing.email}`}> <EmailIcon sx={{ fontSize: "35px" }} /> </a>
    );
  };

  const captionStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
  }
  const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  }

  // console.log(listing)
  // console.log(typeof listing.phoneDetail)
  // const phoneNumber = listing?.phoneDetail.splice(0, 2, '')
  // console.log(phoneNumber)
  return (
    <div >
      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={5} sx={{ margin: '10px' }}>
            <Container sx={{ height: 350 }}>
              {images &&
                <Carousel
                  autoPlay={true}
                  infiniteLoop={true}>
                  {listing?.images.map((img, i) => (
                    <div>
                      <img alt="image1" src={BASE_URL + `${listing.images[i]}`} />
                    </div>
                  ))}
                </Carousel>}


              <Button onClick={() => {
                console.log(offersItems)
              }
              }></Button>
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
                        onClick={display}
                      >
                        MAKE AN OFFER
                      </RoundedButton>
                      <Typography >
                        <a
                          href={`https://wa.me/${listing.phoneDetail}`}
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
      {offersItems && offersItems.map((items, index) => {
        return (
          <>
            <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
              <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
            </Box>

            <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
              <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
                <Grid item xs={5} sx={{ margin: '10px' }}>
                  <Container sx={{ height: 350 }}>
                    {listing && <Img alt="image1" src={BASE_URL + `${items?.image[0]}`} />}
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
                          {items?.itemName}
                        </Typography>

                        {user?.id === listing?.item.user_id &&
                          <>
                            <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>
                            <RoundedButton
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => {
                                acceptOffer(offersMade[index])
                              }}
                            >
                              ACCEPT OFFER
                            </RoundedButton>
                          </>
                        }
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
                          {items.details}
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
                          {new Date(items.date_offered).toDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        )
      })}
    </div>
  );

}