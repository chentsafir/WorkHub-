import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { updateURL } from "../utils";

/**
 * Navbar component with search input and sidebar toggle.
 * Handles search term state synced with URL query.
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Current route info
  const navigate = useNavigate(); // Navigate programmatically
  const [searchParams] = useSearchParams(); // Read URL query params

  // State for search input, initialized from URL param "search"
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Sync URL with searchTerm changes
  useEffect(() => {
    updateURL({ searchTerm, navigate, location });
  }, [searchTerm]);

  // Prevent default form submit and reload page on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <div className='flex justify-between items-center bg-white dark:bg-[#1f1f1f] px-4 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className='flex gap-4'>
        <div className=''>
          {/* Sidebar toggle button visible only on small screens */}
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className='text-2xl text-gray-500 block md:hidden'
          >
            ☰
          </button>
        </div>

        {/* Show search input only if not on dashboard */}
        {location?.pathname !== "/dashboard" && (
          <form
            onSubmit={handleSubmit}
            className='w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6] dark:bg-[#1c1c1c]'
          >
            {/* Search icon */}
            <MdOutlineSearch className='text-gray-500 text-xl' />

            {/* Search input controlled by searchTerm state */}
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              type='text'
              placeholder='Search...'
              className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
            />
          </form>
        )}
      </div>

      <div className='flex gap-2 items-center'>
        {/* Notifications dropdown */}
        <NotificationPanel />

        {/* User profile avatar */}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
