import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CallsPage from "./components/CallsPage";
import ArchivedCallsPage from "./components/ArchivedCallsPage";
import CallDetailsPage from "./components/CallDetailsPage";


function App() {
  return (
    <Router>

      <div className="container">
        <h1 className="h1">Welcome! Click on Calls or Archived to Begin!</h1>
        <nav className="">
          <Link to="/calls" className="">Calls</Link>
          <p>  </p>
          <Link to="/archived" className="">Archived</Link>
        </nav>

        <Routes>
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/archived" element={<ArchivedCallsPage />} />
          <Route path="/calls/:id" element={<CallDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

