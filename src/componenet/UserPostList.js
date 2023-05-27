import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import useAuth from "./hooks/useAuth";

const BASE_URL = "http://127.0.0.1:8000/api";
const homepage = "/api/homepage";

function UserPostList() {
  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();
  const location = useLocation();

  const [listings, setListings] = useState(null);

  useEffect(() => {
    axios.get(homepage).then((res) => {
      setListings(res.data.filter((item) => item.item.user_id === user.id));
    });
  }, []);

  const from = location.state?.from?.pathname || "/MyPage";
  const addItem = useCallback(
    () => navigate("/MyPage/addItem", { replace: true }),
    [navigate]
  );

  const [offersMade, setOffersMade] = useState([]);

  useEffect(() => {
    axios.get(`/api/create-offer`).then((response) => {
      setOffersMade(response.data);
    });
  }, []);

  return (
    <Grid
      container
      width='100%'
      direction='row'
      justifyContent='center'
      alignItems='center'
      xl={12}
      spacing={3}
    >
      {listings &&
        listings?.map((item) => (
          <Card
            elevation={6}
            sx={{ maxWidth: 200, mt: 10, marginLeft: 3 }}
            onClick={() => {
              if (item) {
                navigate(`/listing/${item.post.id}`, { replace: true });
              }
            }}
          >
            <CardMedia
              component='img'
              sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
              image={BASE_URL + `${item.images[0]}`}
              height='150'
            />
            <CardContent>
              <Box
                display='flex'
                justify='space-between'
              >
                <Typography noWrap>{item.item.item_name}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
    </Grid>
  );
}

export default UserPostList;
