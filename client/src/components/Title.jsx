import clsx from "clsx";

/**
 * * Title component for rendering a styled section heading.
 * @param {Object} props
 * @param {string} props.title - The text to display as the title.
 * @param {string} props.className - Optional additional CSS classes for styling.
 * @returns JSX.Element
 */
const Title = ({ title, className }) => {
  return (
    <h2
      className={clsx(
        "text-2xl font-semibold dark:text-white capitalize",
        className
      )}
    >
      {title}
    </h2>
  );
};

export default Title;
