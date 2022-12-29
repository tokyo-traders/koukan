import React, { useState, useEffect } from 'react';
import axios from "axios";

import './AddItem.css';
import { upload } from '@testing-library/user-event/dist/upload';


function AddItem() {

    const [itemName, setItemName] = useState("");
    const [itemImage, setItemImage] = useState();
    const [details, setDetails] = useState('');
    const [desire, setDesire] = useState('');

    const newItem = async () => {
        const uploadData = new FormData();
        uploadData.append('item_name', itemName);
        uploadData.append('item_image', itemImage);
        uploadData.append('details', details);
        uploadData.append('user_id', 1);

        let newItem = await fetch('/api/item', {
            method: 'POST',
            body: uploadData
        })
            .then(res => res.json())
            .catch(error => console.log(error))

        console.log(newItem)
        setItemImage();
        setDesire('');
        setDetails('');
        setItemName('');

    }

    return (
        <div className="App">
            <h3>Add an Item</h3>
            <label>
                Title
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </label>
            <br />
            <label>
                Description:
                <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />
            </label>
            <br />
            <label>
                Desire:
                <input type="text" value={desire} onChange={(e) => setDesire(e.target.value)} />
            </label>
            <br />
            <label>
                Image
                <input type="file" onChange={(e) => setItemImage(e.target.files[0])} />
            </label>
            <br />
            <button onClick={() => newItem()}>New item</button>
        </div>
    );
}

export default AddItem