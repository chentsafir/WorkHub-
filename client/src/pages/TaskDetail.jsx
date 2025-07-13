import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getCompletedSubTasks,
  getInitials,
} from "../utils";

const assets = [
  // List of image URLs representing task assets
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  // Icons corresponding to priority levels
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  // Background colors for priority badges
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  // Tab configuration for Task Detail and Activities views
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  // Icons for different activity types
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  // Possible activity types for selection
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

/**
 * Activities component displays list of task activities and a form to add new activities.
 * @param {Object} props - Props object
 * @param {Array} props.activity - List of existing activities
 * @param {string} props.id - Task ID
 * @param {Function} props.refetch - Function to refresh data
 */
const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started"); // Selected activity type
  const [text, setText] = useState(""); // Input text for new activity

  const [postActivity, { isLoading }] = usePostTaskActivityMutation(); // API mutation hook for posting activities

  /**
   * Handle submitting new activity to the API.
   */
  const handleSubmit = async () => {
    try {
      const data = {
        type: selected?.toLowerCase(), // normalize selected type
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();

      setText(""); // Clear textarea on success
      toast.success(res?.message); // Show success notification
      refetch(); // Refresh activities list
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error); // Show error notification
    }
  };

  /**
   * Card component to display single activity entry.
   * @param {Object} props - Props
   * @param {Object} props.item - Activity item data
   */
  const Card = ({ item }) => {
    return (
      <div className={`flex space-x-4`}>
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TASKTYPEICON[item?.type]} {/* Display icon based on activity type */}
          </div>
          <div className='h-full flex items-center'>
            <div className='w-0.5 bg-gray-300 h-full'></div> {/* Vertical line between cards */}
          </div>
        </div>

        <div className='flex flex-col gap-y-1 mb-8'>
          <p className='font-semibold'>{item?.by?.name}</p> {/* Activity author */}
          <div className='text-gray-500 space-x-2'>
            <span className='capitalize'>{item?.type}</span>
            <span className='text-sm'>{moment(item?.date).fromNow()}</span> {/* Relative time */}
          </div>
          <div className='text-gray-700'>{item?.activity}</div> {/* Activity description */}
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
      <div className='w-full md:w-1/2'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>Activities</h4>
        <div className='w-full space-y-0'>
          {activity?.map((item, index) => (
            <Card
              key={index}
              item={item}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>
          Add Activity
        </h4>
        <div className='w-full flex flex-wrap gap-5'>
          {act_types.map((item) => (
            <div key={item} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type ......'
            className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          ></textarea>
          {isLoading ? (
            <Loading /> // Show loading spinner when posting activity
          ) : (
            <Button
              type='button'
              label='Submit'
              onClick={handleSubmit}
              className='bg-blue-600 text-white rounded'
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * TaskDetail component fetches and displays a single task with its details, sub-tasks, and activities.
 */
const TaskDetail = () => {
  const { id } = useParams(); // Extract task ID from URL params
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id); // Fetch task data
  const [subTaskAction, { isLoading: isSubmitting }] =
    useChangeSubTaskStatusMutation(); // Mutation hook for sub-task status change

  const [selected, setSelected] = useState(0); // Current tab index (0 = Task Detail, 1 = Activities)
  const task = data?.task || []; // Task data or empty array

  /**
   * Toggle sub-task completion status and update via API.
   * @param {Object} el - Sub-task object with id, subId, and status
   */
  const handleSubmitAction = async (el) => {
    try {
      const data = {
        id: el.id,
        subId: el.subId,
        status: !el.status, // Toggle status
      };
      const res = await subTaskAction({
        ...data,
      }).unwrap();

      toast.success(res?.message); // Show success toast
      refetch(); // Refresh task data
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error); // Show error toast
    }
  };

  if (isLoading)
    <div className='py-10'>
      <Loading /> {/* Show loading spinner while fetching */}
    </div>;

  // Calculate percentage of completed sub-tasks
  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      {/* task title */}
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto'>
              <div className='w-full md:w-1/2 space-y-8'>
                {/* Priority and stage badges */}
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[task?.priority]}</span>
                    <span className='uppercase'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className='text-black uppercase'>{task?.stage}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  Created At: {new Date(task?.date).toDateString()} {/* Task creation date */}
                </p>

                {/* Assets and sub-task count */}
                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>
                  <span className='text-gray-400'>|</span>
                  <div className='space-x-2'>
                    <span className='font-semibold'>Sub-Task :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                {/* Task team list */}
                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    TASK TEAM
                  </p>
                  <div className='space-y-3'>
                    {task?.team?.map((m, index) => (
                      <div
                        key={index + m?._id}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className='text-center'>
                            {getInitials(m?.name)} {/* Team member initials */}
                          </span>
                        </div>
                        <div>
                          <p className='text-lg font-semibold'>{m?.name}</p>
                          <span className='text-gray-500'>{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-task list and status toggles */}
                {task?.subTasks?.length > 0 && (
                  <div className='space-y-4 py-6'>
                    <div className='flex items-center gap-5'>
                      <p className='text-gray-500 font-semibold text-sm'>
                        SUB-TASKS
                      </p>
                      <div
                        className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
                          percentageCompleted < 50
                            ? "bg-rose-600"
                            : percentageCompleted < 80
                            ? "bg-amber-600"
                            : "bg-emerald-600"
                        }`}
                      >
                        <p>{percentageCompleted.toFixed(2)}%</p> {/* Completion percentage */}
                      </div>
                    </div>
                    <div className='space-y-8'>
                      {task?.subTasks?.map((el, index) => (
                        <div key={index + el?._id} className='flex gap-3'>
                          <div
                            onClick={() => handleSubmitAction(el)}
                            className={`cursor-pointer w-6 h-6 rounded-full flex items-center justify-center ${
                              el.status
                                ? "bg-green-500 text-white"
                                : "border border-gray-400"
                            }`}
                          >
                            {el.status && <MdTaskAlt />} {/* Checkmark if completed */}
                          </div>
                          <div
                            className={clsx(
                              "flex items-center gap-4 flex-1",
                              el.status ? "line-through" : ""
                            )}
                          >
                            <p className='text-gray-600'>{el.title}</p>
                            <p className='text-gray-400 text-xs'>
                              {moment(el.date).fromNow()} {/* Sub-task relative time */}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Task description and assets display */}
              <div className='w-full md:w-1/2 space-y-4'>
                <p className='text-gray-700'>{task?.description}</p>

                <div className='flex flex-wrap gap-5'>
                  {task?.assets?.map((img, index) => (
                    <div
                      key={index}
                      className='w-48 h-32 overflow-hidden rounded-md'
                    >
                      <img
                        src={img}
                        alt='img'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <Activities
            activity={task?.activity}
            id={id}
            refetch={refetch}
          /> /* Show Activities tab */
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;
