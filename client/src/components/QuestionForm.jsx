import React, { useState } from "react";

const QuestionForm = ({ onAddQuestion }) => {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("mcq");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCheckboxChange = (option) => {
    if (type === "mcq") {
      setCorrectAnswers([option]);
    } else {
      if (correctAnswers.includes(option)) {
        setCorrectAnswers(correctAnswers.filter((a) => a !== option));
      } else {
        setCorrectAnswers([...correctAnswers, option]);
      }
    }
  };

  const handleAddQuestion = () => {
    if (!question.trim()) return alert("Please enter question text");
    onAddQuestion({ question, type, options, correctAnswers });
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswers([]);
  };

  return (
    <div className="border p-4 rounded-md mb-4 bg-gray-50">
      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        className="border p-2 w-full mb-2"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="mcq">Single Correct (MCQ)</option>
        <option value="multiple">Multiple Select</option>
      </select>

      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <input
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type={type === "mcq" ? "radio" : "checkbox"}
            checked={correctAnswers.includes(opt)}
            onChange={() => handleCheckboxChange(opt)}
          />
        </div>
      ))}

      <button
        onClick={handleAddQuestion}
        className="mt-2 bg-green-600 text-white px-3 py-2 rounded-md"
      >
        Add Question
      </button>
    </div>
  );
};

export default QuestionForm;
