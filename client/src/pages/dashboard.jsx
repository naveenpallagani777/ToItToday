import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { apiGet } from "../utils/https"; // Ensure correct API utility import
import { Chart } from "../components/Chart";
// import TaskTable from "../components/"; // Ensure TaskTable is imported
import clsx from "clsx";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await apiGet("/api/task");
      console.log("Tasks API Response:", res);
      setTasks(res.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!tasks.length) return <p className="text-center text-gray-500">No tasks found.</p>;

  // Process task summary from tasks API
  const taskSummary = {
    totalTasks: tasks.length,
    completed: tasks.filter(task => task.stage === "completed").length,
    inProgress: tasks.filter(task => task.stage === "in-progress").length,
    todo: tasks.filter(task => task.stage === "todo").length,
  };

  const stats = [
    { _id: "1", label: "TOTAL TASK", total: taskSummary.totalTasks, icon: <FaNewspaper />, bg: "bg-[#1d4ed8]" },
    { _id: "2", label: "COMPLETED TASK", total: taskSummary.completed, icon: <MdAdminPanelSettings />, bg: "bg-[#0f766e]" },
    { _id: "3", label: "TASK IN PROGRESS", total: taskSummary.inProgress, icon: <LuClipboardEdit />, bg: "bg-[#f59e0b]" },
    { _id: "4", label: "TODOS", total: taskSummary.todo, icon: <FaArrowsToDot />, bg: "bg-[#be185d]" },
  ];

  return (
    <div className='h-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats.map(({ icon, bg, label, total }, index) => (
          <div key={index} className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
            <div className='h-full flex flex-1 flex-col justify-between'>
              <p className='text-base text-gray-600'>{label}</p>
              <span className='text-2xl font-semibold'>{total}</span>
            </div>
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>{icon}</div>
          </div>
        ))}
      </div>

      {/* Chart by Priority */}
      <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className='text-xl text-gray-600 font-semibold'>Chart by Priority</h4>
        <Chart tasks={tasks} />
      </div>

      {/* Task Table */}
      {/* <TaskTable tasks={tasks} /> */}
    </div>
  );
};

export default Dashboard;
