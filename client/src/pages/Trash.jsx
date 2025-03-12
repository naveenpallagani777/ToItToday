import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { apiDelete, apiGet, apiPost } from "../utils/https";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await apiGet("/api/trash");
      setTasks(res.deletedTasks || []);
    } catch (error) {
      toast.error("Failed to fetch trashed tasks.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleConfirmAction = async () => {
    try {
      if (type === "delete" && selected) {
        await apiDelete(`/api/trash/${selected}`);
        toast.success("Task permanently deleted.");
      } else if (type === "deleteAll") {
        await apiDelete(`/api/trash/all`);
        toast.success("All trashed tasks permanently deleted.");
      } else if (type === "restore" && selected) {
        await apiPost(`/api/trash/restore/${selected}`);
        toast.success("Task restored successfully.");
      } else if (type === "restoreAll") {
        await apiPost(`/api/trash/restore/all`);
        toast.success("All trashed tasks restored.");
      }
      fetchTasks(); // Refresh the list after action
    } catch (error) {
      toast.error("Error performing action. Please try again.");
    } finally {
      setOpenDialog(false);
      setSelected("");
    }
  };

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />
          <div className="flex gap-2 md:gap-4 items-center">
            <Button label="Restore All" icon={<MdOutlineRestore />} onClick={() => {
                setType("restoreAll");
                setMsg("Do you want to restore all items in the trash?");
                setOpenDialog(true);
              }}
            />
            <Button label="Delete All" icon={<MdDelete />} onClick={() => {
                setType("deleteAll");
                setMsg("Do you want to permanently delete all items?");
                setOpenDialog(true);
              }}
            />
          </div>
        </div>
        <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <thead className="border-b border-gray-300">
                <tr className="text-black text-left">
                  <th className="py-2">Task Title</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Stage</th>
                  <th className="py-2">Modified On</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((item) => (
                    <tr key={item._id} className="border-b text-gray-600 hover:bg-gray-400/10">
                      <td className="py-2">{item.title}</td>
                      <td className="py-2 capitalize">
                        <div className="flex gap-1 items-center">
                          <span className={clsx("text-lg", PRIOTITYSTYELS[item.priority])}>{ICONS[item.priority]}</span>
                          <span>{item.priority}</span>
                        </div>
                      </td>
                      <td className="py-2 capitalize text-center md:text-start">{item.stage}</td>
                      <td className="py-2 text-sm">{new Date(item.date).toDateString()}</td>
                      <td className="py-2 flex gap-1 justify-end">
                        <Button icon={<MdOutlineRestore />} onClick={() => {
                            setSelected(item._id);
                            setType("restore");
                            setMsg("Do you want to restore this task?");
                            setOpenDialog(true);
                          }}
                        />
                        <Button icon={<MdDelete  className="text-xl text-red-600" />} onClick={() => {
                            setSelected(item._id);
                            setType("delete");
                            setMsg("Do you want to permanently delete this task?");
                            setOpenDialog(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No trashed tasks available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmatioDialog 
        type={type}
        open={openDialog} 
        setOpen={setOpenDialog} 
        msg={msg} 
        onClick={handleConfirmAction} 
      />
    </>
  );
};

export default Trash;
