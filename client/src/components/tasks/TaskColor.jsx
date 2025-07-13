import clsx from "clsx";
import React from "react";

/**
 * TaskColor component renders a small colored circle
 * used to visually represent the task's stage or category.
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes for color styling
 */
const TaskColor = ({ className }) => {
  return <div className={clsx("w-4 h-4 rounded-full", className)} />;
};

export default TaskColor;
