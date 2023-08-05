import { width } from "@mui/system";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import axios from "./hooks/axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";

const MyContent = styled(CardContent)`
  &:last-child {
    padding-bottom: 10px;
  }
`;

export default function AllListings(props) {
  const { searchValue, categoryFilter, categories } = props;

  const [listings, setListings] = useState([]);
  const [totalPages, setTotalpages] = useState(4);
  const [catListings, setCatListings] = useState([]);
  const [diplayListing, setDuisplayListing] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    axios.get(`/api/homepage/category/6`).then((res) => {
      setCatListings(res.data.data);
      setTotalpages(res.data.data);
      console.log(res.data.TotalPages);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/homepage").then((res) => {
      setListings(res.data);
      console.log(res.data);
    });
  }, []);

  const navigate = useNavigate();
  const makeOffer = (obj) => {
    navigate(`/listing/${obj.post.id}`);
  };
  console.log(categories);
  const showListing = (listing, index) => {
    return (
      <div key={index}>
        <Card
          key={index}
          elevation={2}
          sx={{
            maxWidth: 250,
            minWidth: 250,
            maxHeight: 270,
            minHeight: 270,
            mt: 5,
            marginLeft: 3,
            background: "#def4f6",
            marginTop: 3,
          }}
          onClick={() => {
            if (listing) {
              makeOffer(listing);
            }
          }}
        >
          <CardMedia
            component='img'
            image={listing?.images[0].image}
            height='230'
            sx={{ bgcolor: "#f5f5f5", objectFit: "contain" }}
          />
          <MyContent sx={{ background: "white", opacity: 0.75 }}>
            <Typography
              noWrap
              variant='body2'
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                padding: "0px 0px",
              }}
            >
              {listing.post.item_id.item_name}
            </Typography>
          </MyContent>
        </Card>
      </div>
    );
  };

  useEffect(() => {
    const getCategoryId = (category) => {
      const selectedCategory = categories.filter((cat) => {
        return cat.category_name === category;
      });
      setSelectedCategory(selectedCategory[0]?.id);
    };
    getCategoryId(categoryFilter);
  }, [categoryFilter]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#def4f6",
          minWidth: "100%",
          height: "360px",
          margin: "10px 0px 0px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "spaceBetween",
          padding: "0px 0px 0px 0px",
          boxShadow:
            "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          // style={{ backgroundColor: "transparent", opacity: 0.8 }}
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            padding: "0px 0px",
            backgroundColor: "transparent",
            opacity: 0.6,
          }}
          variant='h6'
        >
          Explore: Travel
        </Typography>
        <Container
          sx={{
            backgroundColor: "#def4f6",
            minWidth: "100%",
            height: "340px",
            marginBottom: "0px",
            display: "flex",
            flexDirection: "row",
            overflow: "auto",
            paddingTop: "0px",
          }}
        >
          {catListings?.map((listing) => showListing(listing))}
        </Container>
      </div>
      <Grid
        container
        width='100%'
        minWidth='1600px'
        height='fit-content'
        marginRight='20px'
        direction='row'
        justifyContent='center'
        alignItems='center'
        xl={15}
        spacing={2}
      >
        {listings?.map((listing) =>
          categoryFilter
            ? listing.post.item_id.category === selectedCategory &&
              listing.post.item_id.item_name
                .toLowerCase()
                .includes(searchValue?.toLowerCase()) &&
              showListing(listing)
            : listing.post.item_id.item_name
                .toLowerCase()
                .includes(searchValue?.toLowerCase()) && showListing(listing)
        )}
      </Grid>
    </div>
  );
}
