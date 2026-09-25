import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userDetails",
  initialState: {
    userData: null,
    loading: true, // Default true rahega taaki auth check hone se pehle login na dikhe
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false; // User mil gaya ya null set hua, toh loading band
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;