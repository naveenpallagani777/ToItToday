import clsx from "clsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdTaskAlt,
} from "react-icons/md";
import Tabs from "../components/Tabs";
import Loading from "../components/Loader";
import Button from "../components/Button";
import { apiGet } from "../utils/https";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [{ title: "Task Detail", icon: <FaTasks /> }];

const TaskDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await apiGet(`/api/task/${id}`);
        console.log("Task Details API Response:", response);
        setTask(response.task);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <Loading />;
  if (!task) return <p className="text-red-500">Task not found!</p>;

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <Tabs tabs={TABS}>
        <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">
          <div className="w-full">
            {/* Task Priority & Stage */}
            <div className="flex items-center gap-5">
              <div
                className={clsx(
                  "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                  bgColor[task.priority] || "bg-gray-200"
                )}
              >
                <span className="text-lg">{ICONS[task.priority]}</span>
                <span className="uppercase">{task.priority} Priority</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300" />
                <span className="text-black uppercase">{task.stage}</span>
              </div>
            </div>

            {/* Task Info */}
            <p className="text-gray-500 mt-2">
              Created At:{" "}
              <span className="ml-2">
                {new Date(task.createdAt).toDateString()}
              </span>
            </p>

            {/* Task Title & Description */}
            <div className="mt-4">
              <p className="text-gray-500 font-bold text-xl">TITLE</p>
              <p className="text-gray-700">{task.title}</p>
            </div>

            <div className="mt-2">
              <p className="text-gray-500 font-bold text-xl">DESCRIPTION</p>
              <p className="text-gray-700">{task.description}</p>
            </div>

            {/* Subtasks */}
            <div className="">
              <p className="text-gray-500 font-bold text-xl mt-2">SUB-TASKS</p>
              {task.subTasks.length > 0 ? (
                <div className="space-y-2">
                  {task.subTasks.map((el, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
                        <MdTaskAlt className="text-violet-600" size={26} />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(el.date).toDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{el.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No sub-tasks available.</p>
              )}
            </div>

            {/* Mark As Complete Button */}
            {!task.isCompleted && (
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => console.log("Mark as complete")}
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md flex items-center gap-4"
                >
                  <MdTaskAlt className="text-white" size={26} />
                  Mark As Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default TaskDetails;
