import React, { useState } from 'react';
import axios from "axios"



import './AddItem.css';


function AddItem() {

    const [selectedFile, setSelectedFile] = useState({ imgFile: '' });
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [expDate, setExpDate] = useState('');
    const formData = {
        name: "",
        description: "",
        selectedFiles: []
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

    const submitForm = () => {

        console.log(name, description, formData.selectedFiles)
        formData["name"] = name;
        formData["description"] = description;
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
                <input
                    type="file"
                    label="Image"
                    name="myFile"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                />
                <img src={selectedFile.imgFile} width='100px'></img>
                {/* {formData.selectedFiles.map(img => (
                    <div>
                        <img src={img.imgFile} width='100px'></img>
                    </div>
                ))} */}
                <br />
                <button onClick={submitForm}>Submit</button>
            </form>
        </div>
    )
}

export default AddItem