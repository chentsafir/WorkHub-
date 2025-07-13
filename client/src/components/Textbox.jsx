import React from "react";
import clsx from "clsx";

/**
 * * Textbox component for rendering an input field with optional label and error message.
 * @param {Object} props
 * @param {string} props.type - Input type (default: "text").
 * @param {string} props.placeholder - Placeholder text for the input.
 * @param {string} props.label - Optional label text displayed above the input.
 * @param {string} props.className - Additional CSS classes for the input.
 * @param {string} props.labelClass - Additional CSS classes for the label.
 * @param {object} props.register - Object from react-hook-form or similar for form registration.
 * @param {string} props.name - Name attribute for the input.
 * @param {string} props.error - Optional error message displayed below the input.
 * @param {React.Ref} ref - Forwarded ref for the input element.
 * @returns JSX.Element
 */
const Textbox = React.forwardRef(
  (
    { type, placeholder, label, className, labelClass, register, name, error },
    ref
  ) => {
    return (
      <div className='w-full flex flex-col gap-1'>
        {label && (
          <span
            htmlFor={name}
            className={clsx("text-slate-900 dark:text-gray-500", labelClass)}
          >
            {label}
          </span>
        )}

        <div>
          <input
            type={type || "text"}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={clsx(
              "bg-transparent px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white outline-none text-base focus:ring-2 ring-blue-300",
              className
            )}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className='text-xs text-[#f64949fe] mt-0.5 '>{error}</span>
        )}
      </div>
    );
  }
);

export default Textbox;
