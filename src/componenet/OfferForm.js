import React, { useState, useEffect, useCallback } from "react";
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

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "8px",
  color: "#def4f6",
  "&:hover": {
    background: "#332925",
  },
  fontSize: "16px",
}));

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

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
  }, [user]);

  useEffect(() => {
    if (listingId && categories) {
      axiosPrivate.get(`/api/listing/${listingId}`).then((response) => {
        setListing(response.data);
        let safe = response.data.categories.map((category) => {
          return category.categories_id;
        });
        SetAccptedCat(safe);
      });
    }
  }, [listingId]);

  const makeOffer = async () => {
    const offerObj = {
      post_id: listing.id,
      offered_item: offer.itemID,
      acceptance: false,
    };

    const response = await axiosPrivate.post("/api/create-offer", offerObj, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    navigate(`/listing/${listing.id}`);
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
          justifyContent='center'
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
                    setOffer(item);
                  }}
                >
                  <CardActionArea>
                    <CardMedia
                      // sx={{maxWidth: 200, objectFit:"contain",  bgcolor: '#f5f5f5',}}
                      sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
                      component='img'
                      image={item.itemImages[0].image}
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
                  image={listing?.images[0].image}
                  height='150'
                />
                <CardContent>
                  <Typography nowrap>{listing?.item_id.item_name}</Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                  >
                    Owner : {listing?.user_id.username}
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
                    image={offer?.itemImages[0].image}
                    height='150'
                  />
                  <CardContent>
                    <Typography npwrap>{offer?.itemName}</Typography>
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
