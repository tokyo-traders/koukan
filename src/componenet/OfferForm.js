import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { CardActionArea } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/axiosPrivate";

import Divider from "@mui/material/Divider";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

import { useParams, useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "8px",
  color: "#def4f6",
  "&:hover": {
    background: "#332925",
  },
  // padding: "15px 36px",
  fontSize: "16px",
}));

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const REGISTER_URL = "/api/create-offer";

function OfferForm(props) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { categories } = props;
  const { listingId } = useParams();
  const user = auth?.user;

  const [listing, setListing] = useState(null);
  const [offer, setOffer] = useState(null);
  const [date, setDate] = useState("");
  const [acceptedCat, SetAccptedCat] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/MyPage";
  const myPage = useCallback(
    () => navigate("/MyPage", { replace: true }),
    [navigate]
  );

  const [itemInfo, setItemInfo] = useState([
    {
      itemName: "",
      itemImages: "",
      itemID: "",
    },
  ]);

  useEffect(() => {
    if (user) {
      axiosPrivate.get(`/api/all-info/${user.id}`).then((response) => {
        setItemInfo([...response.data]);
      });
    }
    if (listingId) {
      axiosPrivate
        .get(`/api/listing/${listingId}`)
        .then((response) => {
          setListing(response.data[0]);
          let safe = response.data[0].categories.map((category) => {
            return category.categories_id;
          });
          SetAccptedCat(safe);
        })
        .then(() => console.log(acceptedCat));
    }
  }, [user]);

  console.log("LISTING", listing);
  console.log("ITEM INFO", itemInfo);
  const makeOffer = async () => {
    console.log(offer.itemID);
    console.log(listing.post.id);
    const offerObj = {
      post_id: listing.post.id,
      offered_item: offer.itemID,
      acceptance: false,
    };
    console.log(offerObj);
    const response = await axiosPrivate.post(
      REGISTER_URL,
      JSON.stringify(offerObj),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    console.log(JSON.stringify(response.data));
    myPage();
  };

  return (
    <>
      <Typography
        marginTop={4}
        variant='h4'
        fontFamily='Roboto Slab'
        padding={2}
        color='#4d3e38'
        align='center'
      >
        SELECT FROM YOUR ITEM
      </Typography>
      <Box
        sx={{
          backgroundColor: "none",
          width: "80%",
          display: "flex",
          margin: "auto",
        }}
      >
        <Grid
          container
          // width="80%"
          // direction="row"
          justifyContent='center'
          // lg={12}

          // PR incoming merge not accepted
          //
          //        // spacing={2}
          //
          //        //filter((item) => acceptedCat.includes(item.category)).
          //      >
          //        {(user && acceptedCat) && itemInfo?.map(item => (
          //          <Card
          //            elevation={2}
          //            sx={{ maxWidth: 200, margin: 2}}
          //            onClick={() => {
          //              console.log(item)
          //              setOffer(item)
          //            }}
          //          >
          //             <CardActionArea>
          //            <CardMedia
          //              // sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5',}}
          //              sx={{objectFit: "contain",bgcolor: '#f5f5f5'  }}
          //              component="img"
          //              image={BASE_URL + `${item.itemImages[0]}`}
          //              height="150"
          //            />
          //            </CardActionArea>
          //            <CardContent>
          //              <Typography noWrap>{item?.itemName}</Typography>
          //            </CardContent>
          //          </Card>
          //        ))}
          //      </Grid>

          // spacing={2}
          //
        >
          {user &&
            acceptedCat &&
            itemInfo
              ?.filter((item) => acceptedCat.includes(item.category))
              .map((item) => (
                <Card
                  elevation={2}
                  sx={{ maxWidth: 200, margin: 2 }}
                  onClick={() => {
                    console.log(item);
                    setOffer(item);
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      // sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5',}}
                      sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                      component='img'
                      image={item.itemImages[0]}
                      height='150'
                    />
                  </CardActionArea>
                  <CardContent>
                    <Typography noWrap>{item?.itemName}</Typography>
                  </CardContent>
                </Card>
              ))}
        </Grid>
      </Box>

      <Box
        sx={{
          width: "80%",
          margin: "auto",
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Divider
          sx={{ borderBottomWidth: 2 }}
          variant='middle'
        />
      </Box>

      <Box
        sx={{
          width: "80%",
          margin: "auto",
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            backgroundColor: "none",
            marginTop: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={5}
            sx={{
              flexGrow: 1,
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              elevation={2}
              sx={{ maxHeight: 340, margin: 2 }}
            >
              <CardActionArea>
                <CardMedia
                  sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                  component='img'
                  image={listing && listing.images[0]}
                  height='150'
                />
                <CardContent>
                  <Typography nowrap>
                    {listing && listing.item.item_name}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Owner : {listing && listing.username}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                  {listing && listing.item.details}
                </Typography> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid
            item
            xs={2}
            sx={{
              flexGrow: 1,
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title='Submit your offer'>
              <BrownButton onClick={makeOffer}>MAKE OFFER</BrownButton>
            </Tooltip>
          </Grid>

          <Grid
            item
            xs={5}
            sx={{
              flexGrow: 1,
              marginTop: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {offer ? (
              <Card
                elevation={6}
                sx={{ maxHeight: 340, margin: 2 }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                    component='img'
                    image={offer?.itemImages[0]}
                    height='150'
                  />
                  <CardContent>
                    <Typography npwrap>{offer && offer.itemName}</Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                    >
                      Your item
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : (
              <Box
                component='span'
                sx={{
                  p: 2,
                  border: "1px dashed grey",
                  height: 200,
                  width: 200,
                }}
              >
                <Typography
                  variant='body'
                  color='text.secondary'
                >
                  Select your item
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OfferForm;
