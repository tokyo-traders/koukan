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
import axios from "axios";
import React, { useEffect, useState } from "react";

function Sidebar(props) {

  const { handleCategoryFilter, categories, setCategories } = props;
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios('https://koukan.onrender.com/api/categories-list')
      setCategories(response.data)
    }
    getCategories()
  }, [])

  console.log(selected)
  return (
    <div>
      <Box flex={1} p={2} sx={{ display: { xs: "block", sm: "block" } }}>
        <Box position="fixed" boxShadow={3} borderRadius={2} bgcolor={"white"}>
          <List>
            <ToggleButtonGroup
              orientation="vertical"
              value={selected}
              exclusive
            >
              {/* <ListItem disablePadding> */}
              <ToggleButton value={''} onClick={(e) => { handleCategoryFilter(e); setSelected(null); }} >
                {/* <ListItem> */}
                <Typography variant="h6">All Categories</Typography> {/* please do not change this wording 😅/*}
                {/* </ListItem> */}
              </ToggleButton>
              {/* </ListItem> */}
              {categories?.map(category => (
                <ToggleButton value={category.category_name} onClick={(e) => { handleCategoryFilter(e); setSelected(category.category_name) }}>
                  <ListItem disablePadding>
                    <ListItemButton component="a" >
                      <ListItemText primary={category.category_name} />
                    </ListItemButton>
                  </ListItem>
                </ToggleButton>
              )
              )}
            </ToggleButtonGroup>
          </List>
        </Box>
      </Box>
    </div >
  );
};

export default Sidebar;