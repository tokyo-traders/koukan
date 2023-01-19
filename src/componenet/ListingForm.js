import React, { useState, useEffect, PureComponent } from 'react';
import axios from "axios";
import { ContentPasteSearchOutlined } from '@mui/icons-material';

function AddListingForm() {

    const [desire, setDesire] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [priceFree, setPriceFree] = useState(false)


    const userId = 1;
    const itemId = 177;

    const uploadData = new FormData();

    const newPost = async (e) => {
        e.preventDefault();
        uploadData.append("desire", desire);
        uploadData.append("expiration", expirationDate);
        uploadData.append("price", priceFree)
        uploadData.append("user_id", userId)
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


            <div className="App">
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
            </div>
        </>
    )
}

export default AddListingForm