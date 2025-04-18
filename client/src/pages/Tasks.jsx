import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { toast } from "react-toastify";
import { apiGet, apiPost } from "../utils/https";
import TaskDetails from "../components/TaskDetails";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const { status } = useParams(); // Get status from URL
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [id, setId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await apiGet("/api/task");
      let filteredTasks = res.tasks || [];

      if (status !== "all") {
        filteredTasks = filteredTasks.filter(task => task.stage === status);
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTaskSubmit = async (task) => {
    try {
      await apiPost("/api/task", task);
      toast.success("Task added successfully!", { position: "top-right" });
      fetchTasks();
    } catch (error) {
      toast.error("Failed to add task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [status]); // Refetch tasks when the status changes

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        <Button
          onClick={() => setOpen(true)}
          label="Create Task"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        />
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={tasks} setId={setId} onUpdate={fetchTasks} />
        ) : (
          <div className="w-full">
            <Table tasks={tasks} onUpdate={fetchTasks} setId={setId} />
          </div>
        )}
      </Tabs>
      <TaskDetails isOpen={id !== null} onClose={() => { setId(null) }} id={id} />
      <AddTask open={open} setOpen={setOpen} onTaskSubmit={handleNewTaskSubmit} />
    </div>
  );
};
// Example usage
export default Tasks;
