import {configureStore} from '@reduxjs/toolkit'
import appConfigReducer from './Slices/appConfigSlice'
import postsReducer from './Slices/postsSlice'
import feedDataReducer from './Slices/feedSlice'

export default configureStore({
    reducer: {
        appConfigReducer,
        postsReducer,
        feedDataReducer
    }
})