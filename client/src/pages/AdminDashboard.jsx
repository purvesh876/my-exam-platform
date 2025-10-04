import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome, Admin 👋</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/admin/tests"
            className="bg-blue-500 text-white p-6 rounded-xl text-center hover:bg-blue-600"
          >
            ➕ Create Test
          </Link>
          <Link
            to="/admin/questions"
            className="bg-green-500 text-white p-6 rounded-xl text-center hover:bg-green-600"
          >
            🧩 Manage Questions
          </Link>
          <Link
            to="/admin/results"
            className="bg-purple-500 text-white p-6 rounded-xl text-center hover:bg-purple-600"
          >
            📊 View Results
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
