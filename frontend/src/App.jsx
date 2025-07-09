import React from "react";
import "./App.css";
import LandingPage from "@/pages/LandingPage";
import EventPage from "@/pages/EventsPage";
import AllEventsPage from "@/pages/AllEventsPage";
import Attendance from "@/components/TakeAttendence";
import CreateClass from "@/components/CreateClass";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/createEvent" element={<EventPage />} />
      <Route path="/AllEventsPage" element={<AllEventsPage />} />
      <Route path="/create" element={<CreateClass />} />
      <Route path="/Attendance" element={<Attendance />} />
    </Routes>
  );
}

export default App;

