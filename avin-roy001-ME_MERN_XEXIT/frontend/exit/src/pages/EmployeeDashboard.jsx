import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitResignation, submitExitResponses } from '../services/api';

const QUESTIONS = [
  "Why are you leaving?",
  "How would you rate your experience?",
  "Any suggestions for improvement?"
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [lwd, setLwd] = useState('');
  const [resignationSubmitted, setResignationSubmitted] = useState(false);
  const [responses, setResponses] = useState(
    QUESTIONS.map(q => ({ questionText: q, response: '' }))
  );

  const handleResign = async () => {
    try {
      await submitResignation({ lwd }, token);
      alert("Resignation submitted!");
      setResignationSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleExitSubmit = async () => {
    try {
      await submitExitResponses({ responses }, token);
      alert("Exit interview submitted!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <button onClick={() => navigate('/')}>Logout</button>

      {!resignationSubmitted ? (
        <div>
          <h3>Submit Resignation</h3>
          <input
            type="date"
            value={lwd}
            onChange={e => setLwd(e.target.value)}
          />
          <button onClick={handleResign}>Submit Resignation</button>
        </div>
      ) : (
        <div>
          <h3>Exit Interview</h3>
          {responses.map((q, i) => (
            <div key={i}>
              <label>{q.questionText}</label>
              <input
                value={q.response}
                onChange={e => {
                  const newR = [...responses];
                  newR[i].response = e.target.value;
                  setResponses(newR);
                }}
              />
            </div>
          ))}
          <button onClick={handleExitSubmit}>Submit Exit Interview</button>
        </div>
      )}
    </div>
  );
}