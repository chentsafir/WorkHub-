import React from "react";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Button from "./Button";

/**
 * ViewNotification Component
 * 
 * Displays a modal dialog to view the details of a single notification.
 * Shows the related task title and notification text.
 * Includes an "Ok" button to close the modal.
 *
 * @param {boolean} open - Controls whether the modal is open.
 * @param {function} setOpen - Function to update open state.
 * @param {object} el - Notification data object containing task and text.
 */
const ViewNotification = ({ open, setOpen, el }) => {
  return (
    <>
      {/* ModalWrapper handles backdrop, centering and transition */}
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          {/* Modal title: displays task title if exists */}
          <Dialog.Title as='h3' className='font-semibold text-lg'>
            {el?.task?.title}
          </Dialog.Title>

          {/* Notification text */}
          <p className='text-start text-gray-500'>{el?.text}</p>

          {/* Close button */}
          <Button
            type='button'
            className='bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300'
            onClick={() => setOpen(false)}
            label='Ok'
          />
        </div>
      </ModalWrapper>
    </>
  );
};

export default ViewNotification;
