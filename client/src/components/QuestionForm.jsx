// import React, { useState } from "react";

// const QuestionForm = ({ onAddQuestion }) => {
//   const [question, setQuestion] = useState("");
//   const [type, setType] = useState("mcq");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswers, setCorrectAnswers] = useState([]);

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const handleCheckboxChange = (option) => {
//     if (type === "mcq") {
//       setCorrectAnswers([option]);
//     } else {
//       if (correctAnswers.includes(option)) {
//         setCorrectAnswers(correctAnswers.filter((a) => a !== option));
//       } else {
//         setCorrectAnswers([...correctAnswers, option]);
//       }
//     }
//   };

//   const handleAddQuestion = () => {
//     if (!question.trim()) return alert("Please enter question text");
//     onAddQuestion({ question, type, options, correctAnswers });
//     setQuestion("");
//     setOptions(["", "", "", ""]);
//     setCorrectAnswers([]);
//   };

//   return (
//     <div className="border p-4 rounded-md mb-4 bg-gray-50">
//       <input
//         type="text"
//         placeholder="Enter question"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         className="border p-2 w-full mb-2"
//       />

//       <select
//         className="border p-2 w-full mb-2"
//         value={type}
//         onChange={(e) => setType(e.target.value)}
//       >
//         <option value="mcq">Single Correct (MCQ)</option>
//         <option value="multiple">Multiple Select</option>
//       </select>

//       {options.map((opt, i) => (
//         <div key={i} className="flex items-center gap-2 mb-1">
//           <input
//             type="text"
//             placeholder={`Option ${i + 1}`}
//             value={opt}
//             onChange={(e) => handleOptionChange(i, e.target.value)}
//             className="border p-2 w-full"
//           />
//           <input
//             type={type === "mcq" ? "radio" : "checkbox"}
//             checked={correctAnswers.includes(opt)}
//             onChange={() => handleCheckboxChange(opt)}
//           />
//         </div>
//       ))}

//       <button
//         onClick={handleAddQuestion}
//         className="mt-2 bg-green-600 text-white px-3 py-2 rounded-md"
//       >
//         Add Question
//       </button>
//     </div>
//   );
// };

// export default QuestionForm;

import React, { useState } from "react";

const QuestionForm = ({ onAddQuestion }) => {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("mcq");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const toggleCorrect = (idx) => {
    if (type === "mcq") setCorrectAnswers([idx]);
    else {
      if (correctAnswers.includes(idx))
        setCorrectAnswers(correctAnswers.filter(i => i !== idx));
      else setCorrectAnswers([...correctAnswers, idx]);
    }
  };

  const handleAdd = () => {
    if (!question.trim()) return alert("Question text required");
    if (options.some(opt => !opt.trim())) return alert("All options must be filled");
    if (correctAnswers.length === 0) return alert("Select at least one correct answer");

    onAddQuestion({
      text: question,
      type,
      options: options.map(o => ({ text: o })),
      correctIndexes: correctAnswers,
      marks: 1
    });

    // reset
    setQuestion("");
    setType("mcq");
    setOptions(["", ""]);
    setCorrectAnswers([]);
  };

  return (
    <div className="border p-4 rounded">
      <div className="mb-2">
        <label className="block text-sm font-medium">Question</label>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="mt-1 border rounded px-2 py-1"
        >
          <option value="mcq">MCQ (single correct)</option>
          <option value="multi">Multiple Select</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-1">
            <input
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              onClick={() => toggleCorrect(idx)}
              type="button"
              className="px-2 py-1 border rounded"
            >
              {correctAnswers.includes(idx) ? "✓" : "O"}
            </button>
            {options.length > 2 && (
              <button
                onClick={() => removeOption(idx)}
                type="button"
                className="px-2 py-1 text-red-600"
              >
                Del
              </button>
            )}
          </div>
        ))}
        <div className="mt-2">
          <button onClick={addOption} type="button" className="px-3 py-1 border rounded">
            Add Option
          </button>
        </div>
      </div>

      <div className="text-right">
        <button onClick={handleAdd} className="bg-green-600 text-white px-3 py-2 rounded">
          Add Question
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
