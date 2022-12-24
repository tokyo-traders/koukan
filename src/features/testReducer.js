import { createSlice } from "@reduxjs/toolkit"


const testReducerSlice = createSlice({
    name: "testReducer",
    initialState: { value: { name: '', email: '' } },
    reducers: {
        show: (state, action) => {
            state.value = action.payload
        },
    }
})