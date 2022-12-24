import React, { useState } from 'react';
import axios from "axios"



import './AddItem.css';


function AddItem() {
    const [selectedFile, setSelectedFile] = useState({ imgFile: '' });
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [expDate, setExpDate] = useState('');

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
    };

    const submitForm = () => {
        const formData = {
            name: "",
            description: "",
            selectedFile: {},
            expDate: ""
        }
        console.log(name, description, selectedFile, expDate)
        formData["name"] = name;
        formData["description"] = description;
        formData["selectedFile"] = selectedFile;
        formData["expDate"] = expDate;
        console.log(formData)
        // formData.append("file", selectedFile);

        // axios
        //     .post(UPLOAD_URL, formData)
        //     .then((res) => {
        //         alert("File Upload success");
        //     })
        //     .catch((err) => alert("File Upload Error"));
    };

    return (
        <div>
            <br />
            <form>
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
                    Date:
                    <input type="datetime-local" name="name" onChange={(e) => setExpDate(e.target.value)} />
                </label>
                <br />
                <input
                    type="file"
                    label="Image"
                    name="myFile"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                />
                <br />
                <button onClick={submitForm}>Submit</button>
            </form>
        </div>
    )
}

export default AddItem