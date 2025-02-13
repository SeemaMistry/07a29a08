import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";


const BASE_URL = "https://aircall-api.onrender.com";

function CallDetailsPage() {
  const { id } = useParams();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/activities/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch call details");
        }
        return response.json();
      })
      .then((data) => setCall(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="call-details-container">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {call && (
        <div className="call-details-box">
          <h2>Call from: {call.from}</h2>
          <p>To: {call.to}</p>
          <p>Via: {call.via}</p>
          <p>Type: {call.call_type}</p>
          <p>Status: {call.is_archived ? "Archived" : "Active"}</p>
          <p>Duration: {call.duration}s</p>
          <p>Time: {new Date(call.created_at).toLocaleString()}</p>

          <Link to="/calls">
            <button className="back">Back to Calls</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default CallDetailsPage;
