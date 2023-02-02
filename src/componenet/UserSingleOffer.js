import React, { useState, useEffect, useCallback } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
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

export default function ListingSingleItem(props) {

    const { user } = props

    const { listingId } = useParams(); // this can be taken from the offer


    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/MyPage"

    const makeOffer = useCallback(() => navigate(`/listing/${listingId}/offer`, { replace: true }), [navigate]);
    const login = useCallback(() => navigate(`/login`, { replace: true }), [navigate]);
    const goBack = useCallback(() => {
        navigate(from, { replace: true })
    }, [navigate]);


    //   const [date, setDate] = useState('');
    const [listing, setListing] = useState(null);
    const [offer, setOffer] = useState(null);
    const [offersItems, setOffersItems] = useState(null);
    const [images, setImages] = useState([])

    const display = () => {
        if (listing) {
            makeOffer();
        }
    }


    const acceptOffer = async (obj) => {
        obj.acceptance = true
        const response = await axios.put(
            `/api/SetPending`,
            JSON.stringify(obj),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        )
        console.log(response.data)
    }


    useEffect(() => {
        if (listingId) {
            axios.get(`/api/listing/${listingId}`)
                .then(response => {
                    console.log(response.data)
                    setListing(response.data[0])
                })
        }
    }, [])

    useEffect(() => {
        if (listingId) {
            axios.get(`/api/listing/${listingId}`)
                .then(response => {
                    console.log(response.data[0].images)
                    images.concat(response.data[0].images)
                })
        }
    }, [])

    useEffect(() => {

        const getOffer = async () => {
            //   let response = await axios.get(`/api/create-offer`) need path for the single offer
            console.log(response.data.filter(item => item.post_id == listingId))
            setOffer(response.data.filter(item => item.post_id == listingId))


        }
        getOffers()

    }, [])

    useEffect(() => {

        const getItem = async () => {
            let responseArray = offersMade.map((offer) => {
                return axios.get(`/api/all-item/${offer.offered_item}`)
            })

            Promise.all(responseArray).then((res) => {
                console.log(res)
                return res.map((item) => {
                    return item.data[0]
                })
            })
                .then((res) => setOffersItems(res))

            return responseArray
        }

        if (offersMade) {
            getItem()
        }
    }, [offersMade])

    const Mailto = () => {
        return (
            <a href={`mailto:${listing.email}`}> <EmailIcon sx={{ fontSize: "35px" }} /> </a>
        );
    };

    const captionStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
    }
    const slideNumberStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
    }

    // console.log(listing)
    const data = async () => {
        const arr = []
        for (let i of listing.images) {
            let img = { image: listing.images[i], caption: `pic N. ${i}` }
            await img.json()
            arr.push(img)
        }
        return arr
    }
    return (
        <div key={index}>
            <Card
                key={index}
                elevation={2}
                sx={{ maxWidth: 200, mt: 5, marginLeft: 3 }}
            >
                <CardMedia
                    component="img"
                    image={BASE_URL + `${listing?.images[0]}`}
                    width="200"
                    sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                />
                <CardContent >
                    <Box display="flex" justify="space-between">
                        <Typography sx={{ justifyContent: "center", display: "flex" }} gutterBottom variant="body">{listing.item.item_name}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );

}