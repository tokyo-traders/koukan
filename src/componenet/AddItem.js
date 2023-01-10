import React, { useState, useEffect, PureComponent } from 'react';
import axios from "axios";
import $ from 'jquery';
import _ from "lodash";
import './AddItem.css';
import { upload } from '@testing-library/user-event/dist/upload';




function AddItem() {

    const [itemName, setItemName] = useState("");
    const [details, setDetails] = useState('');
    const [desire, setDesire] = useState('');

    const uploadData = new FormData();
    const uploadImages = new FormData()
    const newItem = async () => {
        uploadData.append('item_name', itemName);

        uploadData.append('details', details);
        uploadData.append('user_id', 1);

        let newItem = fetch('/api/item', {
            method: 'POST',
            body: uploadData,
        })
        const content = await newItem;

        let newImages = axios.post(
            '/api/image/multiple_upload/',
            uploadImages,
        )

        Promise.all([newImages, newItem])
            .then(res => console.log(res))
            .catch(error => console.log(error))
        setDesire('');
        setDetails('');
        setItemName('');
    }

    const handleChange = (e) => {
        // console.log(e.target.files)
        _.forEach(e.target.files, file => {
            // console.log(file)
            uploadImages.append('images', file)
            // uploadImages.append("item_id", 1)
        })
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
                <input type="file" accept="image/*" multiple onChange={handleChange} />
            </label>

            <br />
            <button onClick={newItem}>New item</button>
        </div>
    );
}

export default AddItem