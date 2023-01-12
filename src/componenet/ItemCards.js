import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { InsertEmoticon } from '@mui/icons-material';
import { iteratorSymbol } from 'immer/dist/internal';

const ItemCard = ({ item }) => {


    return (
        <Card elevation={6}>
            <CardMedia 
                style={{ height: 350 }}
                image={item.image} // need to check
                title={item.name}
                
            />
            <CardContent >
                <Typography gutterBottom variant="h5">{item.name}</Typography>
                <Box display="flex" justify="space-between">
                    <Typography variant="subtitle1">{item.description}</Typography>
                    <Typography gutterBottom variant="subtitle1"></Typography>
                </Box>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => window.open(item.web_url, '_blank')}>
                        WebSite
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
}