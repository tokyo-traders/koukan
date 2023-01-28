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
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

const BrownButton = styled(Button)(() => ({
    backgroundColor: "#4d3e38",
    borderRadius: "8px",
    color: "#def4f6",
    "&:hover": {
      background: "#332925"
    },
    // padding: "15px 36px",
    fontSize: "16px"
}));

const BASE_URL = 'http://127.0.0.1:8000/api'

export default function UserSingleItem(props) {

  const { itemId } = useParams();
  const { user } = props

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage"
  const makeListing = useCallback(() => navigate(`/MyPage/makeListing/${itemId}`, { replace: true }), [navigate]);
  const goBack = useCallback(() => {
    navigate(from, { replace: true })
  }, [navigate]);

  const [itemData, setItemData] = useState({itemName: '', image: [], details: '', user_id: 0});
  const [images, setImages] = useState([])

  const display = () => {
    if (user && itemId) {
      makeListing();
    }
  }

  const deleteItem = (itemId) => {
    axios.delete(`/api/item/${user.username}/${itemId}`)
      .then(res => console.log(res))
  }


  useEffect(() => {
    (async () => {
			const rawData = await fetch(`/api/all-item/${itemId}`, {
				method: "GET",
			});
			const data = await rawData.json();
			console.log(data)
			// const list = [];
			// data.map((category) => list.push(category)); //console.log(category)
			// setCategoriesArray(data);
			// console.log("heyheyhey", categoriesArray);
		})();
    // // if (itemId) {
    //   axios.get(`/api/all-item/${itemId}`)
    //     // .then(response => setItemData(response.data))
    //     .then(response => {
    //       // console.log("😂", response.data)
    //       // console.log(user, itemId)
    //       setItemData(response.data[0])
    //       console.log("heyheyhey", itemData)
    //       setImages(response.data[0].image)
    //       console.log("this is the image", images)
    //     })
    // // }
    
  }, [])

  return (
    <>

      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={5} sx={{ margin: '10px' }}>
            <Container sx={{ height: 350 }}>
              {images &&
                <Carousel
                  autoPlay={true}
                  infiniteLoop={true}>
                  {/* {images.map((img, i) => (
                    <div>
                      <img alt="image1" src={BASE_URL + `${itemData.images[i]}`} />
                    </div>
                  ))} */}
                </Carousel>}
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
                  {itemData && <Typography variant='h5'>
                    {itemData?.itemName}
                  </Typography>}

                  <Box sx={{ marginLeft: 50 }}><ModeEditIcon /></Box>

                  <BrownButton
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={display}
                  >
                    MAKE POST
                  </BrownButton>
                  <BrownButton
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => deleteItem(Number(itemId))}
                  >
                    DELETE ITEM
                  </BrownButton>
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
                  {itemData && <Typography gutterBottom variant='body'>
                    {itemData?.details}
                  </Typography>}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                  }}
                >
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

    </>
  );
}