import React, { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/system';
import Button from '@mui/material/Button';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from "axios";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import Carousel from 'react-material-ui-carousel'
import EmailIcon from '@mui/icons-material/Email';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ImageGallery from 'react-image-gallery';



import "./LisitingSingleItem.css"
import { CollectionsBookmarkOutlined } from '@mui/icons-material';
import { CardContent, CardMedia } from '@mui/material';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '50%',
    maxHeight: '50%',
});

const BrownButton = styled(Button)(() => ({
    backgroundColor: "#4d3e38",
    borderRadius: "8px",
    color: "#def4f6",
    width: '60%',
    "&:hover": {
        background: "#332925"
    },
    // padding: "15px 36px",
    fontSize: "16px"
}));

const BASE_URL = 'http://127.0.0.1:8000/api'

export default function UserSingleOffer(props) {

    const { user } = props

    const { offerId } = useParams(); // this can be taken from the offer
    const [offer, setOffer] = useState()

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/MyPage"


    useEffect(() => {
        let response = axios.get(`/api/offered-items/${user.id}/${offerId}`)
        console.log(response.data)
        setOffer(response.data)

    }, [])


    return (
        <div key={offerId}>
            {/* <Card
                elevation={2}
                sx={{ maxWidth: 200, mt: 5, marginLeft: 3 }}
            >
                <CardMedia
                    component="img"
                    image={BASE_URL + `${offer?.image}`}
                    width="200"
                    sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                />
                <CardContent >
                    <Box display="flex" justify="space-between">
                        <Typography sx={{ justifyContent: "center", display: "flex" }} gutterBottom variant="body">{offer.item_name}</Typography>
                    </Box>
                </CardContent>
            </Card> */}
        </div>
    );

}