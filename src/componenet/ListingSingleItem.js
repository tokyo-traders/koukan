import React, { useState, useEffect, useCallback } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from "axios";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import Carousel from 'react-material-ui-carousel'
import EmailIcon from '@mui/icons-material/Email';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Badge from '@mui/material/Badge';


const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '50%',
  maxHeight: '50%',
});

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "8px",
  color: "#def4f6",
  width: '100%',
  "&:hover": {
    background: "#332925"
  },
  // padding: "15px 36px",
  fontSize: "16px"
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
    obj.acceptance = true
    const response = await axios.put(
      `/api/SetPending`,
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
      console.log(response.data.filter(item => item.post_id == listingId))
      setOffersMade(response.data.filter(item => item.post_id == listingId))


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

  // const Mailto = () => {
  //   return (
  //     <a href={`mailto:${listing.email}`}> <EmailIcon sx={{ fontSize: "35px" }} /> </a>
  //   );
  // };

  const captionStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
  }
  const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  }

  // console.log(listing)
  const data = async () => {
    const arr = []
    for (let i of listing.images) {
      let img = { image: listing.images[i], caption: `pic N. ${i}` }
      await img.json()
      arr.push(img)
    }
    return arr
  }
  return (
    <div >
      <Box sx={{ width: '50%', marginLeft: '30%', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={6} sx={{ margin: '10px' }}>
            <Container sx={{ height: 300 }}>
              {images &&
                <Carousel
                  autoPlay={false}
                  infiniteLoop={true}>
                  {listing?.images.map((img, i) => (
                    <div>
                      <img alt="image1" src={BASE_URL + `${listing.images[i]}`} width="200px" height="auto" />
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
                    backgroundColor: "none",
                    paddingBottom:2,
                    borderBottom: 1,
                    borderColor: 'grey.500'
                  }}
                
                >
                  {listing &&
                    <div margin='20px'>
                      <Typography variant='h4'>
                        {listing.item.item_name}
                      </Typography>
                    
                    </div>
                  }



                  {user?.id !== listing?.item.user_id &&
                    <>
                      {/* <Box sx={{ marginLeft: 50 }}>
                        <ModeEditIcon /></Box> */}
                      <BrownButton
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={display}
                      >
                        MAKE AN OFFER
                      </BrownButton>

                      <div>
                      <Tooltip title="Send poster a message on whatspp">
                      <IconButton >
                        <a href={`https://wa.me/${listing?.phoneDetail}`}>
                          <WhatsAppIcon sx={{ fontSize: "30px", color:'#4d3e38' }}/>
                        </a>
                      </IconButton>
                      </Tooltip>

                      
                      {listing &&  
                      <Tooltip title="Send an email to poster">
                      <IconButton>
                      <a href={`mailto:${listing.email}`}>
                        <EmailIcon sx={{ fontSize: "30px", color:'#4d3e38' }}/> </a> 
                      </IconButton>
                      </Tooltip>
                      }

                      {offersItems &&  
                      <Tooltip title="Offer received">
                      <Badge badgeContent={offersItems.length}>
                      <a >
                        <LocalOfferIcon sx={{ fontSize: "30px", color:'#4d3e38' , marginLeft:"0.5rem" }}/> </a> 
                      </Badge>
                      </Tooltip>
                      }
                      </div>
                    </>}
                
                </Box>
                {/* <Box
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
                </Box> */}
                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 4,
                  }}
                >
                  <Typography variant='h6' component='div'>
                    Description
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {listing.item.details}
                  </Typography>}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                  }}
                >
                  <Typography variant='h6' component='div'>
                    Wishlist
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {listing.post.desire}
                  </Typography>}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                  }}
                >
                  <Typography variant='h6' component='div'>
                    Post Expired By
                  </Typography>
                  {listing && <Typography gutterBottom variant='body'>
                    {new Date(listing.post.expiration).toDateString()}
                  </Typography>}
                </Box>

                
                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                    boarder: 4,
                    borderColor: 'grey.500'
                  }}
                >
                  <Typography variant='h6' component='div'>
                    Poster
                  </Typography>
                  {listing &&
                    <Typography variant='h7'>
                          {listing.username}
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
                            <BrownButton

                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => {
                                acceptOffer(offersMade[index])
                              }}
                            >
                              ACCEPT OFFER
                            </BrownButton>
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