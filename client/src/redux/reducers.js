import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emailUid: null,
  privilege : null,
  familyName : null
};

const googleUserSlice = createSlice({
  name: 'googleUser',
  initialState,
  reducers: {
    setEmailUid: (state, action) => {
      state.emailUid = action.payload;
    },
    setFamilyName : (state,action) => {
      state.familyName = action.payload;
    },
    setPrivilege : (state,action) => {
      state.privilege = action.payload;
    }
  },
});

export const { setEmailUid } = googleUserSlice.actions;
export const { setFamilyName } = googleUserSlice.actions;
export const { setPrivilege } = googleUserSlice.actions;
export default googleUserSlice.reducer;