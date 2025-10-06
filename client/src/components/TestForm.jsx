// import React, { useState } from "react";
// import QuestionForm from "./QuestionForm";

// const TestForm = () => {
//   const [testName, setTestName] = useState("");
//   const [duration, setDuration] = useState(30);
//   const [questions, setQuestions] = useState([]);

//   const handleAddQuestion = (newQuestion) => {
//     setQuestions([...questions, newQuestion]);
//   };

//   const handleSubmit = () => {
//     const testData = { testName, duration, questions };
//     console.log("Submitting Test:", testData);

//     // TODO: API call to backend
//     // await axios.post("/api/tests/create", testData)
//     alert("Test created successfully!");
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Create New Test</h2>

//       <input
//         type="text"
//         placeholder="Enter Test Name"
//         value={testName}
//         onChange={(e) => setTestName(e.target.value)}
//         className="border p-2 w-full mb-3"
//       />

//       <input
//         type="number"
//         placeholder="Duration (minutes)"
//         value={duration}
//         onChange={(e) => setDuration(e.target.value)}
//         className="border p-2 w-full mb-3"
//       />

//       <h3 className="font-semibold mb-2">Add Questions</h3>
//       <QuestionForm onAddQuestion={handleAddQuestion} />

//       <div className="mt-4">
//         <h4 className="font-semibold mb-2">Added Questions:</h4>
//         <ul className="list-disc pl-5">
//           {questions.map((q, i) => (
//             <li key={i}>
//               {q.question} ({q.type.toUpperCase()})
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
//       >
//         Save Test
//       </button>
//     </div>
//   );
// };

// export default TestForm;

import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import api from "../api";

const TestForm = () => {
  const [testName, setTestName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const handleSubmit = async () => {
    if (!testName.trim()) return alert("Test name required");
    if (questions.length === 0) return alert("Add at least one question");

    setSaving(true);
    try {
      // Create questions first
      const createdQuestionIds = [];
      for (const q of questions) {
        const res = await api.post("/admin/questions", q);
        createdQuestionIds.push({ question: res.data._id, marks: q.marks || 1 });
      }

      // Create test
      const payload = {
        name: testName,
        durationSeconds: durationMinutes * 60,
        questions: createdQuestionIds
      };
      await api.post("/admin/tests", payload);
      alert("Test created successfully!");

      // Reset
      setTestName("");
      setDurationMinutes(30);
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Could not save test");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Test Name</label>
          <input
            value={testName}
            onChange={e => setTestName(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (minutes)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={e => setDurationMinutes(Number(e.target.value))}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Questions</h3>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="p-3 border rounded">
              <div className="font-medium">{q.text}</div>
              <div className="text-sm text-gray-600">Type: {q.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <QuestionForm onAddQuestion={handleAddQuestion} />
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {saving ? "Saving..." : "Save Test"}
        </button>
      </div>
    </div>
  );
};

export default TestForm;

