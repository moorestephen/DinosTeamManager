import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate, Navigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import HomePage from './HomePage';
import AdministratorPage from './AdministratorPage';
import CoachPage from './CoachPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/administrator" element={<AdministratorPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/swimmer" />
      </Routes>
    </Router>
  );
}
