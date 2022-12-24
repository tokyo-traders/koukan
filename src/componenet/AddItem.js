import React, { useState, useEffect } from 'react';
import axios from "axios";

import './AddItem.css';


function AddItem() {

    const [selectedFile, setSelectedFile] = useState({ imgFile: '' });
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [desire, setDesire] = useState('');
    // const [expDate, setExpDate] = useState('');
    const formData = {
        item_name: '',
        details: "",
        desire: "",
        user_id: 1,
        // selectedFile: []
    }
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setSelectedFile({ ...selectedFile, imgFile: base64 });
        formData.selectedFiles.push(selectedFile)
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const data = { item_name: name, details: description, desire: desire, user_id: 1 }
        // formData["item_name"] = name;
        // formData["details"] = description;
        // formData["desire"] = desire;
        // formData["user_id"] = 1;

        // formData.append("file", selectedFile);
        console.log(data)
        axios.post('/api/item', JSON.stringify(data),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        )
            .then((res) => {
                console.log(JSON.stringify(res.data))
                alert("Form Upload success");
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
            <br />
            <form onSubmit={submitForm}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <br />
                <label>
                    Desire:
                    <input type="text" value={desire} onChange={(e) => setDesire(e.target.value)} />
                </label>
                <br />
                {/* <input
                    type="file"
                    label="Image"
                    name="myFile"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                />
                <img src={selectedFile.imgFile} width='100px'></img> */}
                {/* {formData.selectedFiles.map(img => (
                    <div>
                        <img src={img.imgFile} width='100px'></img>
                    </div>
                ))} */}
                <br />
                <button>Submit</button>
            </form >
        </div>
    )
}

export default AddItem