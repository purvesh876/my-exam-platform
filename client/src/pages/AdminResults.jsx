import React, { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ avg: 0, max: 0, min: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/admin/results");
        setResults(res.data);

        if (res.data.length > 0) {
          const scores = res.data.map((r) => r.score);
          const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
          const max = Math.max(...scores);
          const min = Math.min(...scores);
          setStats({ avg, max, min });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading analytics...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Results Analytics</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded text-center">
          <div className="text-2xl font-bold">{stats.avg}</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        <div className="p-4 border rounded text-center">
          <div className="text-2xl font-bold">{stats.max}</div>
          <div className="text-gray-600">Highest Score</div>
        </div>
        <div className="p-4 border rounded text-center">
          <div className="text-2xl font-bold">{stats.min}</div>
          <div className="text-gray-600">Lowest Score</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results}>
          <XAxis dataKey="student.rollNumber" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
