import React from "react";
import "./App.css";
import LandingPage from "@/pages/LandingPage";
import EventPage from "./pages/EventsPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/createEvent" element={<EventPage />} />
    </Routes>
  );
}

export default App;

