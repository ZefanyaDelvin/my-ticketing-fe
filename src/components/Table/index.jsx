const Table = ({ tickets, onStatusChange, onDelete }) => {
  const STATUS_MAP = {
    1: "Open",
    2: "In Progress",
    3: "Resolved",
    4: "Closed",
  };

  const STATUS_COLOR = {
    1: "bg-[#3B82F6] text-black",
    2: "bg-[#F59E0B] text-black",
    3: "bg-[#10B981] text-black",
    4: "bg-[#6B7280] text-black",
  };

  const isAdmin = localStorage.getItem("roleId") === "1";

  return (
    <div className="border border-gray-200 rounded-lg shadow-md m-4 bg-white">
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white text-left text-sm text-gray-500">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                ID
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                Title
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                Description
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                Status
              </th>
              {isAdmin && (
                <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                  User
                </th>
              )}
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                Created
              </th>
              <th className="px-6 py-4 font-semibold text-gray-900 uppercase tracking-wider text-xs">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No tickets found. Create your first ticket!
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.ticketId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* ID */}
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    #{ticket.ticketId}
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                    {ticket.name}
                  </td>

                  {/* Description with Custom Tooltip */}
                  <td className="px-6 py-4 max-w-xs relative group">
                    {/* Truncated Text */}
                    <div className="truncate text-gray-600 cursor-help">
                      {ticket.description}
                    </div>

                    {/* Tooltip Popup */}
                    <div className="absolute left-6 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-800 text-white text-xs rounded p-3 shadow-xl z-50 whitespace-normal">
                      {ticket.description}
                      {/* Little arrow pointing down */}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <select
                        value={ticket.statusId}
                        onChange={(e) =>
                          onStatusChange(
                            ticket.ticketId,
                            Number(e.target.value)
                          )
                        }
                        className={`appearance-none cursor-pointer text-white font-medium text-xs px-4 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-shadow ${
                          STATUS_COLOR[ticket.statusId]
                        }`}
                        style={{ textAlignLast: "center" }}
                      >
                        {Object.entries(STATUS_MAP).map(([id, label]) => (
                          <option
                            key={id}
                            value={id}
                            className="bg-white text-gray-900"
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* User Name */}
                  {isAdmin && (
                    <>
                      <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                        {ticket.userName}
                      </td>
                    </>
                  )}

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString("en-GB")}
                      </span>
                      <span className="text-gray-500">
                        {new Date(ticket.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Delete Button */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onDelete(ticket.ticketId)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
