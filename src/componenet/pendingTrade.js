import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import MyPage from './MyPage'
import Divider from '@mui/material/Divider';
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Rating from '@mui/material/Rating';


const BASE_URL = 'http://127.0.0.1:8000/api'
const homepage = '/api/homepage'


function PendingTrade(props) {

  const { user } = props

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/MyPage"
  const myPage = useCallback(() => navigate('/MyPage', { replace: true }), [navigate]);

  const [tradingItems, setTradingItems] = useState([]);
  const [offeredItems, setOfferedItems] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const [value, setValue] = useState(3);

  useEffect(() => {
    axios.get(`/api/acceptedTrade/${user.id}`)
      .then(response => {
        console.log(response.data)
        tradingItems.push(...response.data)
      })
  }, [])

  useEffect(() => {
    axios
      .get(`/api/offered-items/${user.id}`)
      .then(res => {
        setTradingItems(...res.data)
      })
  }, [])

  console.log(tradingItems)
  const completeTrade = (obj) => {
    console.log(obj)
    axios.put(`/api/itemHandover`,
      JSON.stringify(obj),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    )
      .then(response => {
        console.log(response.data)
      }).then(() => myPage())
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Grid
      container
      width="100%"
      direction="row"
      justifyContent="center"
      alignItems="center"
      xl={12}
      spacing={3}
    >
      {tradingItems && tradingItems?.map(item => (
        <Card elevation={6}
          sx={{ maxWidth: 610, mt: 10, marginLeft: 4, display: "flex" }}>
          <Card
            elevation={6}
            sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
          //   onClick={() => {
          //     if (item) {
          //       navigate(`/MyPage/Items/${item.itemID}`, {replace: true})
          //     }
          //   }}
          >
            <CardMedia
              component="img"
              style={{ Width: 300 }}
              image={BASE_URL + `${item.image[0].image}`}
              height="140"
            />
            <CardContent >
              <Box display="flex" justify="space-between">
                <Typography gutterBottom variant="body">{item.post_item.item_name}</Typography>
              </Box>
            </CardContent>
          </Card>
          <Card
            elevation={6}
            sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
          //   onClick={() => {
          //     if (item) {
          //       navigate(`/MyPage/Items/${item.itemID}`, {replace: true})
          //     }
          //   }}
          >
            <CardMedia
              component="img"
              style={{ Width: 300 }}
              image={BASE_URL + `${item.offers.image[0].image}`}
              height="140"
            />
            <CardContent >
              <Box display="flex" justify="space-between">
                <Typography gutterBottom variant="body">{item.offers.item.item_name}</Typography>
              </Box>
            </CardContent>
          </Card>
          <Button
            color='secondary'
            variant='contained'
            height="50"
            alignItems="flex-end"
            onClick={() => completeTrade(item.offers.offer)}
          >I have Recieved my Item</Button>
          <Modal

            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-description"
          >
            <Box
              sx={styleModal}
            >
              <Typography id="modal-modal-description" variant="h6" component="h2">
                {/* Please giver a score to {item.otherUserInfo ? item.otherUserInfo : off} ? */}
                Please give ;eave a score
              </Typography>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />

            </Box>
          </Modal>
        </Card>
      ))}
    </Grid>
  )
}

export default PendingTrade