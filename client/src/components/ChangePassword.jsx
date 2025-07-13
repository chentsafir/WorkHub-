import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";

/**
 * ChangePassword component
 * Modal form to change user password.
 * @param {boolean} open - Controls modal visibility.
 * @param {function} setOpen - Function to toggle modal visibility.
 */
const ChangePassword = ({ open, setOpen }) => {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mutation hook to change user password
  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();

  /**
   * handleOnSubmit
   * Submits new password after validation.
   * @param {object} data - Form data containing password and confirmation.
   */
  const handleOnSubmit = async (data) => {
    // Check if passwords match
    if (data.password !== data.cpass) {
      toast.warning("Passwords doesn't match");
      return; // stop submission if no match
    }
    try {
      // Call API to change password
      const res = await changeUserPassword(data).unwrap();
      toast.success("New User added successfully");

      // Close modal after short delay
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
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
            Change Passowrd {/* Modal title */}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='New Passowrd'
              type='password'
              name='password'
              label='New Passowrd'
              className='w-full rounded'
              register={register("password", {
                required: "New Passowrd is required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <Textbox
              placeholder='Confirm New Passowrd'
              type='password'
              name='cpass'
              label='Confirm New Passowrd'
              className='w-full rounded'
              register={register("cpass", {
                required: "Confirm New Passowrd is required!",
              })}
              error={errors.cpass ? errors.cpass.message : ""}
            />
          </div>

          {isLoading ? (
            <div className='py-5'>
              <Loading /> {/* Show loading spinner while request in progress */}
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Save'
              />

              <button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)} // Close modal on cancel
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default ChangePassword;
