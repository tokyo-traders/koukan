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

export default function ListingSingleItem() {

    const {listingId} = useParams();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/MyPage"
    const makeOffer = useCallback(()=> navigate(`/listing/${listingId}/offer`, {replace: true}), [navigate]);
    const login = useCallback(()=> navigate(`/login`, {replace: true}), [navigate]);
    const goBack = useCallback(()=> {
        navigate(from, {replace: true})
      }, [navigate]);

  const [listing, setListing] = useState(null);
  const [date, setDate] = useState('');

  const display = () => {
    if (listing) {
        makeOffer();
    }
 }

  useEffect(() => {
    if (listingId) {
        axios.get(`/api/listing/${listingId}`)
        // .then(response => setItemData(response.data))
        .then(response => {
            console.log("😂", response.data)
            setListing(response.data)
        })
    }
  }, [])


  return (
    <div >
      <Box  sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          {listing?.images.length > 1 && <Grid item xs={2} spacing={3}>
            {listing.images.filter((x,index) => !!index).map((img)=>{
                return(
                    <Box sx={{ marginBottom: 2 }}>
                      <Img alt="image2" src={BASE_URL + `${img}`}/>
                    </Box>
                )})
            }
          </Grid>}
          <Grid item xs={5} sx={{ margin: '10px'}}>
            <Container sx={{ height: 350 }}>
              <Box>
                <Button><NavigateBeforeIcon /></Button>
              </Box>
              {listing && <Img alt="image1" src={BASE_URL + `${listing.images[0]}`} />}
              <Button><NavigateNextIcon /></Button>
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

                  <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>

                  <RoundedButton
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={display}
                  >
                    MAKE AN OFFER
                  </RoundedButton>
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

    </div>
  );
}