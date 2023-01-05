import React, { useState, useEffect } from 'react';
import axios from "axios";
import _ from "lodash";
import './AddItem.css';
import { upload } from '@testing-library/user-event/dist/upload';


function AddItem() {

    const [itemName, setItemName] = useState("");
    const [itemImageObj, setItemImageObj] = useState([]);
    const [itemImageArr, setItemImageArr] = useState([]);

    const [details, setDetails] = useState('');
    const [desire, setDesire] = useState('');


    const uploadData = new FormData();
    const newItem = async () => {
        uploadData.append('item_name', itemName);
        uploadData.append('item_image', itemImageArr);
        uploadData.append('details', details);
        uploadData.append('user_id', 1);
        let newItem = await fetch('/api/item', {
            method: 'POST',
            body: uploadData
        })
            .then(res => res.json())
            .catch(error => console.log(error))
        // for (let key in uploadData) {
        //     console.log(key);
        // }
        // console.log(itemImageArr)
        setItemImageArr([]);
        setDesire('');
        setDetails('');
        setItemName('');

    }

    const handleChange = (e) => {
        // let imgs = []
        _.forEach(e.target.files, file => {
            uploadData.append('item_image', file)
        })
        setItemImageArr(itemImageArr)
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
                <input type="file" onChange={handleChange} multiple />
            </label>
            <img src={itemImageArr?.url} />
            <br />
            <button onClick={() => newItem()}>New item</button>
        </div>
    );
}

export default AddItem