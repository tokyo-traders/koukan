import React, { useState, useEffect, PureComponent, useCallback } from "react";
import _ from "lodash";
import { upload } from "@testing-library/user-event/dist/upload";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/axiosPrivate";
import axios from "./hooks/axios";

const BrownButton = styled(Button)(() => ({
  backgroundColor: "#4d3e38",
  borderRadius: "8px",
  color: "#def4f6",
  "&:hover": {
    background: "#332925",
  },
  // padding: "15px 36px",
  fontSize: "16px",
}));

function AddItem() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/MyPage";
  const mypage = useCallback(
    () => navigate("/MyPage", { replace: true }),
    [navigate]
  );
  const goBack = useCallback(() => {
    navigate(from, { replace: true });
  }, [navigate]);

  const [categoriesArray, setCategoriesArray] = useState([
    { id: 0, category_name: "", reputation_point: "" },
  ]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/categories-list");
      setCategoriesArray(response.data);
    })();
  }, []);

  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [desire, setDesire] = useState("");
  const [category, setCategory] = useState("");

  const uploadData = new FormData();
  const uploadImages = new FormData();
  const newItem = async (e) => {
    e.preventDefault();
    uploadData.append("item_name", itemName);
    uploadData.append("details", details);
    uploadData.append("user_id", user.id);
    uploadData.append("desire", desire);
    uploadData.append("category", category);
    console.log(uploadData);

    axiosPrivate
      .post(`/api/item/${user.id}`, uploadData)
      .then((res) => {
        uploadImages.append("itemId", Number(res.data.id));
      })
      .then(() => {
        for (const value of uploadImages.values()) {
          console.log(value);
        }
      })
      .then(() =>
        axios.post("/api/image/multiple_upload", uploadImages, {
          headers: {
            "Content-Type": `multipart/form-data;`,
          },
          withCredentials: true,
        })
      )
      .catch((error) => console.log(error));
    setDesire("");
    setDetails("");
    setItemName("");
    navigate("/MyPage/");
  };

  const handleChange = (e) => {
    // console.log(e.target.files)
    _.forEach(e.target.files, (file) => {
      console.log(file);
      uploadImages.append("images", file);
      // uploadImages.append('itemId', 85);

      // uploadImages.append("item_id", 1)
    });
  };

  return (
    <Box
      sx={{
        width: "30%",
        margin: "auto",
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography>Item Name</Typography>
      <TextField
        fullWidth
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />

      <Box sx={{ marginTop: 2 }}>
        <Typography>Description</Typography>
        <TextField
          fullWidth
          value={details}
          multiline
          rows={4}
          onChange={(e) => setDetails(e.target.value)}
        />
      </Box>
      <Box sx={{ minWidth: 120, marginTop: 2 }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Category</InputLabel>
          <Select
            labelId='category'
            id='category-dropdown'
            value={category}
            label='Choose category'
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoriesArray.map((x) => {
              return <MenuItem value={x["id"]}>{x["category_name"]}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Typography>Image</Typography>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleChange}
        />
      </Box>

      <BrownButton
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        onClick={newItem}
      >
        Add Item
      </BrownButton>

      <BrownButton
        width='80%'
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        onClick={goBack}
      >
        Go Back
      </BrownButton>
    </Box>
  );
}

export default AddItem;
