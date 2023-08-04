import { Category } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import axios from "./hooks/axios";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";

function Sidebar(props) {
  const { handleCategoryFilter, categories, setCategories } = props;
  const [selected, setSelected] = useState(null);
  console.log(categories);
  useEffect(() => {
    const getCategories = async () => {
      const response = await axios("/api/categories-list");
      setCategories(response.data);
    };
    getCategories();
  }, []);

  return (
    <>
      <Box
        p='2px 15px 2px 15px'
        mb={2}
        width='100%'
        boxShadow={3}
        bgcolor={"#c5e4e7"}
        marginRight={0}
      >
        <ToggleButtonGroup
          className='sidebar'
          orientation='horizontal'
          value={selected}
          exclusive
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ToggleButton
            style={{
              border: "none",
              padding: "0px 5px",
              margin: "0px",
              width: "100%",
            }}
            value={""}
            onClick={(e) => {
              handleCategoryFilter(e);
              setSelected(null);
            }}
          >
            <Typography
              fontSize={15}
              fontWeight='bold'
            >
              All Categories
            </Typography>{" "}
          </ToggleButton>
          {categories?.map((category, index) => (
            <ToggleButton
              style={{
                border: "none",
                padding: "5px 5px",
                margin: "0px",
                width: "100%",
              }}
              key={index}
              value={category.category_name}
              onClick={(e) => {
                handleCategoryFilter(e);
                setSelected(category.category_name);
              }}
            >
              <Typography fontSize={15}>{category.category_name}</Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </>
  );
}

export default Sidebar;
