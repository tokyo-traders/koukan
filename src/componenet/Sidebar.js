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

import "./Sidebar.css"
import axios from "./hooks/axios";
import React, { useEffect, useState } from "react";

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

  console.log(selected);
  return (
    <div>
      <Box
        flex={1}
        p={2}
        sx={{ display: { xs: "block", sm: "block" } }}
      >
        <Box
          position='fixed'
          boxShadow={3}
          borderRadius={2}
          bgcolor={"white"}
        >
          
            <ToggleButtonGroup
              className="sidebar"
              orientation='vertical'
              value={selected}
              exclusive
            >
              <ToggleButton
                value={""}
                className="sidebar-toggle-btn"
                onClick={(e) => {
                  handleCategoryFilter(e);
                  setSelected(null);
                }}
              >
                <Typography variant='h6' >All Categories</Typography>{" "}
              </ToggleButton>
              {categories?.map((category, index) => (
                
                <ToggleButton
                className="sidebar-toggle-btn"

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
    </div>
  );
}

export default Sidebar;
