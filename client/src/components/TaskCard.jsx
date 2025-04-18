import clsx from "clsx";
import React, { useState } from "react";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import UserInfo from "./UserInfo";
import { IoMdAdd } from "react-icons/io";
import AddSubTask from "./task/AddSubTask";
import { apiPut } from "../utils/https";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, onUpdate, setId }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleEditTaskSubmit = (updatedTask) => {
      console.log("Edit Task:", updatedTask);
      apiPut(`/api/task/${task._id}`, updatedTask);
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
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>

          <TaskDialog task={task} onUpdate={onUpdate} setId={setId}/>
        </div>

        <div className="py-3">
          <div className='flex items-center gap-2 mb-2'>
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
            />
            <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
          </div>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(task?.createdAt))}
          </span>
        </div>

        <div className='py-3 border-t border-gray-200'>
            <h5 className='text-base line-clamp-3 text-black'>
              {task?.description}
            </h5>

            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600'>
                {formatDate(new Date(task?.completedAt))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded0full text-blue-700 font-medium'>
                {task?.tag}
              </span>
            </div>
          </div>

        <div className='w-full pb-2 flex justify-between items-center'>
          <button
            onClick={() => setOpen(true)}
            disabled={user.isAdmin ? false : true}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled::text-gray-300'
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>

          <div className='flex gap-1 items-center text-sm text-gray-600 '>
            <FaList />
            <span>
              {task?.subTasks?.filter(subTask => subTask.isCompleted).length}/{task?.subTasks?.length}
            </span>
          </div>
        </div>
      </div>

      <AddSubTask
        onSubTaskSubmit={handleAddSubTask}
        open={open}
        task={task}
        setOpen={setOpen}
      />
    </>
  );
};

export default TaskCard;
