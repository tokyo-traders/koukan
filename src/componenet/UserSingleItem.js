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

  const [itemData, setItemData] = useState(null);

  const display = () => {
    if (user && itemId) {
      makeListing();
    }
  }

  const deleteItem = (itemId) => {
    console.log(typeof itemId)
    console.log(typeof user.username)
    axios.delete(`/api/item/${user.username}/${itemId}`)
      .then(res => console.log(res))
  }


  useEffect(() => {
    if (itemId) {
      axios.get(`/api/all-item/${itemId}`)
        // .then(response => setItemData(response.data))
        .then(response => {
          console.log("😂", response.data)
          console.log(user, itemId)
          setItemData(response?.data[0])
        })
    }
  }, [])


  return (
    <>
      <Box sx={{ width: '80%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ backgroundColor: "none", marginTop: 2 }}>
          <Grid item xs={2} spacing={3}>
            <Box sx={{ marginBottom: 2 }}>
              {
                itemData?.image[1] &&
                <Img alt="image2" src={BASE_URL + `${itemData?.image[1]}`} />
              }
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              {
                itemData?.image[2] &&
                <Img alt="image3" src={BASE_URL + `${itemData?.image[2]}`} />
              }
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              {
                itemData?.image[3] &&
                <Img alt="image4" src={BASE_URL + `${itemData?.image[3]}`} />
              }
            </Box>
          </Grid>
          <Grid item xs={5} sx={{ margin: '10px' }}>
            <Container sx={{ height: 350 }}>
              <Box>
                <Button><NavigateBeforeIcon /></Button>
              </Box>
              {itemData && <Img alt="image1" src={BASE_URL + `${itemData?.image[0]}`} />}
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
                  <Typography gutterBottom variant='h5' component='div'>
                    Desire Item
                  </Typography>
                  {itemData && <Typography gutterBottom variant='body'>
                    {itemData?.desire}
                  </Typography>}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

    </>
  );
}