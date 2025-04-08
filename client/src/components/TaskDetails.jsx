import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { apiGet } from "../utils/https";

const TaskDetails = ({ isOpen, onClose, id }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async (taskId) => {
      setLoading(true);
      setError(null);
      setTask(null);
      try {
        const response = await apiGet(`/api/task/${taskId}`);
        console.log("Task Details API Response:", response);
        setTask(response.task);
      } catch (error) {
        console.error("Error fetching task:", error);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && id) {
      fetchTask(id);
    }
  }, [id, isOpen]);

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                {loading ? (
                  <div className="text-center py-10">
                    <p className="text-blue-600">Loading task details...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={onClose}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                ) : !task ? (
                  <div className="text-center py-10">
                    <p className="text-red-500">Task not found!</p>
                    <button
                      onClick={onClose}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-5">
                      <Dialog.Title as="h2" className="text-2xl font-bold text-blue-800">
                        {task.title}
                      </Dialog.Title>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${task.priority === 'low' ? 'bg-blue-100 text-blue-600' :
                          task.priority === 'medium' ? 'bg-blue-200 text-blue-700' :
                          'bg-blue-300 text-blue-800'}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <p className="text-gray-600 leading-relaxed">{task.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">Stage:</span>
                          <span className={`px-2 py-1 rounded text-sm
                            ${task.stage === 'completed' ? 'bg-blue-500 text-white' :
                              task.stage === 'in-progress' ? 'bg-blue-400 text-white' :
                              'bg-blue-300 text-white'}`}>
                            {task.stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">Tag:</span>
                          <span className="bg-blue-50 px-2 py-1 rounded text-sm text-blue-600">
                            {task.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">Created:</span>
                          <span className="text-gray-600">{new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700">Last Updated:</span>
                          <span className="text-gray-600">{new Date(task.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Subtasks</h3>
                        {task.subTasks.length > 0 ? (
                          <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {task.subTasks.map((subtask) => (
                              <li
                                key={subtask._id}
                                className="flex items-center gap-3 p-2 bg-blue-50 rounded hover:bg-blue-100 transition-all duration-200"
                              >
                                <input
                                  type="checkbox"
                                  checked={subtask.isCompleted}
                                  disabled
                                  className="h-4 w-4 text-blue-600 cursor-not-allowed border-blue-300"
                                />
                                <span className={`${subtask.isCompleted ? 'line-through text-blue-400' : 'text-blue-700'}`}>
                                  {subtask.title}
                                </span>
                                <span className="ml-auto text-sm text-blue-500">
                                  {new Date(subtask.date).toLocaleDateString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-blue-600">No subtasks available</p>
                        )}
                      </div>

                      <button
                        onClick={onClose}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDetails;