import { TASKS_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

/**
 * postApiSlice - injects task-related endpoints into the base apiSlice.
 * Provides queries and mutations for creating, updating, duplicating,
 * trashing, deleting/restoring tasks, managing subtasks, activities, and stats.
 */
export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * createTask mutation - creates a new task with provided data.
     * @param {Object} data - task details
     */
    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * duplicateTask mutation - duplicates a task by id.
     * @param {string} id - task id to duplicate
     */
    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    /**
     * updateTask mutation - updates an existing task by id.
     * Invalidates 'UserTaskStatus' cache tag.
     * @param {Object} data - updated task data (must include _id)
     */
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/update/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ['UserTaskStatus'],
    }),

    /**
     * getAllTask query - fetches all tasks filtered by stage, trash status and search.
     * @param {Object} params - filters for query
     * @param {string} params.strQuery - task stage filter
     * @param {string} params.isTrashed - trash filter
     * @param {string} params.search - search keyword
     */
    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => ({
        url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * getSingleTask query - fetches single task by id.
     * @param {string} id - task id
     */
    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * createSubTask mutation - adds a subtask to a task by task id.
     * @param {Object} param0
     * @param {Object} param0.data - subtask data
     * @param {string} param0.id - parent task id
     */
    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * postTaskActivity mutation - posts activity data to a task.
     * @param {Object} param0
     * @param {Object} param0.data - activity details
     * @param {string} param0.id - task id
     */
    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * trashTast mutation - marks a task as trashed by id.
     * @param {Object} param0
     * @param {string} param0.id - task id
     */
    trashTast: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    /**
     * deleteRestoreTast mutation - deletes or restores a task by id and action type.
     * @param {Object} param0
     * @param {string} param0.id - task id
     * @param {string} param0.actionType - action to perform ("delete" or "restore")
     */
    deleteRestoreTast: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    /**
     * getDasboardStats query - fetches dashboard statistics related to tasks.
     */
    getDasboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
      }),
    }),

    /**
     * changeTaskStage mutation - changes the stage of a task by id.
     * @param {Object} data - must include id and new stage value
     */
    changeTaskStage: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-stage/${data?.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    /**
     * changeSubTaskStatus mutation - changes the status of a subtask.
     * @param {Object} data - must include id (task id), subId (subtask id), and new status
     */
    changeSubTaskStatus: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/change-status/${data?.id}/${data?.subId}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  usePostTaskActivityMutation,
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useCreateSubTaskMutation,
  useTrashTastMutation,
  useDeleteRestoreTastMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useGetSingleTaskQuery,
  useGetDasboardStatsQuery,
  useChangeTaskStageMutation,
  useChangeSubTaskStatusMutation,
} = postApiSlice;
