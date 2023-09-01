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
import Pagination from "@mui/material/Pagination";
import "../App.css";

const MyContent = styled(CardContent)`
  &:last-child {
    padding-bottom: 10px;
  }
`;

export default function AllListings(props) {
  const { searchValue, categoryFilter, categories } = props;

  const [listings, setListings] = useState([]);
  const [totalPages, setTotalpages] = useState(1);
  const [page, setPage] = useState(1);
  const [catListings, setCatListings] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [loading, setLoading] = useState(true);
  const randomNumber = Math.floor(Math.random() * 10);

  useEffect(() => {
    if (!catListings) {
      axios.get(`/api/homepage/category/${randomNumber + 1}`).then((res) => {
        setCatListings(res.data.data);
      });
    }
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setLoading(true);
      axios
        .get(`/api/homepage/category/${categoryFilter.id}?page=${1}`)
        .then((res) => {
          setListings(res.data.data);
          setTotalpages(res.data.TotalPages);
          setLoading(false);
        });
    } else {
      setLoading(true);
      axios.get(`/api/homepage?page=${page}`).then((res) => {
        setListings(res.data.data);
        setTotalpages(res.data.TotalPages);
        setLoading(false);
      });
    }
  }, [page, categoryFilter]);

  const navigate = useNavigate();
  const makeOffer = (obj) => {
    navigate(`/listing/${obj.post.id}`);
  };

  const handlepage = (event, value) => {
    if (page !== value) {
      setPage(value);
      setLoading(true);
    }
  };

  const showListing = (listing, index) => {
    return (
      <div
        key={index}
        className='fade-in-card'
        style={{ animation: `fadeIn ${0.15 * index}s ease-in` }}
      >
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
      {catListings && categories && (
        <div
          style={{
            background: "#def4f6",
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
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              padding: "0px 0px",
              background: "transparent",
              opacity: 0.6,
            }}
            variant='h6'
          >
            Explore:{" "}
            {categories &&
              categories[catListings[0]?.post?.item_id?.category - 1]
                ?.category_name}
          </Typography>
          <Container
            className='random'
            sx={{
              background: "#def4f6",
              minWidth: "100%",
              height: "340px",
              marginBottom: "0px",
              display: "flex",
              flexDirection: "row",
              overflow: "auto",
              paddingTop: "0px",
            }}
          >
            {catListings?.map((listing, index) => showListing(listing, index))}
          </Container>
        </div>
      )}
      {categoryFilter ? (
        <Typography
          variant='h4'
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            padding: "0px 0px",
            background: "transparent",
            opacity: 0.6,
            margin: "30px 0px 15px 0px",
          }}
        >
          {categoryFilter.category_name}
        </Typography>
      ) : (
        <Typography
          variant='h4'
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            padding: "0px 0px",
            background: "transparent",
            opacity: 0.6,
            margin: "30px 0px 15px 0px",
          }}
        >
          See What People Are Trading Today
        </Typography>
      )}
      <Grid
        container
        width='100%'
        minHeight='500px'
        height='fit-content'
        marginRight='20px'
        direction='row'
        justifyContent='center'
        alignItems='center'
        xl={15}
        spacing={2}
      >
        {loading ? (
          <img
            src='loading-green-loading.gif'
            style={{
              height: "150px",
              width: "150px",
              opacity: 0.2,
              margin: "20px auto",
            }}
          />
        ) : (
          listings?.map((listing, index) => showListing(listing, index))
        )}
      </Grid>
      <Pagination
        count={totalPages}
        variant='outlined'
        shape='rounded'
        page={page}
        onChange={handlepage}
        style={{
          width: "fit-content",
          margin: "20px auto",
        }}
      />
    </div>
  );
}
