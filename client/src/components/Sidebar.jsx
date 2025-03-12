import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { IoLogOutOutline } from "react-icons/io5";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks/all",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "tasks/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "tasks/in-progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    link: "tasks/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname;

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
          path === `/${el.link}` ? "bg-blue-700 text-neutral-100" : ""
        )}
      >
        {el.icon}
        <span className='hover:text-[#2564ed]'>{el.label}</span>
      </Link>
    );
  };
  return (
    <div className='w-full  h-full flex flex-col gap-6 p-5'>
      <h1 className='flex gap-1 items-center'>
        <p className='bg-blue-600 p-2 rounded-full'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </p>
        <span className='text-2xl font-extrabold text-black'>Do<span className="text-blue-800">It</span>Today</span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-5 py-8'>
        {linkData.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className=''>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
        >
          <IoLogOutOutline className='mr-2' aria-hidden='true' />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
