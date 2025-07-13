import { Dialog } from "@headlessui/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { app } from "../../utils/firebase";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UsersSelect";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

/**
 * Uploads a file to Firebase storage and stores the download URL in uploadedFileURLs array.
 * @param {File} file - The file to upload
 * @returns {Promise<void>}
 */
const uploadFile = async (file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name; // Unique filename with timestamp
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading"); // Log upload progress (optional)
      },
      (error) => {
        reject(error); // Reject on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            uploadedFileURLs.push(downloadURL); // Store uploaded file URL
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

/**
 * AddTask component
 * Renders a modal form to create or update a task, including title, date, team members, priority, assets, and description.
 */
const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues }); // Initialize form with default values

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]); // Task stage state
  const [team, setTeam] = useState(task?.team || []); // Selected team members
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  ); // Task priority state
  const [assets, setAssets] = useState([]); // Selected files to upload
  const [uploading, setUploading] = useState(false); // Uploading indicator

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const URLS = task?.assets ? [...task.assets] : []; // Existing asset URLs

  /**
   * Handles form submission to create or update a task
   * @param {Object} data - Form data
   */
  const handleOnSubmit = async (data) => {
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file); // Upload each file
      } catch (error) {
        console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      const newData = {
        ...data,
        assets: [...URLS, ...uploadedFileURLs], // Combine existing and new asset URLs
        team,
        stage,
        priority,
      };
      console.log(data, newData); // Debug: log data

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap() // Update existing task
        : await createTask(newData).unwrap(); // Create new task

      toast.success(res.message); // Show success message

      setTimeout(() => {
        setOpen(false); // Close modal
      }, 500);
    } catch (err) {
      console.log(err); // Log error
      toast.error(err?.data?.message || err.error); // Show error message
    }
  };

  /**
   * Handles file input change to store selected files
   * @param {Event} e
   */
  const handleSelect = (e) => {
    setAssets(e.target.files); // Set selected files
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Task title'
              type='text'
              name='title'
              label='Task Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })} // Register title with validation
              error={errors.title ? errors.title.message : ""} // Display title error
            />
            <UserList setTeam={setTeam} team={team} /> {/* Team members selector */}
            <div className='flex gap-4'>
              <SelectList
                label='Task Stage'
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
              <SelectList
                label='Priority Level'
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>
            <div className='flex gap-4'>
              <div className='w-full'>
                <Textbox
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""} // Display date error
                />
              </div>
              <div className='w-full flex items-center justify-center mt-4'>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)} // Handle file selection
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p>Task Description</p>
              <textarea
                name='description'
                {...register("description")} // Register description
                className='w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
                  dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
                  text-gray-900 dark:text-white outline-none text-base focus:ring-2
                  ring-blue-300'
              ></textarea>
            </div>

            <div className='w-full'>
              <p>
                Add Links{" "}
                <span className='text- text-gray-600'>seperated by comma (,)</span>
              </p>
              <textarea
                name='links'
                {...register("links")} // Register links
                className='w-full bg-transparent px-3 py-1.5 2xl:py-3 border border-gray-300
                  dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700
                  text-gray-900 dark:text-white outline-none text-base focus:ring-2
                  ring-blue-300'
              ></textarea>
            </div>
          </div>

          {isLoading || isUpdating || uploading ? (
            <div className='py-4'>
              <Loading /> {/* Show loading when processing */}
            </div>
          ) : (
            <div className='bg-gray-50 mt-6 mb-4 sm:flex sm:flex-row-reverse gap-4'>
              <Button
                label='Submit'
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
              />
              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
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

export default AddTask;
