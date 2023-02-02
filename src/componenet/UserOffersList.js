import React, { useState, useEffect, useCallback } from 'react'
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

    useEffect(() => {
        axios
            .get(`/api/offered-items/${user.id}`)
            .then(res => {
                console.log(res.data)
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
            {offers && offers?.map(item => (
                <Card
                    elevation={6}
                    sx={{ maxWidth: 300, mt: 10, marginLeft: 4 }}
                    onClick={() => {
                        if (item) {
                            // navigate(`/listing/${item.post.id}`, { replace: true }) need the path for the single offer view 
                        }
                    }}
                >
                    <CardMedia
                        component="img"
                        style={{ Width: 300 }}
                        image={BASE_URL + `${item.image}`}
                        height="140"
                    />
                    <CardContent >
                        <Box display="flex" justify="space-between">
                            <Typography gutterBottom variant="body">{item.itemName}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Grid>
    )
}

export default UserOfferList