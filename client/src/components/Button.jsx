import clsx from "clsx";

/**
 * Button component
 * Renders a customizable button with optional icon.
 * Props:
 * - className: additional CSS classes
 * - label: button text
 * - type: button type attribute (default is "button")
 * - onClick: click handler function (default is empty function)
 * - icon: optional icon element to display inside the button
 */
const Button = ({ className, label, type, onClick = () => {}, icon }) => {
  return (
    <button
      type={type || "button"} // default to "button" type
      className={clsx("px-3 py-2 outline-none rounded", className)} // combine default and custom classes
      onClick={onClick} // handle click events
    >
      <span>{label}</span>

      {icon && icon} {/* render icon if provided */}
    </button>
  );
};

export default Button;
