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
        flex={1}
        p={2}
        sx={{ display: { xs: "block", sm: "block" } }}
        maxWidth='250px'
        minWidth='250px'
      >
        <Box
          // position='fixed'
          width='fit-content'
          boxShadow={3}
          borderRadius={2}
          bgcolor={"white"}
          marginRight={0}
        >
          <ToggleButtonGroup
            className='sidebar'
            orientation='vertical'
            value={selected}
            exclusive
          >
            <ToggleButton
              value={""}
              className='sidebar-toggle-btn'
              onClick={(e) => {
                handleCategoryFilter(e);
                setSelected(null);
              }}
            >
              <Typography variant='h6'>All Categories</Typography>{" "}
            </ToggleButton>
            {categories?.map((category, index) => (
              <ToggleButton
                className='sidebar-toggle-btn'
                key={index}
                value={category.category_name}
                onClick={(e) => {
                  handleCategoryFilter(e);
                  setSelected(category.category_name);
                }}
              >
                <ListItem disablePadding>
                  <ListItemText primary={category.category_name} />
                </ListItem>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
    </>
  );
}

export default Sidebar;
