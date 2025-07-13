import { createSlice } from "@reduxjs/toolkit";

/**
 * initialState - holds authentication state including user info and sidebar open status.
 * - user: retrieved from localStorage if present, otherwise null.
 * - isSidebarOpen: boolean indicating if sidebar is open.
 */
const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  isSidebarOpen: false,
};

/**
 * authSlice - Redux slice to manage authentication and UI sidebar state.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * setCredentials - saves user info to state and localStorage.
     * @param {Object} action.payload - user information object.
     */
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    /**
     * logout - clears user info from state and removes it from localStorage.
     */
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },

    /**
     * setOpenSidebar - sets the sidebar open status.
     * @param {boolean} action.payload - true to open sidebar, false to close.
     */
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

// Export actions to be dispatched in the app
export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

// Export reducer to be added to the Redux store
export default authSlice.reducer;
