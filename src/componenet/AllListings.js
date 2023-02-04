import { width } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const BASE_URL = 'http://127.0.0.1:8000/api';

const MyContent = styled(CardContent)`
  &:last-child {
  padding-bottom: 10px;
 } 
`

export default function AllListings(props) {

    const { searchValue, categoryFilter, categories } = props;

    const [listings, setListings] = useState([]);
    const [diplayListing, setDuisplayListing] = useState([])
    const [selectedCategory, setSelectedCategory] = useState()


    useEffect(() => {
        axios
            .get('api/homepage')
            .then(res => {
                // console.log("this is the new data", res.data)
                setListings(res.data)
            })
    }, [])

    const navigate = useNavigate();
    const makeOffer = (obj) => {
        navigate(`/listing/${obj.post.id}`, { replace: true })
    }

    const showListing = (listing, index) => {
        return (
            <div key={index}>
                <Card
                    key={index}
                    elevation={2}
                    sx={{ maxWidth: 200, mt: 5, marginLeft: 3 }}
                    onClick={() => {
                        if (listing) {
                            makeOffer(listing)
                        }
                    }}
                >
                    <CardMedia
                        component="img"
                        image={BASE_URL + `${listing?.images[0]}`}
                        height="150"
                        sx={{bgcolor: '#f5f5f5', objectFit: "contain" }}

                    />
                    <MyContent >
                        
                        <Typography noWrap variant='body2'>{listing.item.item_name}</Typography>
                      
                    </MyContent>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        const getCategoryId = (category) => {
            const selectedCategory = categories.filter(cat => {
                return cat.category_name === category
            })
            // console.log(selectedCategory[0]?.id)
            setSelectedCategory(selectedCategory[0]?.id)
        }
        getCategoryId(categoryFilter)
    }, [categoryFilter])

    return (
        <div className='listing'>
            <Grid
                container
                width="100%"
                direction="row"
                justifyContent="center"
                alignItems="center"
                xl={12}
                spacing={1}
            >

                {listings?.map(listing => (
                    categoryFilter
                        ?
                        listing.item.category === selectedCategory && listing.item.item_name.includes(searchValue?.toLowerCase()) && showListing(listing)
                        :
                        listing.item.item_name.includes(searchValue?.toLowerCase()) && showListing(listing)
                ))
                }
            </Grid>

        </div>
    )
} 