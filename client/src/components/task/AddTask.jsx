import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import Button from "../Button";
import { use } from "react";

const LISTS = ["TODO", "IN-PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const AddTask = ({ open, setOpen, onTaskSubmit, task }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [stage, setStage] = useState(LISTS[1]);
  const [priority, setPriority] = useState(PRIORITY[0]);
  const [subTaskInput, setSubTaskInput] = useState({ title: "", isCompleted: false });
  const [subTasks, setSubTasks] = useState([]);

  const handleAddSubTask = () => {
    if (subTaskInput.title.trim() !== "") {
      setSubTasks([...subTasks, { ...subTaskInput, date: new Date() }]);
      setSubTaskInput({ title: "", isCompleted: false });
    }
  };

  const handleDeleteSubTask = (e, index) => {
    e.preventDefault();
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (index) => {
    setSubTasks(subTasks.map((task, i) => (i === index ? { ...task, isCompleted: !task.isCompleted } : task)));
  };

  const submitHandler = (data) => {
    if (!data.title || !data.description) return;

    const newTask = {
      title: data.title,
      description: data.description,
      priority: priority.toLowerCase(),
      stage: stage.toLowerCase(),
      subTasks: subTasks,
      isCompleted: false,
      completedAt: null,
      tag: "bugfix",
    };

    onTaskSubmit(newTask);
    reset();
    setSubTasks([]);
    setOpen(false);
  };

  useEffect(() => {
    if (task) {
      reset(task);
      setStage(task.stage);
      setPriority(task.priority);
      setSubTasks(task.subTasks);
    }
  }, [task]);


  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
          Add New Task
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder="Task Description"
            type="text"
            name="description"
            label="Task Description"
            className="w-full rounded"
            register={register("description", { required: "Description is required" })}
            error={errors.description ? errors.description.message : ""}
          />

          <div className="flex gap-4">
            <SelectList label="Task Stage" lists={LISTS} selected={stage} setSelected={setStage} />
            <SelectList label="Priority Level" lists={PRIORITY} selected={priority} setSelected={setPriority} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Subtasks</h3>

            <div className="mt-3 bg-gray-100 p-3 flex flex-col gap-3 rounded shadow-sm">
              <div className="flex items-center gap-2">
                <Textbox
                  placeholder="Enter subtask"
                  type="text"
                  name="subtask"
                  className="w-full rounded"
                  value={subTaskInput.title}
                  onChange={(e) => setSubTaskInput({ ...subTaskInput, title: e.target.value })}
                />
                <Button label="Add" onClick={handleAddSubTask} className="bg-blue-600 text-white px-4 py-2" />
              </div>

              {subTasks.length === 0 ? (
                <p className="text-gray-500">No subtasks added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {subTasks.map((task, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded shadow">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <span className={`text-gray-900 ${task.isCompleted ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSubTask(e, index)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            <Button label="Submit" type="submit" className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto" />
            <Button type="button" className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto" onClick={() => setOpen(false)} label="Cancel" />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;