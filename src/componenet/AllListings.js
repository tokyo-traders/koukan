import { width } from '@mui/system';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000/api';


export default function AllListings(props) {

    const { searchValue } = props;

    const [listings, setListings] = useState([]);
    const [diplayListing, setDuisplayListing] = useState([])


    useEffect(() => {
        axios
            .get('api/homepage')
            .then(res => {
                console.log("this is the new data", res.data)
                setListings(res.data)
            })
    }, [])

    console.log(searchValue)
    const navigate = useNavigate();
    const makeOffer = (obj) => {
        navigate(`/listing/${obj.post.id}`, { replace: true })
    }

    const showListing = (listing) => {
        return (
            <div className='listingClass'
                onClick={() => {
                    if (listing) {
                        makeOffer(listing)
                    }
                }}>
                <img alt="image1" width="220px" src={BASE_URL + `${listing?.images[0]}`} />
                < h3 > {listing.item.item_name}</h3>
            </div>
        )
    }

    function findMatches(searchValue, listings) {
        return listings.filter(item => {
            const regex = new RegExp(searchValue, 'gi')
            return item.item.item_name.match(regex)
        });
    }

    return (
        <div className='listing'>
        
            {listings?.map(listing => (
                searchValue
                    ?
                    listing.item.item_name.includes(searchValue.toLowerCase()) && showListing(listing)
                    :
                    showListing(listing)
            ))
            }
       
        </div>
    )
} 