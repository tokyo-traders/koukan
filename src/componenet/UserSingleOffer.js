import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/system";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import Carousel from 'react-material-ui-carousel'
import EmailIcon from "@mui/icons-material/Email";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import SendIcon from "@mui/icons-material/Send";
import Rating from "@mui/material/Rating";
import useAuth from "./hooks/useAuth";

import "./LisitingSingleItem.css";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { CardContent, CardMedia } from "@mui/material";

const modalStyle = {
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

// const Img = styled('img')({
//     margin: 'auto',
//     display: 'block',
//     maxWidth: '50%',
//     maxHeight: '50%',
// });

// const BrownButton = styled(Button)(() => ({
//     backgroundColor: "#4d3e38",
//     borderRadius: "8px",
//     color: "#def4f6",
//     width: '60%',
//     "&:hover": {
//         background: "#332925"
//     },
//     // padding: "15px 36px",
//     fontSize: "16px"
// }));

const BASE_URL = "http://127.0.0.1:8000/api";

export default function UserSingleOffer() {
  const { auth } = useAuth();
  const user = auth.user;

  const { offerId } = useParams(); // this can be taken from the offer
  const [offer, setOffer] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(3);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage";

  useEffect(() => {
    axios
      .get(`/api/singleOffer/${offerId}`)
      .then((response) => setOffer(response.data));
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
  console.log(offer);
  return (
    <>
      <Grid
        container
        width='auto'
        direction='row'
        justifyContent='center'
        alignItems='center'
        // xl={2}
        spacing={6}
      >
        <Grid
          item
          xs={3}
        >
          <Card
            elevation={2}
            sx={{ maxWidth: 200, mt: 5, marginLeft: 3 }}
          >
            <CardMedia
              component='img'
              image={BASE_URL + `${offer?.itemOfferedImage}`}
              width='200'
              sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
            />
            <CardContent>
              <Box
                display='flex'
                justify='space-between'
              >
                <Typography
                  sx={{ justifyContent: "center", display: "flex" }}
                  gutterBottom
                  variant='body'
                >
                  {offer?.itemOffered}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
        >
          <Button
            alignItems='center'
            sx={{
              background: "#82FA58",
            }}
            variant='contained'
            endIcon={<SendIcon />}
            onClick={handleOpenModal}
          >
            Send review
          </Button>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby='modal-modal-description'
          >
            <Box sx={styleModal}>
              <Typography
                id='modal-modal-description'
                variant='h6'
                component='h2'
              >
                How do you rate {offer?.otherUserInfo} ?
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
        </Grid>

        <Grid
          item
          xs={3}
        >
          <Card
            elevation={2}
            sx={{ maxWidth: 200 }}
          >
            <CardMedia
              component='img'
              image={BASE_URL + `${offer?.desiredItemImage}`}
              width='200'
              sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
            />
            <CardContent>
              <Box
                display='flex'
                justify='space-between'
              >
                <Typography
                  sx={{ justifyContent: "center", display: "flex" }}
                  gutterBottom
                  variant='body'
                >
                  {offer?.desiredItem}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
