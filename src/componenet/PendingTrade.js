import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useAxiosPrivate from "./hooks/axiosPrivate";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MyPage from "./MyPage";
import Divider from "@mui/material/Divider";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import useAuth from "./hooks/useAuth";

const BASE_URL = "http://127.0.0.1:8000/api";
const homepage = "/api/homepage";

function PendingTrade() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/MyPage";
  const myPage = useCallback(
    () => navigate("/MyPage", { replace: true }),
    [navigate]
  );

  const [tradingItems, setTradingItems] = useState([]);
  const [tradesDisplayed, setTradesDisplayed] = useState(false);
  const [offeredItems, setOfferedItems] = useState([]);
  const [offerDisplayed, setOfferDisplayed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(3);

  useEffect(() => {
    axiosPrivate
      .get(`/api/acceptedTrade/${user.id}`)
      .then((response) => {
        console.log("TRADE", response.data);
        // !tradesDisplayed && tradingItems.push(...response.data)
        setTradingItems(response.data);
        // console.log(tradesDisplayed)
        setTradesDisplayed(true);
      })
      .catch(() => console.log("no listings"))
      .then(() => console.log(tradingItems));
    // .then(() => setTradingItems([]))
  }, []);

  useEffect(() => {
    // axios.get(`/api/singleOffer/${offerId}`)
    axiosPrivate
      .get(`/api/offered-items/${user.id}`)
      .then((res) => {
        console.log("OFFER", res.data);
        // !offerDisplayed && offeredItems.push(...res.data)
        setOfferedItems(res.data);
        // setOfferDisplayed(true)
      })
      .catch(() => console.log("no offers"))
      .then(() => console.log(offeredItems));
    // .then(() => setTradingItems([]))
  }, []);

  const postCompleteTrade = async (offer) => {
    console.log("offer", offer);
    if (!offer.post_confirmation && !offer.offer_confirmation) {
      offer.post_confirmation = true;
      const response = await axiosPrivate.put(
        `/api/SetPending`,
        JSON.stringify(offer),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // handleOpenModal()
      console.log(response.data);
    } else if (offer.post_confirmation || offer.offer_confirmation) {
      console.log("handover!!!");

      axiosPrivate
        .put(`/api/itemHandover`, JSON.stringify(offer), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .then(() => handleOpenModal())
        .then(() => myPage());
    }
  };

  const offerCompleteTrade = async (offer) => {
    console.log("offer", offer);
    if (!offer.offer_confirmation && !offer.post_confirmation) {
      offer.offer_confirmation = true;
      const response = await axiosPrivate.put(
        `/api/SetPending`,
        JSON.stringify(offer),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // handleOpenModal()
      console.log(response.data);
    } else if (offer.post_confirmation || offer.offer_confirmation) {
      console.log("handover!!!");
      axiosPrivate
        .put(`/api/itemHandover`, JSON.stringify(offer), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        // .then(() => handleOpenModal())
        .then(() => myPage());
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const sendReviewScore = (userIdReview) => {
    const data = {
      reputation_rating: value,
    };
    console.log(userIdReview);
    // axios.put(`/api/send-review/${userIdReview}`,
    axiosPrivate
      .put(`/api/sendUserReview/${userIdReview}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => console.log(res));
  };

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Grid
        container
        width='100%'
        direction='row'
        justifyContent='center'
        alignItems='center'
        xl={12}
        spacing={3}
      >
        {tradingItems &&
          tradingItems?.map((item) => (
            <>
              <Box
                elevation={6}
                justifyContent='center'
                sx={{
                  maxWidth: 610,
                  mt: 4,
                  mb: 4,
                  marginLeft: 4,
                  marginRight: 4,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <Card
                  elevation={6}
                  sx={{
                    maxWidth: 300,
                    mt: 10,
                    marginLeft: 4,
                    background: "#66BBFE30",
                  }}
                >
                  <CardContent>
                    <Typography
                      component='div'
                      sx={{ fontSize: 11, textAlign: "center" }}
                    >
                      Incoming article
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component='img'
                    style={{ Width: 300 }}
                    image={item.offers.image[0].image}
                    height='140'
                  />
                  <CardContent>
                    <Box
                      display='flex'
                      justify='space-between'
                    >
                      <Typography
                        gutterBottom
                        variant='body'
                      >
                        {item.offers.item.item_name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                <Card
                  elevation={6}
                  sx={{
                    maxWidth: 300,
                    mt: 10,
                    marginLeft: 4,
                    background: "#C7C7C770",
                  }}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      component='div'
                      sx={{ fontSize: 11, textAlign: "center" }}
                    >
                      Outgoing article
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component='img'
                    style={{ Width: 300 }}
                    image={item.image[0].image}
                    height='140'
                  />
                  <CardContent>
                    <Box
                      display='flex'
                      justify='space-between'
                    >
                      <Typography
                        gutterBottom
                        variant='body'
                      >
                        {item?.post_item?.item_name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                {item?.offers?.offer.offer_confirmation ? (
                  <Box
                    elevation={6}
                    sx={{
                      color: "#E65E00",
                      background: "#F9924B50",
                      display: "flex",
                      justifyContent: "center",
                      height: "auto",
                      boxShadow: 3,
                      maxWidth: 200,
                      mt: 10,
                      marginLeft: 4,
                      borderRadius: "200",
                      alignItems: "center",
                      // alignContent: "center",
                      // justifyItems: "right"
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant='body'
                    >
                      My item has arrived
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    elevation={6}
                    sx={{
                      color: "#3AAD00",
                      background: "#83D85B70",
                      boxShadow: 3,
                      height: "auto",
                      maxWidth: 200,
                      mt: 10,
                      marginLeft: 4,
                      borderRadius: "200",
                    }}
                    // onClick={() => { postCompleteTrade(item.offers.offer); handleOpenModal() }}
                    onClick={() => {
                      handleOpenModal();
                    }}
                    // onClick={() => { completeTrade(item.offers.item.id); handleOpenModal() }}
                    // onClick={() => { completeTrade(item.offers.item.user_id); handleOpenModal() }}
                  >
                    <Typography>I have received my Item</Typography>
                  </Button>
                )}
                <Modal
                  open={openModal}
                  onClose={() => {
                    sendReviewScore(item.offers.item.user_id);
                    handleCloseModal();
                    offerCompleteTrade(item.offers.offer);
                  }}
                  aria-labelledby='modal-modal-description'
                >
                  <Box sx={styleModal}>
                    <Typography
                      id='modal-modal-description'
                      variant='h6'
                      component='h2'
                    >
                      {/* Please giver a score to {item.otherUserInfo ? item.otherUserInfo : off} ? */}
                      Please leave a score
                    </Typography>
                    <Rating
                      name='simple-controlled'
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </Box>
                </Modal>
              </Box>

              <Box
                sx={{
                  width: "70%",
                  margin: "auto",
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Divider
                  sx={{ borderBottomWidth: 3 }}
                  variant='middle'
                />
              </Box>
            </>
          ))}
      </Grid>

      <Grid
        container
        width='100%'
        // direction="column"
        justifyContent='center'
        alignItems='center'
        xl={12}
        spacing={3}
      >
        {offeredItems &&
          offeredItems?.map((item) => (
            <>
              <Box
                elevation={6}
                justifyContent='center'
                sx={{
                  maxWidth: 610,
                  mt: 4,
                  mb: 4,
                  marginLeft: 4,
                  marginRight: 4,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <Card
                  elevation={6}
                  sx={{
                    maxWidth: 300,
                    mt: 10,
                    marginLeft: 4,
                    background: "#66BBFE30",
                  }}
                >
                  <CardContent>
                    <Typography
                      component='div'
                      sx={{ fontSize: 11, textAlign: "center" }}
                    >
                      Incoming article
                    </Typography>
                  </CardContent>

                  <CardMedia
                    component='img'
                    style={{ Width: 300 }}
                    image={item.desiredItemImage}
                    height='140'
                  />
                  <CardContent>
                    <Box
                      display='flex'
                      justify='space-between'
                    >
                      <Typography
                        gutterBottom
                        variant='body'
                      >
                        {item.desiredItemName}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                <Card
                  elevation={6}
                  sx={{
                    maxWidth: 300,
                    mt: 10,
                    marginLeft: 4,
                    background: "#C7C7C770",
                  }}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      component='div'
                      sx={{ fontSize: 11, textAlign: "center" }}
                    >
                      Outgoing article
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component='img'
                    style={{ Width: 300 }}
                    image={item.image}
                    height='140'
                  />
                  <CardContent>
                    <Box
                      display='flex'
                      justify='space-between'
                    >
                      <Typography
                        gutterBottom
                        variant='body'
                      >
                        {item.itemName}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {item.offer.post_confirmation ? (
                  <Box
                    elevation={6}
                    sx={{
                      color: "#E65E00",
                      background: "#F9924B50",
                      display: "flex",
                      justifyContent: "center",
                      height: "auto",
                      boxShadow: 3,
                      maxWidth: 200,
                      mt: 10,
                      marginLeft: 4,
                      borderRadius: "200",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant='body'
                    >
                      My item has arrived
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    elevation={6}
                    sx={{
                      color: "#3AAD00",
                      background: "#83D85B70",
                      boxShadow: 3,
                      height: "auto",
                      maxWidth: 200,
                      mt: 10,
                      marginLeft: 4,
                      borderRadius: "200",
                    }}
                    // onClick={() => { offerCompleteTrade(item.offer); handleOpenModal() }}
                    onClick={() => {
                      handleOpenModal();
                    }}
                  >
                    <Typography>I have received my Item</Typography>
                  </Button>
                )}
                <Modal
                  open={openModal}
                  onClose={() => {
                    sendReviewScore(item.desideredUserId);
                    handleCloseModal();
                    postCompleteTrade(item.offer);
                  }}
                  aria-labelledby='modal-modal-description'
                >
                  <Box sx={styleModal}>
                    <Typography
                      id='modal-modal-description'
                      variant='h6'
                      component='h2'
                    >
                      {/* Please giver a score to {item.otherUserInfo ? item.otherUserInfo : off} ? */}
                      Please leave a score
                    </Typography>
                    <Rating
                      name='simple-controlled'
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </Box>
                </Modal>
              </Box>

              <Box
                sx={{
                  width: "70%",
                  margin: "auto",
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Divider
                  sx={{ borderBottomWidth: 3 }}
                  variant='middle'
                />
              </Box>
            </>
          ))}
      </Grid>
    </>
  );
}

export default PendingTrade;
