import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-3 flex justify-between">
      <h2 className="font-bold text-lg">Admin Dashboard</h2>
      <div className="flex gap-4">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/tests">Create Test</Link>
        <Link to="/admin/questions">Questions</Link>
        <Link to="/admin/results">Results</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
