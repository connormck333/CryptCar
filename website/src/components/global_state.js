import { configureStore, createSlice,  } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: "global",
    initialState: {
        data: null
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const { setData } = globalSlice.actions;

const store = configureStore({
    reducer: {
        global: globalSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

export default store;