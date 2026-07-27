import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";



export const store = configureStore({
    reducer:{
        [baseApi.reducerPath] : baseApi.reducer
    },

    middleware:(gDM) => 
        gDM().concat(baseApi.middleware)
    
})