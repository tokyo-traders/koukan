import React, { useState, useEffect, PureComponent } from 'react';
import axios from "axios";
import _ from "lodash";
import './AddItem.css';
import { upload } from '@testing-library/user-event/dist/upload';




function AddItem() {

    const [itemName, setItemName] = useState("");
    const [details, setDetails] = useState('');
    const [desire, setDesire] = useState('');

    const uploadData = new FormData();
    const uploadImages = new FormData()
    const newItem = async (e) => {
        e.preventDefault()
        uploadData.append('item_name', itemName);
        uploadData.append('details', details);
        uploadData.append('user_id', 1);
        uploadData.append("desire", desire)
        // uploadImages.append("itemId", 85);
        // try {
        //     const sendItemInfo = await axios.post('/api/item', uploadData);
        //     let info = await sendItemInfo.json()
        //     localStorage.setItem("itemId", Number(info['id']))
        //     const id = localStorage.getItem('itemId');
        //     console.log(id)
        // }
        // catch (error) {
        //     console.log(error)
        // }

        const asyncLocalStorage = {
            setItem: async function (key, value) {
                await Promise.resolve();
                localStorage.setItem(key, value);
            },
            getItem: async function (key, value) {
                await Promise.resolve();
                localStorage.getItem(key, value);
            },
        }
        fetch('/api/item', {
            method: 'POST',
            body: uploadData,
        })
            // .then(res => res.text())
            .then(res => res.json())
            // .then(res => {
            //     // return setTimeout(() => {
            //     asyncLocalStorage.setItem("itemId", Number(res['id']))
            // })
            // .then(() => {

            //     console.log(localStorage.getItem('itemId'))
            // })
            // .then(() => {
            //     return uploadImages.append("itemId", localStorage.getItem('itemId'))
            // })
            .then(data => {
                console.log(data)
                uploadImages.append("itemId", Number(data.id))
            }
            )
            .then(() => {
                for (const value of uploadImages.values()) {
                    console.log(value)
                }
            })
            .then(() => axios.post(
                '/api/image/multiple_upload/',
                uploadImages,
            ))
            .catch(error => console.log(error))
        // let newImages = axios.post(
        //     '/api/image/multiple_upload/',
        //     uploadImages,
        // )

        // Promise.all([newImages, newItem])

        //     .catch(error => console.log(error))
        setDesire('');
        setDetails('');
        setItemName('');
    }

    const handleChange = (e) => {
        // console.log(e.target.files)
        _.forEach(e.target.files, file => {
            // console.log(file)
            uploadImages.append('images', file)
            // uploadImages.append('itemId', 85);

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