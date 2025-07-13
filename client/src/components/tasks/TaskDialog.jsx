import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTastMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmatioDialog from "../ConfirmationDialog";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import TaskColor from "./TaskColor";
import { useSelector } from "react-redux";

/**
 * CustomTransition component wraps children with Headless UI Transition,
 * providing enter and leave animations for dropdown menus.
 */
const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter='transition ease-out duration-100'
    enterFrom='transform opacity-0 scale-95'
    enterTo='transform opacity-100 scale-100'
    leave='transition ease-in duration-75'
    leaveFrom='transform opacity-100 scale-100'
    leaveTo='transform opacity-0 scale-95'
  >
    {children}
  </Transition>
);

/**
 * ChangeTaskActions component displays a dropdown menu allowing the user
 * to change the stage of a task (To-Do, In Progress, Completed).
 * 
 * @param {string} _id - The ID of the task.
 * @param {string} stage - The current stage of the task.
 */
const ChangeTaskActions = ({ _id, stage }) => {
  // Hook for triggering the API call to change the task stage.
  const [changeStage] = useChangeTaskStageMutation();

  /**
   * Handles stage change request.
   * @param {string} val - The new stage value.
   */
  const changeHanlder = async (val) => {
    try {
      const data = {
        id: _id,
        stage: val,
      };
      // Call the API and unwrap the response.
      const res = await changeStage(data).unwrap();

      // Show success toast.
      toast.success(res?.message);

      // Reload page shortly after change.
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      // Show error toast.
      toast.error(err?.data?.message || err.error);
    }
  };

  // Dropdown menu items for changing stages.
  const items = [
    {
      label: "To-Do",
      stage: "todo",
      icon: <TaskColor className='bg-blue-600' />,
      onClick: () => changeHanlder("todo"),
    },
    {
      label: "In Progress",
      stage: "in progress",
      icon: <TaskColor className='bg-yellow-600' />,
      onClick: () => changeHanlder("in progress"),
    },
    {
      label: "Completed",
      stage: "completed",
      icon: <TaskColor className='bg-green-600' />,
      onClick: () => changeHanlder("completed"),
    },
  ];

  return (
    <>
      <Menu as='div' className='relative inline-block text-left'>
        <Menu.Button
          className={clsx(
            "inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
          )}
        >
          <FaExchangeAlt />
          <span>Change Task</span>
        </Menu.Button>

        <CustomTransition>
          <Menu.Items className='absolute p-4 left-0 mt-2 w-40 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
            <div className='px-1 py-1 space-y-2'>
              {items.map((el) => (
                <Menu.Item key={el.label} disabled={stage === el.stage}>
                  {({ active }) => (
                    <button
                      disabled={stage === el.stage}
                      onClick={el?.onClick}
                      className={clsx(
                        active ? "bg-gray-200 text-gray-900" : "text-gray-900",
                        "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50"
                      )}
                    >
                      {el.icon}
                      {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </CustomTransition>
      </Menu>
    </>
  );
};

/**
 * TaskDialog component displays a menu for task options such as:
 * open, edit, add sub-task, duplicate, change stage, and delete.
 * 
 * @param {object} task - The task object to operate on.
 */
export default function TaskDialog({ task }) {
  // Get current user from Redux state.
  const { user } = useSelector((state) => state.auth);

  // Local state for controlling modals/dialogs visibility.
  const [open, setOpen] = useState(false); // AddSubTask modal
  const [openEdit, setOpenEdit] = useState(false); // Edit task modal
  const [openDialog, setOpenDialog] = useState(false); // Confirm delete dialog

  const navigate = useNavigate();

  // Mutation hooks for deleting and duplicating tasks.
  const [deleteTask] = useTrashTastMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  /**
   * Opens the confirmation dialog for deletion.
   */
  const deleteClicks = () => {
    setOpenDialog(true);
  };

  /**
   * Handles deletion of the task via API call.
   */
  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: task._id,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);

      // Close dialog and reload page shortly after deletion.
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  /**
   * Handles duplication of the task via API call.
   */
  const duplicateHanlder = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();

      toast.success(res?.message);

      // Close dialog and reload page shortly after duplication.
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // Menu items shown in the dropdown.
  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => setOpen(true),
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate className='mr-2 h-5 w-5' aria-hidden='true' />,
      onClick: () => duplicateHanlder(),
    },
  ];

  return (
    <>
      <div className=''>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300'>
            <BsThreeDots />
          </Menu.Button>

          <CustomTransition>
            <Menu.Items className='absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'>
              <div className='px-1 py-1 space-y-2'>
                {items.map((el, index) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        disabled={index === 0 ? false : !user.isAdmin}
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className='px-1 py-1'>
                <Menu.Item>
                  {/* Pass task props to ChangeTaskActions component */}
                  <ChangeTaskActions id={task._id} {...task} />
                </Menu.Item>
              </div>

              <div className='px-1 py-1'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      disabled={!user.isAdmin}
                      onClick={() => deleteClicks()}
                      className={`${
                        active ? "bg-red-100 text-red-900" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400`}
                    >
                      <RiDeleteBin6Line
                        className='mr-2 h-5 w-5 text-red-600'
                        aria-hidden='true'
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </CustomTransition>
        </Menu>
      </div>

      {/* Modals and confirmation dialogs */}
      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />
      <AddSubTask open={open} setOpen={setOpen} />
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
}
