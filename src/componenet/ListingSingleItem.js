import React, { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import axios from "./hooks/axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import { Carousel } from "react-responsive-carousel";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
import Rating from "@mui/material/Rating";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/axiosPrivate";
import { WindowSharp } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#cee9ee",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  p: 3,
  textAlign: "center",
};

const Img = styled("img")({
  margin: "auto",
  display: "block",
  height: "150px",
  padding: 2,
});

const PreviewImg = styled("img")({
  margin: "auto",
  display: "block",
  height: "100px",
  // padding: 2
});

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "10px",
  color: "#def4f6",
  width: "80%",
  "&:hover": {
    background: "#332925",
  },
  fontSize: "16px",
}));

const SmallButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "6px",
  color: "#def4f6",
  width: "80%",
  "&:hover": {
    background: "#332925",
  },
  fontSize: "12px",
  padding: "8px",
}));

export default function ListingSingleItem(props) {
  const { categories } = props;
  const { auth } = useAuth();
  const user = auth?.user;
  const axiosPrivate = useAxiosPrivate();

  const { listingId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage";

  const makeOffer = useCallback(
    () => navigate(`/listing/${listingId}/offer`),
    [navigate]
  );
  const login = useCallback(
    () => navigate(`/login`, { replace: true }),
    [navigate]
  );
  const goBack = useCallback(() => {
    navigate(from);
  }, [navigate]);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [listing, setListing] = useState(null);
  const [date, setDate] = useState("");
  const [offersMade, setOffersMade] = useState(null);
  const [offersItems, setOffersItems] = useState(null);
  const [images, setImages] = useState([]);
  const [postCat, setPostCat] = useState([]);

  const [open, setOpen] = useState(null);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const display = () => {
    if (listing) {
      makeOffer();
    }
  };

  const acceptOffer = async (obj) => {
    obj.acceptance = true;
    const response = await axiosPrivate.put(
      `/api/SetPending`,
      JSON.stringify(obj),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  const deletePost = () => {
    if (window.confirm("are you sure?")) {
      axios
        .delete(`/api/edit-post/${listing.id}`)
        .then(() => navigate("/MyPage/"));
    }
  };

  const deleteOffer = (offerId) => {
    if (window.confirm("Are you sure you want to DELETE This this offer")) {
      axios.delete(`/api/edit-offer/${offerId}`);
    }
    setTimeout(() => navigate("/MyPage/"), 300);
  };

  const hidAcceptedPost = async () => {
    const response = axios.put(
      `/api/edit-post/${listing.id}`,
      { visibile: false },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };

  useEffect(() => {
    if (listingId) {
      axios.get(`/api/listing/${listingId}`).then((response) => {
        setListing(response.data);
      });
    }
  }, [listingId]);

  useEffect(() => {
    const getOffers = async () => {
      let response = await axios.get(`/api/create-offer`);
      setOffersMade(response.data.filter((item) => item.post_id == listingId));
    };
    getOffers();
  }, []);

  useEffect(() => {
    const getItem = async () => {
      let responseArray = offersMade.map((offer) => {
        return axios.get(`/api/all-item/${offer.offered_item}`);
      });

      Promise.all(responseArray)
        .then((res) => {
          return res.map((item) => {
            return item.data[0];
          });
        })
        .then((res) => {
          const items = res.map((item) => {
            return { ...item, model: false };
          });
          console.log(items);
          return items;
        })
        .then((res) => setOffersItems(res));

      return responseArray;
    };

    if (offersMade) {
      getItem();
    }
  }, [offersMade]);

  return (
    <div>
      <Box
        sx={{
          width: "70%",
          margin: "auto",
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ backgroundColor: "none", marginTop: 2 }}
        >
          <Grid
            item
            xs={6}
            sx={{ margin: "10px" }}
          >
            <Container>
              {listing && (
                <Carousel
                  // showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}
                  showArrows={true}
                  showThumbs={true}
                  thumbWidth={100}
                  sx={{
                    margin: "auto",
                  }}
                  autoPlay={false}
                >
                  {listing?.images.map((img, i) => (
                    <div
                      style={{
                        backgroundColor: "#f0f0f0",
                        opacity: 0.8,
                        maxHeight: 320,
                        minHeight: 320,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{
                          margin: "auto",
                          maxHeight: 320,
                          objectFit: "contain",
                          margin: "2px",
                        }}
                        alt='image1'
                        key={i}
                        src={`${listing.images[i].image}`}
                      />
                    </div>
                  ))}
                </Carousel>
              )}
            </Container>
          </Grid>
          <Grid
            item
            xs={5}
            sm
            container
          >
            <Grid
              item
              xs
              container
              direction='column'
              spacing={10}
            >
              <Grid
                item
                xs
              >
                <Box
                  sx={{
                    backgroundColor: "none",
                    paddingBottom: 2,
                    borderBottom: 1,
                    borderColor: "grey.500",
                  }}
                >
                  {listing && (
                    <div margin='20px'>
                      <Typography variant='h5'>
                        {listing.item_id.item_name}
                      </Typography>
                    </div>
                  )}
                  {user ? (
                    <>
                      {user?.id === listing?.item_id.user_id ? (
                        <BrownButton
                          variant='contained'
                          sx={{ mt: 3, mb: 2 }}
                          onClick={deletePost}
                        >
                          DELETE LISTING
                        </BrownButton>
                      ) : (
                        <>
                          {listing && (
                            <>
                              <BrownButton
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={display}
                              >
                                MAKE OFFER
                              </BrownButton>
                              <div>
                                <Tooltip title='Send poster a message on whatspp'>
                                  <IconButton>
                                    <a
                                      href={`https://wa.me/${listing?.user_id.phoneDetail}`}
                                    >
                                      <WhatsAppIcon
                                        sx={{
                                          fontSize: "30px",
                                          color: "#4d3e38",
                                        }}
                                      />
                                    </a>
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title='Send an email to poster'>
                                  <IconButton>
                                    <a href={`mailto:${listing.user_id.email}`}>
                                      <EmailIcon
                                        sx={{
                                          fontSize: "30px",
                                          color: "#4d3e38",
                                        }}
                                      />{" "}
                                    </a>
                                  </IconButton>
                                </Tooltip>

                                {offersItems && (
                                  <Tooltip title='Offer received'>
                                    <Badge badgeContent={offersItems.length}>
                                      <a>
                                        <LocalOfferIcon
                                          sx={{
                                            fontSize: "30px",
                                            color: "#4d3e38",
                                            marginLeft: "0.5rem",
                                          }}
                                        />{" "}
                                      </a>
                                    </Badge>
                                  </Tooltip>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <BrownButton
                      variant='contained'
                      sx={{ mt: 3, mb: 2 }}
                      onClick={login}
                    >
                      Log In To Bid
                    </BrownButton>
                  )}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 4,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='div'
                    fontWeight={700}
                  >
                    Description
                  </Typography>
                  {listing && (
                    <Typography
                      gutterBottom
                      variant='body'
                    >
                      {listing.item_id.details}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='div'
                    fontWeight={700}
                  >
                    Accepted Catagories
                  </Typography>
                  <br />
                  <Grid
                    container
                    width='130%'
                    direction='row'
                    justifyContent='start'
                    marginLeft='0px'
                    gap={1.5}
                    xs={12}
                    xl={12}
                    spacing={3}
                    columnSpacing={3}
                  >
                    {listing &&
                      categories &&
                      listing?.categories?.map((category, index) => (
                        <Chip
                          label={
                            categories[category.categories_id - 1]
                              ?.category_name
                          }
                        />
                      ))}
                  </Grid>
                  <br />
                  <Typography
                    variant='h6'
                    component='div'
                    fontWeight={700}
                  >
                    Wishlist
                  </Typography>

                  {listing && (
                    <Typography
                      gutterBottom
                      variant='body'
                    >
                      {listing.desire}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='div'
                    fontWeight={700}
                  >
                    Post Expired By
                  </Typography>
                  {listing && (
                    <Typography
                      gutterBottom
                      variant='body'
                    >
                      {new Date(listing.expiration).toDateString()}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    backgroundColor: "none",
                    marginTop: 2,
                    boarder: 4,
                    borderColor: "grey.500",
                  }}
                >
                  <Typography
                    variant='h6'
                    component='div'
                    fontWeight={700}
                  >
                    Owner
                  </Typography>

                  {listing && (
                    <Typography>
                      <Typography
                        variant='h6'
                        component='legend'
                      >
                        {" "}
                        {listing.username}
                      </Typography>
                      <Rating
                        name='size-small'
                        readOnly
                        value={
                          listing.rating !== 0
                            ? (
                                Math.round(listing.rating * 10) /
                                10 /
                                listing.total_review
                              ).toFixed(1)
                            : 0
                        }
                      />
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* ____________________________________________________________________________________________________________________________       */}

        <Divider
          sx={{
            borderBottomWidth: 1,
            marginLeft: "10%",
            marginRight: "10%",
            marginTop: 5,
          }}
        />
        <Typography
          marginTop={2}
          variant='h6'
          fontFamily='Roboto Slab'
          color='#4d3e38'
          align='center'
        >
          OFFERS
        </Typography>
      </Box>

      {offersItems &&
        offersItems.map((items, index) => {
          return (
            <>
              <Box
                sx={{
                  width: "60%",
                  minWidth: "450px",
                  maxHeight: "250px",
                  margin: "auto",
                  marginTop: 2,
                  paddingBottom: 3,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  backgroundColor: "#cee9ee",
                  borderRadius: "5px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{ backgroundColor: "none", marginTop: 2 }}
                >
                  <Grid
                    item
                    xs={4}
                  >
                    <PreviewImg
                      alt='image1'
                      src={items.images[0].image}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={5}
                  >
                    <Typography variant='h6'>{items?.itemName}</Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      display='inline'
                    >
                      user: {items?.userName}
                    </Typography>
                    <div>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        display='inline'
                      >
                        offer on:{" "}
                        {items && new Date(items.expiration).toLocaleString()}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid
                    xs={3}
                    display='flex'
                  >
                    <SmallButton
                      style={{ alignSelf: "center" }}
                      onClick={() => {
                        offersItems[index].model = true;
                        setOffersItems([...offersItems]);
                      }}
                      sx={{
                        marginTop: "10%",
                        marginBottom: 2,
                        "&:hover": {
                          backgroundColor: "gray",
                          opacity: [0.9, 0.8, 0.7],
                        },
                      }}
                    >
                      details
                    </SmallButton>
                  </Grid>
                </Grid>
              </Box>

              <Modal
                open={items?.model}
                onClose={() => {
                  offersItems[index].model = false;
                  setOffersItems([...offersItems]);
                }}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style}>
                  <Typography
                    id='modal-modal-title'
                    variant='h5'
                    component='h2'
                  >
                    Offer: {items?.itemName}
                  </Typography>

                  <Typography
                    gutterBottom
                    id='modal-modal-description'
                    sx={{ mt: 2 }}
                  >
                    Details: {items?.details}
                  </Typography>
                  <div
                    style={{
                      height: "250px",
                      width: "250px",
                      background: "#f0f0f0",
                      margin: "auto",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <Img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      alt='image1'
                      src={items.images[0].image}
                    />
                  </div>

                  {user && user?.id === listing.item_id.user_id && (
                    <BrownButton
                      variant='contained'
                      sx={{ mt: 2 }}
                      onClick={() => {
                        acceptOffer(offersMade[index]);
                        hidAcceptedPost();
                        setTimeout(() => navigate("/MyPage/PendingTrade"), 200);
                      }}
                    >
                      ACCEPT OFFER
                    </BrownButton>
                  )}
                  {user && user?.id === items.user_id && (
                    <BrownButton
                      variant='contained'
                      sx={{ mt: 2 }}
                      onClick={() => {
                        deleteOffer(items.idOffer);
                      }}
                    >
                      DELETE OFFER
                    </BrownButton>
                  )}
                </Box>
              </Modal>
            </>
          );
        })}
      <div style={{ minHeight: "100px" }}></div>
    </div>
  );
}
