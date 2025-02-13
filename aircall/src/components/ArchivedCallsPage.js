import React from 'react';

import { useEffect, useState } from "react";
import "./styles.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const ArchivedCallsPage = () => {
  const [archivedCalls, setArchivedCalls] = useState([]);
  
  const BASE_URL = "https://aircall-api.onrender.com"; // Update if needed

  useEffect(() => {
    fetch(`${BASE_URL}/activities`)
      .then(response => response.json())
      .then(data => {
        const archived = data.filter(call => call.is_archived === true);
        setArchivedCalls(archived);
        console.log("Archived Calls:", archived);
      })
      .catch(err => console.error("Error fetching archived calls:", err));
  }, []);


const unarchiveCall = (callId) => {
    fetch(`${BASE_URL}/activities/${callId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: false })
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to archive call");
        setArchivedCalls(archivedCalls.filter(call => call.id !== callId));
        console.log("updated call", callId)
      })
      .catch(err => alert(err.message));
    };

    const unarchiveAllCalls = () => {
        archivedCalls.forEach(call => {
          fetch(`${BASE_URL}/activities/${call.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_archived: false })
          })
          .then(response => {
            if (!response.ok) throw new Error("Failed to unarchive call");
            // return response.json();
          })
          .then(() => {
            // Update the UI by removing all archived calls
            setArchivedCalls([]);
          })
          .catch(err => alert(err.message));
        });
      };
      return (
        <div className="archived-calls-container">
          <h2 className="title">Archived Calls</h2>

          {archivedCalls.length > 0 && (
            <button onClick={unarchiveAllCalls} className="unarchive-all-btn">
              Unarchive All Calls
            </button>
          )}
    
          {archivedCalls.length > 0 ? (
            <div className="calls-list">
              {archivedCalls.map((call) => (
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
                    <button onClick={() => unarchiveCall(call.id)} className="archive-btn">
                      Unarchive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-calls">No archived calls available.</p>
          )}
        </div>
      );
    };

export default ArchivedCallsPage;
