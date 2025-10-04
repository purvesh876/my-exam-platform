import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(0); // seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: [indexes] }
  const [violations, setViolations] = useState(0);
  const attemptsRef = useRef(0);
  const lastViolationLoggedAt = useRef(0);
  const intervalRef = useRef(null);

  // start the attempt on mount
  useEffect(() => {
    let mounted = true;
    async function start() {
      try {
        const res = await api.post(`/student/tests/${testId}/start`);
        if (!mounted) return;
        setAttemptId(res.data.attemptId);
        setDuration(res.data.durationSeconds);
        setTimeLeft(res.data.durationSeconds);
        setQuestions(res.data.questions);
      } catch (err) {
        alert(err.response?.data?.message || "Could not start test");
        navigate("/");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    start();

    return () => { mounted = false; };
  }, [testId, navigate]);

  // start countdown
  useEffect(() => {
    if (!duration) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit(); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [duration]);

  // helper to send violation to server (throttle to 1s)
  const logViolation = async (type) => {
    const now = Date.now();
    if (now - lastViolationLoggedAt.current < 1000) return;
    lastViolationLoggedAt.current = now;

    if (!attemptId) return;
    try {
      const res = await api.post(`/student/tests/${attemptId}/violation`, { type });
      setViolations(res.data.violationsCount);
      if (res.data.isSubmitted) {
        alert("Test auto-submitted due to violations");
        navigate("/"); // or show result page
      }
    } catch (err) {
      console.error("violation log failed", err);
    }
  };

  // Visibility and focus handlers
  useEffect(() => {
    // push state to detect back button
    window.history.pushState({ test: testId }, "");

    const popHandler = (e) => {
      // back/forward pressed
      logViolation("back");
      // push state again to prevent back navigation
      window.history.pushState({ test: testId }, "");
    };
    const visibilityHandler = () => {
      if (document.hidden) logViolation("tab-change");
    };
    const blurHandler = () => {
      logViolation("blur");
    };

    window.addEventListener("popstate", popHandler);
    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("blur", blurHandler);

    return () => {
      window.removeEventListener("popstate", popHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("blur", blurHandler);
    };
    // eslint-disable-next-line
  }, [attemptId, testId]);

  const toggleSelect = (qId, idx, qType) => {
    setAnswers(prev => {
      const prevSel = prev[qId] || [];
      if (qType === "mcq") {
        return { ...prev, [qId]: [idx] };
      } else {
        // multi: toggle in/out
        const exists = prevSel.includes(idx);
        const next = exists ? prevSel.filter(i=>i!==idx) : [...prevSel, idx];
        return { ...prev, [qId]: next };
      }
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    try {
      // prepare answers array
      const payloadAnswers = Object.keys(answers).map(qId => ({
        question: qId,
        selectedIndexes: answers[qId]
      }));
      const res = await api.post(`/student/tests/${attemptId}/submit`, { answers: payloadAnswers });
      alert("Submitted. Marks: " + res.data.total);
      navigate("/"); // redirect to dashboard or result page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submit failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!questions.length) return <div className="p-6">No questions found</div>;

  const q = questions[currentIndex];
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test: { /* optionally testName */ }</h2>
        <div className="text-lg">Time left: <span className="font-mono">{mins}:{secs}</span></div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <div className="font-semibold">Q {currentIndex + 1}.</div>
          <div className="mt-2">{q.text}</div>
        </div>

        <div>
          {q.options.map((opt, idx) => {
            const selected = (answers[q.id] || []).includes(idx);
            return (
              <label key={idx} className="flex items-center gap-3 p-2 border rounded mb-2 cursor-pointer">
                <input
                  type={q.type === "mcq" ? "radio" : "checkbox"}
                  checked={selected}
                  onChange={() => toggleSelect(q.id, idx, q.type)}
                />
                <span>{opt.text}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <button disabled={currentIndex===0} onClick={()=>setCurrentIndex(i=>i-1)} className="mr-2 px-3 py-1 border rounded">Prev</button>
            <button disabled={currentIndex===questions.length-1} onClick={()=>setCurrentIndex(i=>i+1)} className="px-3 py-1 border rounded">Next</button>
          </div>
          <div>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Violations: {violations} (if you change tabs or press back too often, test may auto-submit)
      </div>
    </div>
  );
}
