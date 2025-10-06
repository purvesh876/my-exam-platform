import React, { useEffect, useState } from "react";
import api from "../api";
import QuestionForm from "../components/QuestionForm";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchQuestions() {
    try {
      const res = await api.get("/admin/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await api.delete(`/admin/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const handleEditSave = async (q) => {
    try {
      const res = await api.put(`/admin/questions/${editing._id}`, q);
      setQuestions((prev) =>
        prev.map((p) => (p._id === editing._id ? res.data : p))
      );
      setEditing(null);
    } catch (err) {
      alert("Error saving changes");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      {loading ? (
        <div>Loading questions...</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="border p-4 rounded-md flex justify-between items-start"
            >
              <div>
                <div className="font-medium">{q.text}</div>
                <div className="text-sm text-gray-600">
                  Type: {q.type} | Marks: {q.marks}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(q)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Edit Question</h3>
          <QuestionForm
            onAddQuestion={handleEditSave}
            defaultData={editing}
            isEdit
          />
        </div>
      )}
    </div>
  );
}
