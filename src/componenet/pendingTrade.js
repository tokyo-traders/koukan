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
import  Divider  from '@mui/material/Divider';
import { useNavigate, useLocation} from "react-router-dom";

const BASE_URL = 'http://127.0.0.1:8000/api'
const homepage = '/api/homepage'


function PendingTrade(props) {

    const {user} = props

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/MyPage"
    const myPage = useCallback(()=> navigate('/MyPage', {replace: true}), [navigate]);

      const [tradingItems, setTradingItems] = useState(null);


      useEffect(() => {
        axios.get(`/api/acceptedTrade/${user.id}`)
          .then(response => {
            console.log(response.data)
            setTradingItems(response.data)
          })
      }, [])


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
              </Card>
          ))}
        </Grid>
      )
}

export default PendingTrade