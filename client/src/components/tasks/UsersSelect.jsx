import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice.js";
import { getInitials } from "../../utils/index.js";

/**
 * UserList component - displays a multi-select dropdown for assigning tasks to team members.
 * Fetches team users, manages selected users, and updates the parent component with selected user IDs.
 * 
 * @param {Array} team - Array of selected user objects or IDs
 * @param {Function} setTeam - Setter function to update selected user IDs in the parent
 */
export default function UserList({ team, setTeam }) {
  // Fetch team users with empty search filter
  const { data, isLoading } = useGetTeamListsQuery({ search: "" });
  // Local state for selected user objects
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Handles change of selection in the Listbox
  const handleChange = (el) => {
    setSelectedUsers(el);
    setTeam(el.map((el) => el._id)); // update parent's team state with selected user IDs
  };

  // Effect to initialize selectedUsers when team or loading changes
  useEffect(() => {
    if (team?.length < 1) {
      data && setSelectedUsers([data[0]]); // default select first user if none selected
    } else {
      setSelectedUsers(team); // set selectedUsers from team prop if available
    }
  }, [isLoading]);

  return (
    <div className=''>
      {/* Label for the Listbox */}
      <p className='text-slate-900 dark:text-gray-500'>Assign Task To:</p>
      
      {/* Multi-select Listbox for users */}
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className='relative mt-1'>
          {/* Button showing selected users */}
          <Listbox.Button className='relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 dark:border-gray-600 sm:text-sm'>
            <span className='block truncate'>
              {selectedUsers?.map((user) => user.name).join(", ")} {/* Display selected users' names */}
            </span>

            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>

          {/* Transition for dropdown animation */}
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            {/* List of selectable users */}
            <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {data?.map((user, userIdx) => (
                <Listbox.Option
                  key={userIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      {/* User display with initials and name */}
                      <div
                        className={`flex items-center gap-2 truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div
                          className={
                            "w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600"
                          }
                        >
                          <span className='text-center text-[10px]'>
                            {getInitials(user.name)} {/* User initials */}
                          </span>
                        </div>
                        <span>{user.name}</span>
                      </div>

                      {/* Checkmark if selected */}
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          <MdCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
