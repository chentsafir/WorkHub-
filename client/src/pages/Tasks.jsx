import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

/**
 * Tasks component renders task list with two views: board and list.
 * It supports filtering by status from URL params and search query.
 * Admin users can create new tasks via a modal.
 */
const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth); // Get current user info
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || ""); // Get search term from URL

  const [selected, setSelected] = useState(0); // Selected tab index
  const [open, setOpen] = useState(false); // Controls AddTask modal open state

  const status = params?.status || ""; // Get task status filter from URL params

  // Fetch tasks based on status filter and search term
  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });

  // Refetch tasks and scroll to top when AddTask modal open state changes
  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [open]);

  if (isLoading)
    return (
      <div className="py-10">
        <Loading />
      </div>
    );

  return (
    <div className="w-full">
      {/* Header with title and Create Task button for admin users */}
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && user?.isAdmin && (
          <Button
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div>
        {/* Tabs to switch between board and list views */}
        <Tabs tabs={TABS} setSelected={setSelected}>
          {/* Show task status titles if no status filter is active */}
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="To Do" className={TASK_TYPE.todo} />
              <TaskTitle
                label="In Progress"
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label="Completed" className={TASK_TYPE.completed} />
            </div>
          )}

          {/* Conditionally render BoardView or Table based on selected tab */}
          {selected === 0 ? (
            <BoardView tasks={data?.tasks} />
          ) : (
            <Table tasks={data?.tasks} />
          )}
        </Tabs>
      </div>

      {/* Modal component for adding new tasks */}
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
