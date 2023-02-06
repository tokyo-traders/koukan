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
  const [tradesDisplayed, setTradesDisplayed] = useState(false)
  const [offeredItems, setOfferedItems] = useState([]);
  const [offerDisplayed, setOfferDisplayed] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [value, setValue] = useState(3);

  useEffect(() => {
    axios.get(`/api/acceptedTrade/${user.id}`)
      .then(response => {
        console.log(response.data)
        // !tradesDisplayed && tradingItems.push(...response.data)
        setTradingItems(response.data)
        // console.log(tradesDisplayed)
        setTradesDisplayed(true)
      })
      .catch(() => console.log("no listings"))
      .then(() => console.log(tradingItems)
      )
    // .then(() => setTradingItems([]))
  }, [])

  useEffect(() => {
    // axios.get(`/api/singleOffer/${offerId}`)
    axios
      .get(`/api/offered-items/${user.id}`)
      .then(res => {
        console.log(res.data)
        // !offerDisplayed && offeredItems.push(...res.data)
        setOfferedItems(res.data)
        // setOfferDisplayed(true)
      })
      .catch(() => console.log("no offers"))
      .then(() => console.log(offeredItems))
    // .then(() => setTradingItems([]))
  }, [])

  // useEffect(() => {
  //   const offerItemData = axios.get(`/api/offered-items/${user.id}`);
  //   // const desiredItemData = axios.get(`/api/singleOffer/${offerId}`)
  //   Promise.all([
  //     offerItemData,
  //     desiredItemData
  //   ])
  //     .then(res => {
  //       console.log(res.data)
  //       !offerDisplayed && offeredItems.push(...res.data)
  //       setOfferDisplayed(true)
  //     })
  //     .catch(() => console.log("no offers"))
  //     .then(() => console.log(tradingItems))
  //   // .then(() => setTradingItems([]))
  // }, [])

  // useEffect(() => {
  //   axios.get(`/api/singleOffer/${offerId}`)
  //     .then((response) =>
  //       setOffer(response.data)
  //     )

  // }, [])
  const completeTrade = (itemId) => {
    // const completeTrade = (userIdReview) => {
    const data = { user_id: user.id }
    // console.log(itemId)
    console.log(itemId)
    // axios.put(`/api/itemHandover/${userIdReview}`,
    // axios.put(`/api/itemHandover/${itemId}`,
    //   JSON.stringify(data),
    //   {
    //     headers: { "Content-Type": "application/json" },
    //     withCredentials: true,
    //   }
    // )
    // .then(response => {
    //   console.log(response.data)
    // })
    // .then(() => myPage())
  }

  const postCompleteTrade = async (offer) => {
    // const data = { user_id: user.id }
    console.log(offer)
    if (!offer.offer_confirmation) {
      offer.post_confirmation = true
      const response = await axios.put(
        `/api/SetPending`,
        JSON.stringify(offer),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      console.log(response.data)
    } else {
      axios.put(`/api/itemHandover`,
        JSON.stringify(offer),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
        .then(response => {
          console.log(response.data)
        })
        .then(() => myPage())
    }
  }
  const offerCompleteTrade = async (offer) => {
    // const data = { user_id: user.id }
    console.log(offer)
    if (!offer.post_confirmation) {
      offer.post_confirmation = true
      const response = await axios.put(
        `/api/SetPending`,
        JSON.stringify(offer),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      console.log(response.data)
    } else {
      axios.put(`/api/itemHandover`,
        JSON.stringify(offer),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
        .then(response => {
          console.log(response.data)
        })
        .then(() => myPage())
    }

  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    // console.log(userIdReview.desideredUserId)

  }

  const sendReviewScore = (userIdReview) => {
    const data = {
      reputation_rating: value
    }
    console.log(userIdReview)
    axios.put(`/api/send-review/${userIdReview}`,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    )
      .then(res => console.log(res))
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
    <>
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
            //       navigate(`/ MyPage / Items / ${ item.itemID }`, {replace: true})
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
            <Card
              elevation={6}
              sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
            >
              <CardMedia
                component="img"
                style={{ Width: 300 }}
                image={BASE_URL + `${item.image[0].image}`}
                height="140"
              />
              <CardContent >
                <Box display="flex" justify="space-between">
                  <Typography gutterBottom variant="body">{item?.post_item?.item_name}</Typography>
                </Box>
              </CardContent>
            </Card>
            {item?.offer?.offer_confirmation ? <Typography gutterBottom variant="body">My item has arrived</Typography> : <Button
              color='secondary'
              variant='contained'
              height="50"
              alignItems="flex-end"
              onClick={() => { postCompleteTrade(item.offers.offer); handleOpenModal() }}
            // onClick={() => { completeTrade(item.offers.item.id); handleOpenModal() }}
            // onClick={() => { completeTrade(item.offers.item.user_id); handleOpenModal() }}

            >I have Received my Item</Button>}
            <Modal
              open={openModal}
              onClose={() => { sendReviewScore(item.offers.item.user_id); handleCloseModal(); }}
              aria-labelledby="modal-modal-description"
            >
              <Box
                sx={styleModal}
              >
                <Typography id="modal-modal-description" variant="h6" component="h2">
                  {/* Please giver a score to {item.otherUserInfo ? item.otherUserInfo : off} ? */}
                  Please leave a score
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
      <Grid
        container
        width="100%"
        // direction="column"
        justifyContent="center"
        alignItems="center"
        xl={12}
        spacing={3}
      >
        {offeredItems && offeredItems?.map(item => (

          <Box elevation={6} justifyContent="center"
            sx={{ maxWidth: 610, mt: 10, marginLeft: 4, display: "flex", flexDirection: "row" }}>

            <Card
              elevation={6}
              sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
            >
              <Typography component="div" sx={{ fontSize: 12 }}>
                you will receive
              </Typography>
              <CardMedia
                component="img"
                style={{ Width: 300 }}
                image={BASE_URL + `${item.desiredItemImage}`}
                height="140"
              />
              <CardContent >
                <Box display="flex" justify="space-between">
                  <Typography gutterBottom variant="body">{item.desiredItemName}</Typography>
                </Box>
              </CardContent>
            </Card>
            <Card
              elevation={6}
              sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
            >
              <Typography component="div" sx={{ fontSize: 12 }}>
                you will send
              </Typography>
              <CardMedia
                component="img"
                style={{ Width: 300 }}
                image={BASE_URL + `${item.image}`}
                height="140"
              />
              <CardContent >
                <Box display="flex" justify="space-between">
                  <Typography gutterBottom variant="body">{item.itemName}</Typography>
                </Box>
              </CardContent>
            </Card>

            {item.offer.offer_confirmation ? <Typography gutterBottom variant="body">My item has arrived</Typography> : <Button
              color='secondary'
              variant='contained'
              alignItems="flex-end"
              onClick={() => { offerCompleteTrade(item.offer); handleOpenModal() }}
            >I have received my Item</Button>}
            <Modal
              open={openModal}
              onClose={() => { sendReviewScore(item.desideredUserId); handleCloseModal(); }}
              aria-labelledby="modal-modal-description"
            >
              <Box
                sx={styleModal}
              >
                <Typography id="modal-modal-description" variant="h6" component="h2">
                  {/* Please giver a score to {item.otherUserInfo ? item.otherUserInfo : off} ? */}
                  Please leave a score
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
          </Box>
        ))}
      </Grid>
    </>
  )
}

export default PendingTrade
