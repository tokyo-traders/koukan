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

function UserItemsList() {
  const { auth } = useAuth();
  const user = auth.user;

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/MyPage";
  const addItem = useCallback(
    () => navigate("/MyPage/addItem", { replace: true }),
    [navigate]
  );
  const myPage = useCallback(() => {
    if (from === "/signup") {
      navigate("/MyPage", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  }, [navigate]);

  const [itemInfo, setItemInfo] = useState([
    {
      itemName: "",
      itemImages: "",
      itemID: "",
    },
  ]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://127.0.0.1:8000/api/all-info/${user.id}`)
        .then((response) => {
          // console.log(response.data)
          setItemInfo([...response.data]);
        });
    }
  }, [user]);

  // useEffect(() => {
  //   axios.get(`/api/create-offer`)
  //     .then(response => {
  //       const data = response.data
  //     })
  // }, [])

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
      {user &&
        itemInfo?.map((item) => (
          <Card
            elevation={2}
            sx={{ maxWidth: 200, mt: 10, marginLeft: 3 }}
            onClick={() => {
              if (item) {
                navigate(`/MyPage/Items/${item.itemID}`, { replace: true });
              }
            }}
          >
            <CardMedia
              component='img'
              image={BASE_URL + `${item.itemImages[0]}`}
              height='150'
              sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
            />
            <CardContent>
              {/* <Box display="flex" justify="space-between"> */}
              <Typography noWrap>{item.itemName}</Typography>
              {/* </Box> */}
            </CardContent>
          </Card>
        ))}
      <Button onClick={addItem}>
        <Icon
          sx={{ fontSize: 50, marginLeft: 5, marginTop: 3, color: "#AEAEAE" }}
        >
          add_circle
        </Icon>
      </Button>
    </Grid>
  );
}

export default UserItemsList;
