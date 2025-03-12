import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";

const AddSubTask = ({ open, setOpen, onSubTaskSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const handleOnSubmit = async (data) => {
    if (!onSubTaskSubmit) {
      console.error("Error: onSubTaskSubmit function is missing!");
      return;
    }

    const newSubTask = {
      ...data,
      isCompleted: false,
      date: new Date(),
    };

    onSubTaskSubmit(newSubTask); // ✅ Call the correct function
    setOpen(false); // ✅ Close modal after submission
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          ADD SUB-TASK
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Sub-Task title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title ? errors.title.message : ""}
          />
        </div>
        <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
            label="Add Task"
          />
          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
