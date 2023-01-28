import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";

function Sidebar() {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed" boxShadow={2} borderRadius={2}>
        <List>
          <ListItem disablePadding>
            <ListItem>
              <Typography variant="h6">Categories</Typography>
            </ListItem>
          </ListItem>
          <ListItem disablePadding>

            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Furniture" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>

            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Storage" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
 
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Home Accessories" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
        
                    <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Travel" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Electronics" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
 
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Health & Beauty" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>

                    <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Sporting Goods" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Clothing" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
 
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Shoes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>

            
 
 
      
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;