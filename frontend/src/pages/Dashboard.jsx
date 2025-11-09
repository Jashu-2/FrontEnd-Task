import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Check for token when component loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("email");

    if (!token) {
      // 🔒 Redirect to login if not logged in
      navigate("/login");
    } else {
      setEmail(userEmail);
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-96 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
        <p className="text-gray-700 mb-6">
          You are logged in as <b>{email}</b>
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
