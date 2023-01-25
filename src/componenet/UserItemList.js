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


function UserItemsList(props) {

    const {user} = props

    const navigate = useNavigate();
    const location = useLocation();
  

    const from = location.state?.from?.pathname || "/MyPage"
    const addItem = useCallback(()=> navigate('/MyPage/addItem', {replace: true}), [navigate]);
    const myPage = useCallback(()=> {
      if (from === "/signup") {
        navigate('/MyPage', {replace: true})
      } else {
        navigate(from, {replace: true})
      }
      }, [navigate]);

   
      const [itemInfo, setItemInfo] = useState([{
        "itemName": "",
        "itemImages": "",
        "itemID": ""
      }])
      const [offersMade, setOffersMade] = useState([]);
    useEffect(() => {
        if (user) {
        axios.get(`/api/all-info/${user.id}`)
          .then(response => {
            setItemInfo([...response.data])
          })
        }
      }, [user])

      useEffect(() => {
        axios.get(`/api/create-offer`)
          .then(response => {
            const data = response.data
          })
      }, [])

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
        {user && itemInfo?.map(item => (
            <Card 
              elevation={6} 
              sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
              onClick={() => {
                if (item) {
                  navigate(`/MyPage/Items/${item.itemID}`, {replace: true})
                }
              }}
              >
              <CardMedia
                component="img"
                style={{ Width: 300 }}
                image={BASE_URL + `${item.itemImages[0]}`}
                height="140"
              />
              <CardContent >
                <Box display="flex" justify="space-between">
                <Typography gutterBottom variant="body">{item.itemName}</Typography>
                </Box>
              </CardContent>
            </Card>
        ))}
        <Button onClick={addItem}>
          <Icon sx={{ fontSize: 90, marginLeft: 15, marginTop: 3 }}>add_circle</Icon>
        </Button>
      </Grid>
    )
}

export default UserItemsList