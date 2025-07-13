import { Tab } from "@headlessui/react";

/**
 * * Helper function to combine class names conditionally.
 * @param {...string} classes - List of class names.
 * @returns {string} - Combined class string.
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * * Tabs component that renders a tab list with icons and titles.
 * * Allows switching between tabs and rendering different panels.
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects with title and icon.
 * @param {Function} props.setSelected - Function to set selected tab index.
 * @param {React.ReactNode} props.children - Content panels for the tabs.
 * @returns JSX.Element
 */
export default function Tabs({ tabs, setSelected, children }) {
  return (
    <div className='w-full px-1 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-6 rounded-xl p-1'>
          {tabs.map((tab, index) => (
            <Tab
              key={tab.title}
              onClick={() => setSelected(index)}
              className={({ selected }) =>
                classNames(
                  "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 bg-white dark:bg-[#1f1f1f]",
                  selected
                    ? "text-blue-700 dark:text-white border-b-2 border-blue-600"
                    : "text-gray-800 dark:text-gray-500 hover:text-blue-800"
                )
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='w-full mt-2'>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}
