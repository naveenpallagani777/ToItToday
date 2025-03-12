import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import AddTask from "./AddTask";
import { apiPut, apiDelete } from "../../utils/https";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks, onUpdate }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null); // Tracks task being edited

  const deleteHandler = async () => {
    if (!selectedTask) return;
    try {
      const res = await apiDelete(`/api/task/${selectedTask._id}`);
      if (res?.status === "success") {
        toast.success("Task deleted successfully!", { position: "top-right" });
        onUpdate();
      } else {
        toast.error("Failed to delete task!");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task!");
    } finally {
      setOpenDialog(false);
      setSelectedTask(null);
    }
  };

  const handleEditTaskSubmit = async (updatedTask) => {
    if (!editTask) return;
    try {
      await apiPut(`/api/task/${editTask._id}`, updatedTask);
      toast.success("Task updated successfully!");
      onUpdate();
    } catch (error) {
      toast.error("Failed to update task!");
      console.error(error);
    } finally {
      setEditTask(null);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">SubTasks</th>
        <th className="py-2">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <>
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
        <td className="py-2">
          <div className="flex items-center gap-2">
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
            <p className="w-full line-clamp-2 text-base text-black">{task?.title}</p>
          </div>
        </td>
        <td className="py-2">
          <div className="flex gap-1 items-center">
            <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
              {ICONS[task?.priority]}
            </span>
            <span className="capitalize line-clamp-1">{task?.priority} Priority</span>
          </div>
        </td>
        <td className="py-2">
          <span className="text-sm text-gray-600">{formatDate(new Date(task?.createdAt))}</span>
        </td>
        <td className="py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>
        </td>
        <td className="py-2 flex gap-2 md:gap-4 justify-end">
          <Link target="_blank" to={`/task/${task._id}`}>
            <Button
              className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
              label="Open"
              type="button"
            />
          </Link>
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Edit"
            type="button"
            onClick={() => setEditTask(task)}
          />
          <Button
            className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => {
              setSelectedTask(task);
              setOpenDialog(true);
            }}
          />
        </td>
      </tr>
    </>
  );

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Task Modal */}
      {editTask && (
        <AddTask open={!!editTask} setOpen={() => setEditTask(null)} task={editTask} onTaskSubmit={handleEditTaskSubmit} />
      )}
      {/* Delete Confirmation Dialog */}
      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </>
  );
};

export default Table;
