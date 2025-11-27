import { useEffect, useState } from "react";

const CreateModal = ({ isOpen, onClose, onSubmit, baseURL }) => {
  const isAdmin = localStorage.getItem("roleId") === "1";

  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch Users for Admin
  useEffect(() => {
    if (!isAdmin || !isOpen) return;

    const fetchUsers = async () => {
      try {
        const resp = await fetch(`${baseURL}/api/users/getAll`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await resp.json();
        if (!resp.ok) {
          setError(data.error || "Failed to fetch users");
          return;
        }

        setUsers(data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Something went wrong fetching users");
      }
    };

    fetchUsers();
  }, [isAdmin, isOpen, baseURL]);

  const handleSubmit = () => {
    if (!title || !description) return;

    onSubmit({
      title,
      description,
      userId: isAdmin ? Number(userId) : Number(localStorage.getItem("userId")),
    });

    setTitle("");
    setDescription("");
    setUserId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-20 flex items-center justify-center p-4 z-50">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Create New Ticket
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter ticket title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter ticket description"
            />
          </div>

          {/* Assign To */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">-- Choose user --</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="flex gap-3 mt-6">
          {/* Create */}
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-medium cursor-pointer"
          >
            Create
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
