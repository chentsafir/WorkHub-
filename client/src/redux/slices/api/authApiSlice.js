import { USERS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

/**
 * authApiSlice - injects authentication related endpoints into the base apiSlice.
 * Provides mutations for login, register, and logout.
 */
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * login mutation - sends POST request to /login endpoint with user credentials.
     * @param {Object} data - login data (e.g. email and password)
     */
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include", // include cookies for authentication
      }),
    }),
    
    /**
     * register mutation - sends POST request to /register endpoint with new user data.
     * @param {Object} data - registration data (e.g. name, email, password)
     */
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    
    /**
     * logout mutation - sends POST request to /logout endpoint to log the user out.
     */
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
