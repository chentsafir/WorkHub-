import { Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar, Sidebar } from "./components";
import DarkModeToggle from "./components/DarkModeToggle";
import {
  Dashboard,
  Login,
  TaskDetail,
  Tasks,
  Trash,
  Users,
  StatusPage,
  Register,
} from "./pages";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  // Get current authenticated user from redux store
  const { user } = useSelector((state) => state.auth);
  // Get current URL/location object from react-router
  const location = useLocation();

  // If user exists (logged in), render the main app layout
  // Otherwise, redirect to login page preserving current location in state
  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      {/* Sidebar shown only on md and larger screens */}
      <div className='w-1/5 h-screen bg-white dark:bg-[#1f1f1f] sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      {/* Mobile sidebar for smaller screens */}
      <MobileSidebar />

      {/* Main content area */}
      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  // Get sidebar open state from redux store
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  // Close sidebar by dispatching action to update store
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-x-10'  // NOTE: typo here; should be 'opacity-10'
        enterTo='opacity-x-100'   // NOTE: typo here; should be 'opacity-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-x-100' // typo
        leaveTo='opacity-x-0'     // typo
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={`md:hidden w-full h-full bg-black/40 transition-transform duration-700 transform
             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            onClick={() => closeSidebar()} // Clicking outside sidebar closes it
          >
            <div className='bg-white w-3/4 h-full'>
              {/* Close button top-right */}
              <div className='w-full flex justify-end px-5 pt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end'
                >
                  <IoMdClose size={25} />
                </button>
              </div>

              {/* Sidebar content */}
              <div className='-mt-10'>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

const App = () => {
  // Hardcoded theme, could be dynamic or come from context/state
  const theme = "light";

  return (
    <main className={theme}>
      <div className='w-full min-h-screen bg-[#f3f4f6] dark:bg-[#0d0d0df4]'>
        {/* Define application routes */}
        <Routes>
          {/* Protected routes rendered inside Layout */}
          <Route element={<Layout />}>
            {/* Redirect root '/' to '/dashboard' */}
            <Route index psth='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/tasks' element={<Tasks />} />
            {/* Tasks filtered by status */}
            <Route path='/completed/:status?' element={<Tasks />} />
            <Route path='/in-progress/:status?' element={<Tasks />} />
            <Route path='/todo/:status?' element={<Tasks />} />
            <Route path='/trashed' element={<Trash />} />
            <Route path='/task/:id' element={<TaskDetail />} />
            <Route path='/team' element={<Users />} />
            <Route path='/status' element={<StatusPage />} />
          </Route>

          {/* Public routes */}
          <Route path='/log-in' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>

        {/* Dark mode toggle button component */}
        <DarkModeToggle />
      </div>

      {/* Toast notification container */}
      <Toaster richColors position='top-center' />
    </main>
  );
};

export default App;
