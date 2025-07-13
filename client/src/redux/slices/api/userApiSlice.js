import { USERS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

/**
 * userApiSlice - injects user-related endpoints into the base apiSlice.
 * Provides mutations and queries for user profile updates, team lists,
 * task statuses, notifications, user deletion, user actions, marking notifications as read,
 * and password changes.
 */
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * updateUser mutation - updates the user profile with given data.
     * @param {Object} data - user profile data to update
     */
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * getTeamLists query - retrieves team member lists filtered by search string.
     * @param {Object} param0
     * @param {string} param0.search - search keyword to filter team members
     */
    getTeamLists: builder.query({
      query: ({ search }) => ({
        url: `${USERS_URL}/get-team?search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * getUserTaskStatus query - fetches the current user's task status.
     * Provides the 'UserTaskStatus' cache tag.
     */
    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ['UserTaskStatus'],
    }),

    /**
     * getNotifications query - fetches notifications for the current user.
     */
    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * deleteUser mutation - deletes a user by id.
     * @param {string} id - id of the user to delete
     */
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    /**
     * userAction mutation - performs an action on a user identified by id.
     * @param {Object} data - data must include 'id' and any other update details
     */
    userAction: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * markNotiAsRead mutation - marks a notification as read.
     * @param {Object} data
     * @param {string} data.type - type of the read notification action
     * @param {string} data.id - notification id
     */
    markNotiAsRead: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * changePassword mutation - changes the password for the current user.
     * @param {Object} data - contains current and new password info
     */
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for using the endpoints in React components
export const {
  useUpdateUserMutation,
  useGetTeamListsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useChangePasswordMutation,
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useGetUserTaskStatusQuery,
} = userApiSlice;
