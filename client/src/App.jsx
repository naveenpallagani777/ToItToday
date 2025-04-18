import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Dashboard from "./pages/dashboard";
import { setOpenSidebar } from "./redux/slices/authSlice";
import SignupForm from "./pages/Signup";
import { ToastContainer } from 'react-toastify';

function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-x-10'
        enterTo='opacity-x-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-x-100'
        leaveTo='opacity-x-0'
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className='bg-white w-3/4 h-full relative'>
              <div className='absolute top-7 right-4'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end'
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className=''>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

function App() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          {/* Redirect based on authentication */}
          <Route index path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/log-in" />} />

          {/* Protected Routes (Accessible only if token exists) */}
          {token && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks/:status" element={<Tasks />} />
              <Route path="/trashed" element={<Trash />} />
            </>
          ) }
        </Route>

        {/* Public Routes */}
        {
          !token && (
            <>
              <Route path="/log-in" element={<Login />} />
              <Route path="/sign-up" element={<SignupForm />} />
            </>
          )
        }
         <Route path="*" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/log-in" />}/>
        
        
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
