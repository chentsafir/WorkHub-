import React from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { getCompletedSubTasks } from "../../utils";
/**
 * TaskAssets component displays a summary of task-related metadata:
 * - Number of comments/activities
 * - Number of attached assets
 * - Number of completed sub-tasks out of total
 */
const TaskAssets = ({ activities, assets, subTasks }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
        <BiMessageAltDetail />
        <span>{activities}</span>
      </div>
      <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
        <MdAttachFile />
        <span>{assets}</span>
      </div>
      <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
        <FaList />
        <span>
          {getCompletedSubTasks(subTasks)}/{subTasks?.length}
        </span>
      </div>
    </div>
  );
};

export default TaskAssets;
