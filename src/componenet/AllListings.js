import { width } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function AllListings(props) {
	// const body = document.getElementsByTagName("body");
	// console.log(body);

	const { searchValue } = props;

	const [listings, setListings] = useState([]);
	const [diplayListing, setDuisplayListing] = useState([]);

	useEffect(() => {
		axios.get("api/homepage").then((res) => {
			console.log("this is the new data", res.data);
			setListings(res.data);
		});
	}, []);

	console.log(searchValue);
	const navigate = useNavigate();
	const makeOffer = (obj) => {
		navigate(`/listing/${obj.post.id}`, { replace: true });
	};

	const showListing = (listing) => {
		return (
			// <div className='listingClass'
			//     >
			//     <img alt="image1" width="220px" src={BASE_URL + `${listing?.images[0]}`} />
			//     < h3 > {listing.item.item_name}</h3>

			<Card
				elevation={2}
				sx={{
					// this is for the overall
					width: 250,
					height: 200,
					mt: 5,
					marginLeft: 3,
				}}
				onClick={() => {
					if (listing) {
						makeOffer(listing);
					}
				}}
			>
				<CardMedia
					component="img"
					image={BASE_URL + `${listing?.images[0]}`}
					sx={{
						// this is for image boxes
						// padding: "0.5em 0.5em 0 0.5em",
						objectFit: "contain",
						height: 150,
						objectFit: "cover",
					}}
				/>
				<CardContent>
					<Box>
						<Typography
							sx={{
								// this one is only the name box
								justifyContent: "center",
								display: "flex",
								textAlign: "center",
								fontSize: "20px",
								fontFamily: "monospace",
							}}
							gutterBottom
							variant="body"
						>
							{listing.item.item_name}
						</Typography>
					</Box>
				</CardContent>
			</Card>
		);
	};

	function findMatches(searchValue, listings) {
		return listings.filter((item) => {
			const regex = new RegExp(searchValue, "gi");
			return item.item.item_name.match(regex);
		});
	}

	return (
		<div className="listing">
			<Grid
				container
				width="100%"
				height="100%"
				direction="row"
				justifyContent="center"
				alignItems="center"
				xl={12}
				spacing={1}
			>
				{listings?.map((listing) =>
					searchValue
						? listing.item.item_name.includes(searchValue.toLowerCase()) &&
						  showListing(listing)
						: showListing(listing)
				)}
			</Grid>
		</div>
	);
}
