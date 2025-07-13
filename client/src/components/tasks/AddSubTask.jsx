import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";

/**
 * AddSubTask component
 * Renders a modal form to create a new sub-task with title, date, and tag fields.
 * Uses react-hook-form for form state and mutation for creating the sub-task.
 */
const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // Initialize form handling

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation(); // Create sub-task mutation

  // Handle form submission to create a new sub-task
  const handleOnSubmit = async (data) => {
    try {
      const res = await addSbTask({ data, id }).unwrap(); // Call API to add sub-task
      toast.success(res.message); // Show success notification

      setTimeout(() => {
        setOpen(false); // Close modal after a short delay
      }, 500);
    } catch (err) {
      console.log(err); // Log error for debugging
      toast.error(err?.data?.message || err.error); // Show error notification
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            ADD SUB-TASK
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Sub-Task title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })} // Register title field with validation
              error={errors.title ? errors.title.message : ""} // Display title error
            />

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Date'
                type='date'
                name='date'
                label='Task Date'
                className='w-full rounded'
                register={register("date", {
                  required: "Date is required!",
                })} // Register date field with validation
                error={errors.date ? errors.date.message : ""} // Display date error
              />
              <Textbox
                placeholder='Tag'
                type='text'
                name='tag'
                label='Tag'
                className='w-full rounded'
                register={register("tag", {
                  required: "Tag is required!",
                })} // Register tag field with validation
                error={errors.tag ? errors.tag.message : ""} // Display tag error
              />
            </div>
          </div>
          {isLoading ? (
            <div className='mt-8'>
              <Loading /> {/* Show loading indicator when submitting */}
            </div>
          ) : (
            <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
              <Button
                type='submit'
                className='bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto'
                label='Add Task' // Submit button
              />
              <Button
                type='button'
                className='bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)} // Close modal on cancel
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;
