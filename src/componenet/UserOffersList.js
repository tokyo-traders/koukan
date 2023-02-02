import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const BASE_URL = 'http://127.0.0.1:8000/api'
const homepage = '/api/homepage'


function UserOfferList(props) {

    const { user } = props

    const [offers, setOffers] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/offered-items/${user.id}`)
            .then(res => {
                setOffers(res.data)
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
            {offers && offers?.map((offer, index) => (
                <Card
                    key={index}
                    elevation={6}
                    sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
                    onClick={() => {
                        if (offer) {
                            navigate(`/MyPage/offered-items/${user.id}/${offer.id}`, { replace: true })
                        }
                    }}
                >
                    <CardMedia
                        component="img"
                        style={{ Width: 300 }}
                        image={BASE_URL + `${offer.image}`}
                        height="140"
                    />
                    <CardContent >
                        <Box display="flex" justify="space-between">
                            <Typography gutterBottom variant="body">{offer.itemName}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Grid>
    )
}

export default UserOfferList