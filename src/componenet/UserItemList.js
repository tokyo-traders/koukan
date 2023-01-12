import React, { useState, useEffect } from 'react'
import axios from "axios";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

//npm install react-material-ui-carousel to make the carousel for image gallery




function UserItemsList() {
    const [itemList, setItemList] = useState([])

    useEffect(() => {
        // Promise.all(
        //     [
                // axios.get(`/api/item/1`), // need the path for the images
                axios.get('/api/item/1') // need the path for the 
        // ] 
        // )
            .then((response) => {
                console.log(response.data)
                setItemList(response.data)
            })
    }, [])

    return (
        <>
        <div>ITEMS</div>
            {/* <Grid container spacing={3}> */}
            {itemList.map((item, index) => (
                <div>

                    {item.name}
                </div>
        //          <Card elevation={6}>
        //     <CardMedia 
        //         style={{ height: 350 }}
        //         // image={item.image} // need to check
        //         title={item.name}
                
        //     />
        //     <CardContent >
        //         <Typography gutterBottom variant="h5">{item.name}</Typography>
        //         <Box display="flex" justify="space-between">
        //             <Typography variant="subtitle1">{item.description}</Typography>
        //             <Typography gutterBottom variant="subtitle1"></Typography>
        //         </Box>
        //         <CardActions>
        //             <Button size="small" color="primary" onClick={() => window.open(item.web_url, '_blank')}>
        //                 WebSite
        //             </Button>
        //         </CardActions>
        //     </CardContent>
        // </Card>
            ))}
            <div>items</div>
            <Button variant="contained">Create a trade offer</Button>
            {/* </Grid> */}
        </>
    )
}

export default UserItemsList