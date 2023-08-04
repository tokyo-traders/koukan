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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0.5px solid #000",
  p: 3,
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

  const { listingId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage";

  const makeOffer = useCallback(
    () => navigate(`/listing/${listingId}/offer`, { replace: true }),
    [navigate]
  );
  const login = useCallback(
    () => navigate(`/login`, { replace: true }),
    [navigate]
  );
  const goBack = useCallback(() => {
    navigate(from, { replace: true });
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
    const response = await axios.put(`/api/SetPending`, JSON.stringify(obj), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(response.data);
  };

  const deletePost = () => {
    axios
      .delete(`/api/edit-post/${listing.post.id}`)
      .then(() => navigate("/MyPage/"))
      .then((res) => console.log(res));
  };

  const deleteOffer = (offerId) => {
    axios.delete(`/api/edit-offer/${offerId}`).then((res) => console.log(res));
  };

  const hidAcceptedPost = async (obj) => {
    obj.visibile = false;
    const response = axios.put(
      `/api/edit-post/${listing.post.id}`,
      JSON.stringify(obj),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    console.log(response.data);
  };

  useEffect(() => {
    if (listingId) {
      axios.get(`/api/listing/${listingId}`).then((response) => {
        console.log(response.data);
        setListing(response.data);
      });
    }
  }, []);

  // useEffect(() => {
  //   const getOffers = async () => {
  //     let response = await axios.get(`/api/create-offer`);
  //     console.log(response.data.filter((item) => item.post_id === listingId));
  //     setOffersMade(response.data.filter((item) => item.post_id === listingId));
  //   };
  //   getOffers();
  // }, []);

  // this is for offers please uncomment
  // useEffect(() => {
  //   const getItem = async () => {
  //     let responseArray = offersMade.map((offer) => {
  //       return axios.get(`/api/all-item/${offer.offered_item}`);
  //     });

  //     Promise.all(responseArray)
  //       .then((res) => {
  //         console.log(res);
  //         return res.map((item) => {
  //           console.log(item.data);
  //           return item.data[0];
  //         });
  //       })
  //       .then((res) => {
  //         const items = res.map((item) => {
  //           return { ...item, model: false };
  //         });
  //         console.log(items);
  //         return items;
  //       })
  //       .then((res) => setOffersItems(res));

  //     return responseArray;
  //   };

  //   if (offersMade) {
  //     getItem();
  //   }
  // }, [offersMade]);

  // console.log(listing)
  // const data = async () => {
  //   const arr = []
  //   for (let i of listing.images) {
  //     let img = { image: listing.images[i], caption: `pic N. ${i}` }
  //     await img.json()
  //     arr.push(img)
  //   }
  //   return arr
  // }
  return (
    <div>
      {/* <Box sx={{ width: '50%', marginLeft: '30%', marginTop: 2, display: 'flex', flexDirection: 'column' }}> */}
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
                      //{" "}
                    </div>
                  ))}
                </Carousel>
              )}
              <Button
                onClick={() => {
                  console.log(offersItems);
                }}
              ></Button>
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

                      {user?.id === listing?.user_id.id && (
                        <BrownButton
                          variant='contained'
                          sx={{ mt: 3, mb: 2 }}
                          onClick={deletePost}
                        >
                          DELETE LISTING
                        </BrownButton>
                      )}
                    </div>
                  )}
                  {user?.id !== listing?.user_id.id && (
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
                                sx={{ fontSize: "30px", color: "#4d3e38" }}
                              />
                            </a>
                          </IconButton>
                        </Tooltip>

                        {listing && (
                          <Tooltip title='Send an email to poster'>
                            <IconButton>
                              <a href={`mailto:${listing.user_id.email}`}>
                                <EmailIcon
                                  sx={{ fontSize: "30px", color: "#4d3e38" }}
                                />{" "}
                              </a>
                            </IconButton>
                          </Tooltip>
                        )}

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
                    width='100%'
                    direction='row'
                    justifyContent='space-around'
                    alignItems='center'
                    xs={12}
                    xl={4}
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

      {/* ____________________________________________________________________________________________________________________________       */}

      {offersItems &&
        offersItems.map((items, index) => {
          // console.log("this is" , items)
          return (
            <>
              <Box
                sx={{
                  width: "50%",
                  maxHeight: "250px",
                  margin: "auto",
                  marginTop: 2,
                  paddingBottom: 3,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
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
                    {listing && (
                      <PreviewImg
                        alt='image1'
                        src={listing.images[0]}
                      />
                    )}
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
                    item
                    xs={3}
                  >
                    <SmallButton
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
                      Check detail
                    </SmallButton>

                    {user?.id === listing?.item.user_id && (
                      <SmallButton
                        onClick={() => {
                          deleteOffer(items.idOffer);
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "gray",
                            opacity: [0.9, 0.8, 0.7],
                          },
                        }}
                      >
                        DELETE OFFER
                      </SmallButton>
                    )}
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
                    variant='h6'
                    component='h2'
                  >
                    {items?.itemName}
                  </Typography>

                  <Typography
                    gutterBottom
                    id='modal-modal-description'
                    sx={{ mt: 2 }}
                  >
                    {items?.details}
                  </Typography>

                  <Img
                    alt='image1'
                    src={listing.images[0]}
                  />

                  {user?.id === listing?.item.user_id && (
                    <>
                      <BrownButton
                        variant='contained'
                        sx={{ mt: 2, marginLeft: 3 }}
                        onClick={() => {
                          acceptOffer(offersMade[index]);
                          hidAcceptedPost(listing.post);
                          navigate("/MyPage/PendingTrade");
                        }}
                      >
                        ACCEPT OFFER
                      </BrownButton>
                      {/* <Button
										onClick={() => {
											deleteOffer(items.idOffer);
										}}
									>
										DELETE OFFER
									</Button> */}
                    </>
                  )}
                </Box>
              </Modal>
            </>
          );
        })}
    </div>
  );
}
