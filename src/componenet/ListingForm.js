import React, { useState, useEffect, PureComponent } from 'react';
import axios from "axios";
import { ContentPasteSearchOutlined } from '@mui/icons-material';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import Box from '@mui/material/Box';
import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const BrownButton = styled(Button)(() => ({
    backgroundColor: "#4d3e38",
    borderRadius: "8px",
    color: "#def4f6",
    "&:hover": {
      background: "#332925"
    },
    // padding: "15px 36px",
    fontSize: "16px"
}));


function AddListingForm(props) {

    const {itemId} = useParams();
    const {user} = props

    const [desire, setDesire] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [priceFree, setPriceFree] = useState(false)


    const uploadData = new FormData();

    const newPost = async (e) => {
        e.preventDefault();
        uploadData.append("desire", desire);
        uploadData.append("expiration", expirationDate);
        uploadData.append("price", priceFree)
        uploadData.append("user_id", user.id)
        uploadData.append("item_id", itemId)

        fetch("/api/create-post", {
            method: "POST",
            body: uploadData,
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }

    return (
        <>
                <Box sx={{ width: '30%', margin: 'auto', marginTop: 2,display: 'flex', flexDirection: 'column' }}>
      

                <Box sx={{ marginTop: 2}}>
                <Typography >Wishlist</Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={desire}
                    onChange={(e) => setDesire(e.target.value)}
                    label="Enten something you would like to trade"
                />
                </Box>

                
                {/* <Box sx={{ marginTop: 2}}>
                <Typography >Note</Typography>
                <TextField
                    placeholder="Delivery/pickup details can be informed here"
                    fullWidth
                    multiline
                    rows={2}
                />
                </Box> */}


                <Box sx={{ marginTop: 2}}>
                {/* <Typography>Trading Option</Typography> */}
                
                <FormControlLabel
                    control={<Checkbox />} 
                    label="Give away for free" 
                    value={priceFree}
                    onChange={(e) => setPriceFree(true)} 
                    />
                <FormControlLabel 
                    control={<Checkbox />}
                    label="To trade" 
                    value={priceFree}
                    onChange={(e) => setPriceFree(false)}
                    />
                </Box>

                <Box sx={{ marginTop: 2}}>
                <Typography>Expiration Date</Typography>
                <input 
                type='datetime-local' 
                value={expirationDate} 
                onChange={(e) => setExpirationDate(e.target.value)}
                />
                </Box>    
                 
                <BrownButton
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={newPost}
                  >
                    CREATE NEW LISTING
                  </BrownButton>

            </Box>

            {/* <div className="App">
                <h3>Add Your Listing</h3>
                <label>
                    Listing details
                    <input type="text" value={desire} onChange={(e) => setDesire(e.target.value)} />
                </label>
                <br />
                <legend>Price</legend>
                <label for="free">free</label>
                <input type="checkbox" id='free' value={priceFree} onChange={(e) => setPriceFree(true)} />
                <label for="trade">swap</label>
                <input type="checkbox" id='trade' checked value={priceFree} onChange={(e) => setPriceFree(false)} />
                <br />
                <label>
                    Expiration date
                    <input type='datetime-local' value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                </label>

                <br />
                <button onClick={newPost}>New Listing</button>
            </div> */}
        </>
    )
}

export default AddListingForm