import { Category } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Sidebar(props) {

  const { handleCategoryFilter, categories, setCategories } = props;
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios('api/categories-list')
      setCategories(response.data)
    }
    getCategories()
  }, [])

  const resetCategories = () => {
    setSelected('')
  }

  return (
    <div>
      <Box flex={1} p={2} sx={{ display: { xs: "block", sm: "block" } }}>
        <Box position="fixed" boxShadow={3} borderRadius={2} bgcolor={"white"}>
          <List>
            <ListItem disablePadding>
              <ListItem>
                <Typography variant="h6">Categories</Typography>
              </ListItem>
            </ListItem>
            <ToggleButtonGroup
              orientation="vertical"
              value={selected}
              exclusive
            >
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
          <ButtonBase onClick={resetCategories}>reset categories</ButtonBase>
        </Box>
      </Box>
    </div >
  );
};

export default Sidebar;