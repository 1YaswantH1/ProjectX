import React from "react";
import "./App.css";
import LandingPage from "@/pages/LandingPage";
import EventPage from "@/pages/EventsPage";
import AllEventsPage from "@/pages/AllEventsPage";
import Attendance from "@/pages/TakeAttendencePage";
import CreateClass from "@/components/CreateClass";
import DeleteClass from "@/components/DeleteClass";
import Signup from "@/components/Signup";
import Login from "@/components/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/createEvent" element={<EventPage />} />
      <Route path="/AllEventsPage" element={<AllEventsPage />} />
      <Route path="/createClass" element={<CreateClass />} />
      <Route path="/deleteClass" element={<DeleteClass />} />
      <Route path="/Attendance" element={<Attendance />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

