import { useEffect, useState, useCallback } from "react";
import Table from "../../components/Table";
import CreateModal from "../../components/Modal";
import Swal from "sweetalert2";

const Dashboard = () => {
  const name = localStorage.getItem("name");
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reusable fetch tickets function
  const fetchTickets = useCallback(async () => {
    try {
      const resp = await fetch(`${baseURL}/api/tickets/get-ticket`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.message || "Failed to fetch tickets");
        return;
      }

      setTickets(data.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Something went wrong while fetching tickets");
    }
  }, [baseURL]);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Update Ticket Status
  const handleStatusChange = async (ticketId, newStatusId) => {
    try {
      const resp = await fetch(`${baseURL}/api/tickets/update/${ticketId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statusId: Number(newStatusId) }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      // Optimistically update UI
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticketId === ticketId
            ? { ...ticket, statusId: Number(newStatusId) }
            : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  // Delete Ticket
  const handleDeleteTicket = async (ticketId) => {
    try {
      const resp = await fetch(`${baseURL}/api/tickets/delete/${ticketId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Something went wrong",
        });
        return;
      }

      // Refresh tickets after deletion
      fetchTickets();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  // Create Ticket
  const handleCreateTicket = async (newTicket) => {
    try {
      const resp = await fetch(`${baseURL}/api/tickets/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTicket.title,
          description: newTicket.description,
          statusId: 1, // Default status
          userId:
            Number(newTicket.userId) || Number(localStorage.getItem("userId")),
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        alert(data.error || "Failed to create ticket");
        return;
      }

      // Close modal
      setIsModalOpen(false);

      // Re-fetch tickets from backend
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">
              Ticket Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium cursor-pointer"
          >
            + Create New Ticket
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table
            tickets={tickets}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTicket}
          />
        </div>
      </div>

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
        baseURL={baseURL}
      />
    </div>
  );
};

export default Dashboard;
