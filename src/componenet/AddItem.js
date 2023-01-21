import React, { useState, useEffect, PureComponent, useCallback } from 'react';
import axios from "axios";
import _ from "lodash";
import useAxiosPrivate from "./hooks/axiosPrivate"
import { upload } from '@testing-library/user-event/dist/upload';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { spacing } from '@mui/system';

const RoundedButton = styled(Button)(() => ({
    borderRadius: 35,
    backgroundColor: "#D904B5",
    color: "#46C8F5",
    fontSize: "1rem",
    display: "block"
}));




function AddItem(props) {

    const { user } = props
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/MyPage"
    const mypage = useCallback(() => navigate("/MyPage", { replace: true }), [navigate]);
    const goBack = useCallback(() => {
        navigate(from, { replace: true })
    }, [navigate]);


    const [itemName, setItemName] = useState("");
    const [details, setDetails] = useState('');
    const [desire, setDesire] = useState('');


    const uploadData = new FormData();
    const uploadImages = new FormData()
    const newItem = async (e) => {
        e.preventDefault()
        uploadData.append('item_name', itemName);
        uploadData.append('details', details);
        uploadData.append('user_id', user.id);
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

        // const asyncLocalStorage = {
        //     setItem: async function (key, value) {
        //         await Promise.resolve();
        //         localStorage.setItem(key, value);
        //     },
        //     getItem: async function (key, value) {
        //         await Promise.resolve();
        //         localStorage.getItem(key, value);
        //     },
        // }
        console.log(uploadData)
        fetch(`/api/item/${user.id}`, {
            method: 'POST',
            body: uploadData,
            // headers: { 'Content-Type': 'application/json'}
        })
            .then(res => res.json())
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
        // mypage();
    }



    const handleChange = (e) => {
        // console.log(e.target.files)
        _.forEach(e.target.files, file => {
            console.log(file)
            uploadImages.append('images', file)
            // uploadImages.append('itemId', 85);

            // uploadImages.append("item_id", 1)
        })
    }
    return (
        <Box sx={{ width: '30%', margin: 'auto', marginTop: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography>Item Name</Typography>
            <TextField
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />

            <Box sx={{ marginTop: 2 }}>
                <Typography>Description</Typography>
                <TextField
                    fullWidth
                    value={details}
                    multiline
                    rows={4}
                    onChange={(e) => setDetails(e.target.value)}
                />
            </Box>

            {/* <Box sx={{ marginTop: 2}}>
                <Typography>Desire</Typography>
                <TextField 
                    fullWidth
                    value={desire}
                    multiline
                    rows={2}
                    onChange={(e) => setDesire(e.target.value)}
                />
                </Box> */}

            <Box sx={{ marginTop: 2 }}>
                <Typography>Image</Typography>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                />
            </Box>

            <RoundedButton
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={newItem}
            >
                Add Item
            </RoundedButton>

            <RoundedButton
                width="80%"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={goBack}
            >
                Go Back
            </RoundedButton>

        </Box>
    );

    // return (
    //     <div className="App">
    //         <h3>Add an Item</h3>
    //         <label>
    //             Title
    //             <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
    //         </label>
    //         <br />
    //         <label>
    //             Description:
    //             <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />
    //         </label>
    //         <br />
    //         <label>
    //             Desire:
    //             <input type="text" value={desire} onChange={(e) => setDesire(e.target.value)} />
    //         </label>
    //         <br />
    //         <label>
    //             Image
    //             <input type="file" accept="image/*" multiple onChange={handleChange} />
    //         </label>

    //         <br />
    //         <button onClick={newItem}>New item</button>
    //         <button onClick={goBack}>Go Back</button>
    //     </div>
    // );
}

export default AddItem