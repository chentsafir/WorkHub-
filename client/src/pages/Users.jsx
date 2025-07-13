import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import {
  AddUser,
  Button,
  ConfirmatioDialog,
  Loading,
  Title,
  UserAction,
} from "../components";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { getInitials } from "../utils/index";
import { useSearchParams } from "react-router-dom";

const Users = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  // Fetch users with search filter
  const { data, isLoading, refetch } = useGetTeamListsQuery({
    search: searchTerm,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false); // Delete confirmation dialog
  const [open, setOpen] = useState(false); // Add/Edit user modal
  const [openAction, setOpenAction] = useState(false); // User status change modal

  // Selected user for actions (delete, edit, status)
  const [selected, setSelected] = useState(null);

  // Handle delete button click
  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  // Handle edit button click
  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  // Handle user status toggle button click
  const userStatusClick = (user) => {
    setSelected(user);
    setOpenAction(true);
  };

  // Delete user handler
  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected).unwrap(); // unwrap to get the actual result
      toast.success(res?.message || "User deleted successfully");
      refetch();
      setSelected(null);
      setTimeout(() => setOpenDialog(false), 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error || "Failed to delete user");
    }
  };

  // User status toggle handler
  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      }).unwrap();
      toast.success(res?.message || "User status updated");
      refetch();
      setSelected(null);
      setTimeout(() => setOpenAction(false), 500);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error || "Failed to update status");
    }
  };

  // Refetch users when the AddUser modal closes (e.g., after adding/editing)
  useEffect(() => {
    if (!open) refetch();
  }, [open, refetch]);

  // Table header component
  const TableHeader = () => (
    <thead className="border-b border-gray-300 dark:border-gray-600">
      <tr className="text-black dark:text-white text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
        <th className="py-2"></th> {/* For action buttons */}
      </tr>
    </thead>
  );

  // Single row component for user
  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">{getInitials(user.name)}</span>
          </div>
          {user.name}
        </div>
      </td>
      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.role}</td>
      <td className="p-2">
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(user)}
        />

        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user._id)}
        />
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />

          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => {
              setSelected(null); // Clear selection when adding new
              setOpen(true);
            }}
          />
        </div>

        <div className="bg-white dark:bg-[#1f1f1f] px-2 md:px-4 py-4 shadow rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.map((user, index) => (
                  <TableRow key={user._id || index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AddUser modal - passes selected user data for editing */}
      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        // removed key with timestamp to avoid remount issues
      />

      {/* Confirmation dialog for deleting user */}
      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />

      {/* User status toggle dialog */}
      <UserAction open={openAction} setOpen={setOpenAction} onClick={userActionHandler} />
    </>
  );
};

export default Users;
