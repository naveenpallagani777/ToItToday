import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import AddSubTask from "./AddSubTask";
import ConfirmatioDialog from "../Dialogs";
import { apiDelete, apiPut } from "../../utils/https";
import { toast } from "sonner";

const TaskDialog = ({ task, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  if (!task) {
    return null; // Prevents errors if task is undefined
  }

  const id = task._id;

  const duplicateHandler = () => {
    console.log("Duplicate task:", task);
    // Implement duplication logic here
  };

  const deleteClicks = async () => {
    try {
      const res = await apiDelete(`/api/task/${id}`);
      if (res?.status === "success") {
        toast.success("Task deleted successfully!", { position: "top-right" });
        onUpdate()
      } else {
        toast.error("Failed to delete task!");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task!");
    }
  };

  const items = [
    // {
    //   label: "Open Task",
    //   icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
    //   onClick: () => navigate(`/task/${id}`),
    // },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpen(true),
    },
  ];

  const handleEditTaskSubmit = (updatedTask) => {
    console.log("Edit Task:", updatedTask);
    apiPut(`/api/task/${id}`, updatedTask);
    onUpdate();
  };

  const handleAddSubTask = (subTask) => {
    const updatedTask = {
      ...task,
      subTasks: [...(task.subTasks || []), subTask],
    };
    handleEditTaskSubmit(updatedTask);
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <Link target="_blank" to={`/task/${id}`}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                      Open Task
                    </button>
                  )}
                </Menu.Item>
              </Link>

              <div className="px-1 py-1 space-y-2">
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenDialog(true)}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line
                        className="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        onTaskSubmit={handleEditTaskSubmit}
      />

      <AddSubTask
        onSubTaskSubmit={handleAddSubTask}
        open={open}
        task={task}
        setOpen={setOpen}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteClicks} // Pass delete function to dialog
      />
    </>
  );
};

export default TaskDialog;
