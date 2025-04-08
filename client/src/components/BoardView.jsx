import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks, onUpdate, setId }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks.map((task, index) => (
        <TaskCard task={task} key={index} onUpdate={onUpdate} setId={setId} />
      ))}
    </div>
  );
};

export default BoardView;
