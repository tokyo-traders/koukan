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
import EmailIcon from '@mui/icons-material/Email';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Badge from '@mui/material/Badge';
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from '@mui/icons-material/Star'; import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


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


  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


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

  const deletePost = () => {
    axios
      .delete(`/api/edit-post/${listing.post.id}`)
      .then((res) => console.log(res));
  };

  const hidAcceptedPost = async (obj) => {
    obj.visibile = false;
    const response = axios
      .put(`/api/edit-post/${listing.post.id}`,
        JSON.stringify(obj),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
    console.log(response.data)
  };

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
          // console.log(response.data[0].images)
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
      {/* <Box sx={{ width: '50%', marginLeft: '30%', marginTop: 2, display: 'flex', flexDirection: 'column' }}> */}
      <Box sx={{ width: '70%', margin: 'auto', marginTop: 10, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={6} sx={{ margin: '10px' }}>
            <Container>
              {images &&
                <Carousel
                  // showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}
                  showArrows={true}
                  showThumbs={true}
                  thumbWidth={100}
                  sx={{ objectFit: "contain", bgcolor: '#f5f5f5' }}
                  autoPlay={false}
                >
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
                    backgroundColor: "none",
                    paddingBottom: 2,
                    borderBottom: 1,
                    borderColor: 'grey.500'
                  }}

                >
                  {listing &&
                    <div margin='20px'>
                      <Typography variant='h5'>
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
                              <WhatsAppIcon sx={{ fontSize: "30px", color: '#4d3e38' }} />
                            </a>
                          </IconButton>
                        </Tooltip>


                        {listing &&
                          <Tooltip title="Send an email to poster">
                            <IconButton>
                              <a href={`mailto:${listing.email}`}>
                                <EmailIcon sx={{ fontSize: "30px", color: '#4d3e38' }} /> </a>
                            </IconButton>
                          </Tooltip>
                        }

                        {offersItems &&
                          <Tooltip title="Offer received">
                            <Badge badgeContent={offersItems.length}>
                              <a >
                                <LocalOfferIcon sx={{ fontSize: "30px", color: '#4d3e38', marginLeft: "0.5rem" }} /> </a>
                            </Badge>
                          </Tooltip>
                        }
                      </div>
                    </>}

                </Box>

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
                {user?.id === listing?.item.user_id &&
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => deletePost()}
                  >
                    Delete
                  </Button>
                }
                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                    boarder: 4,
                    borderColor: 'grey.500'
                  }}
                >
                  <Typography variant='h6' component='div'>
                    Owner
                  </Typography>
                  {listing &&
                    <Typography variant='h7'>
                      {listing.username} ({listing.rating}) <StarIcon sx={{ fontSize: "30px", color: '#4d3e38' }} />
                    </Typography>}
                </Box>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* ____________________________________________________________________________________________________________________________       */}
      {/* <Box sx={{ width: '35%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column'}}>
          {offersItems && offersItems.map((items, index) => {
            return (
              <>
                <div>
                    <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        {items?.itemName}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                 
                      <Typography>
                         {items.details}

                      {user?.id === listing?.item.user_id &&   
                      <BrownButton
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                        acceptOffer(offersMade[index])
                        }}
                      >
                              ACCEPT OFFER
                      </BrownButton>}
                      </Typography>
                  
                    </AccordionDetails>
                  </Accordion>
                </div>
          </>
            )
          })}
        </Box>
        </div>
      );} */}


      {/* ____________________________________________________________________________________________________________________________       */}


      {offersItems && offersItems.map((items, index) => {
        return (
          <>
            <Box sx={{ width: '70%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
              <Divider sx={{ borderBottomWidth: 1 }} variant="middle" />
            </Box>

            <Box sx={{ width: '70%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
              <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
                <Grid item xs={5} sx={{ margin: '10px' }}>
                  <Container sx={{ height: 350 }}>
                    {items && <Img alt="image1" src={BASE_URL + `${items?.images[0]}`} />}
                  </Container>
                </Grid>
                <Grid item xs={5} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Box
                        sx={{
                          backgroundColor: "white",
                        }}

                      >
                        <Typography variant='h5'>
                          {items?.itemName}
                        </Typography>

                        {user?.id === listing?.item.user_id &&
                          <>
                            <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>
                            <BrownButton

                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => {
                                acceptOffer(offersMade[index]);
                                hidAcceptedPost(listing.post)
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
                          {new Date(items.expiration).toDateString()}
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