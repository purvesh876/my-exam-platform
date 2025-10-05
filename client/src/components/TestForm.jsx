import React, { useState } from "react";
import QuestionForm from "./QuestionForm";

const TestForm = () => {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const handleSubmit = () => {
    const testData = { testName, duration, questions };
    console.log("Submitting Test:", testData);

    // TODO: API call to backend
    // await axios.post("/api/tests/create", testData)
    alert("Test created successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Test</h2>

      <input
        type="text"
        placeholder="Enter Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <h3 className="font-semibold mb-2">Add Questions</h3>
      <QuestionForm onAddQuestion={handleAddQuestion} />

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Added Questions:</h4>
        <ul className="list-disc pl-5">
          {questions.map((q, i) => (
            <li key={i}>
              {q.question} ({q.type.toUpperCase()})
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Save Test
      </button>
    </div>
  );
};

export default TestForm;
