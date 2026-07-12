import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },

    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setError, setLoading, setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;