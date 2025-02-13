import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import "./styles.css";

const BASE_URL = "https://aircall-api.onrender.com";

function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/activities`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data); // Check what data is received
        if (Array.isArray(data)) {
          console.log(data)
          const activeCalls = data.filter(call => !call.is_archived);
          setCalls(activeCalls);
        } else {
          console.error("Unexpected API response format:", data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const archiveCall = (callId) => {
    fetch(`${BASE_URL}/activities/${callId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: true })
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to archive call");
      setCalls(calls.filter(call => call.id !== callId));
    })
    .catch(err => alert(err.message));
  };

  const archiveAllCalls = () => {
    calls.forEach(call => {
      fetch(`${BASE_URL}/activities/${call.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: true })
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to unarchive call");
        // return response.json();
      })
      .then(() => {
        // Update the UI by removing all archived calls
        setCalls([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    });
  };
  return (
    <div className="call-container">
      

      <div className="call-list">
      <h1 className="title">📞 Call Logs</h1>
      {/* Button to unarchive all calls */}
       <button
        onClick={archiveAllCalls}
        className="button"
      >
        Archive All Calls
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
        {calls.length > 0 ? (
          calls.map((call) => (
            <div key={call.id} className="call-card">
              <div className="call-info">
                {call.direction === "inbound" ? (
                  <FaArrowDown className="icon incoming" />
                ) : (
                  <FaArrowUp className="icon outgoing" />
                )}
                <div className="call-details">
                  <p>
                    <strong>From:</strong> {call.from} →{" "}
                    <strong>To:</strong> {call.to}
                  </p>
                  <p>{call.call_type} | {call.duration}s</p>
                </div>
              </div>
              <div className="buttons">
                <Link to={`/calls/${call.id}`} className="view-btn">
                  View
                </Link>
                <button onClick={() => archiveCall(call.id)} className="archive-btn">
                  Archive
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No calls available.</p>
        )}
      </div>
    </div>
  );
}


export default CallsPage;
