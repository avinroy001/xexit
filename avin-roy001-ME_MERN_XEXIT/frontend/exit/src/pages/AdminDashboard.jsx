import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResignations, concludeResignation, getExitResponses } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [resignations, setResignations] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resData = await getAllResignations(token);
      setResignations(resData.data);

      const exitData = await getExitResponses(token);
      setResponses(exitData.data);
    };
    fetchData();
  }, [token]);

  const handleAction = async (id, approve) => {
    const lwd = prompt("Enter exit date (YYYY-MM-DD):");
    if (!lwd) return;

    await concludeResignation({ resignationId: id, approved: approve, lwd }, token);
    alert(`Resignation ${approve ? 'approved' : 'rejected'}`);
    window.location.reload();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/')}>Logout</button>

      <h3>Pending Resignations</h3>
      <ul>
        {resignations.map(r => (
          <li key={r._id}>
            {r.employeeId.username} - {r.lwd.split('T')[0]} - {r.status}
            {r.status === 'pending' && (
              <>
                <button onClick={() => handleAction(r._id, true)}>Approve</button>
                <button onClick={() => handleAction(r._id, false)}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Exit Interview Responses</h3>
      {responses.map(r => (
        <div key={r._id}>
          <strong>{r.employeeId.username}</strong>
          <ul>
            {r.responses.map((q, i) => (
              <li key={i}><b>{q.questionText}:</b> {q.response}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}