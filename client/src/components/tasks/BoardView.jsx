import TaskCard from "./TaskCard";

/**
 * BoardView component
 * Displays a responsive grid of TaskCard components for each task.
 *
 * @param {Object} props
 * @param {Array} props.tasks - Array of task objects to display
 */
const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks?.map((task, index) => (
        // Render a TaskCard for each task, using index as key
        <TaskCard task={task} key={index} />
      ))}
    </div>
  );
};

export default BoardView;
