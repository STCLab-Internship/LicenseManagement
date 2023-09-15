import { configureStore } from '@reduxjs/toolkit';
import googleUserReducer from './reducers';

const store = configureStore({
  reducer: {
    googleUser: googleUserReducer,
  },
});

export default store;