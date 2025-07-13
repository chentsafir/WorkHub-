import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import { getInitials } from "../utils";
import AddUser from "./AddUser";
import ChangePassword from "./ChangePassword";

/**
 * * UserAvatar component
 * Displays a user avatar with dropdown menu containing options:
 * - View/edit profile
 * - Change password
 * - Logout
 * Fetches user data from Redux store, and handles logout.
 */
const UserAvatar = () => {
  // State to control open/close of modals
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  // Get current logged-in user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Hook for logout API request
  const [logoutUser] = useLogoutMutation();

  // Redux dispatcher to clear user data on logout
  const dispatch = useDispatch();

  // React Router navigation
  const navigate = useNavigate();

  /**
   * * Handle user logout
   * Calls API to logout, clears Redux state, and redirects to login page.
   */
  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/log-in");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className=''>
        {/* Dropdown menu for user actions */}
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            {/* Menu button: displays user initials */}
            <Menu.Button className='w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600'>
              <span className='text-white font-semibold'>
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          {/* Transition animation for opening/closing the dropdown */}
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-[#1f1f1f] shadow-2xl ring-1 ring-black/5 focus:outline-none'>
              <div className='p-4'>
                {/* Menu item: open profile modal */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className='text-gray-700 dark:text-gray-300 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                {/* Menu item: open change password modal */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className='text-gray-700 dark:text-gray-300 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                {/* Menu item: logout */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className='text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Modal to edit user profile */}
      <AddUser open={open} setOpen={setOpen} userData={user} />

      {/* Modal to change password */}
      <ChangePassword open={openPassword} setOpen={setOpenPassword} />
    </>
  );
};

export default UserAvatar;
