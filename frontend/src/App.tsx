import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PersonList from './pages/PersonList';
import PersonForm from './pages/PersonForm';
import BirthList from './pages/BirthList';
import BirthForm from './pages/BirthForm';
import DeathList from './pages/DeathList';
import DeathForm from './pages/DeathForm';
import MarriageList from './pages/MarriageList';
import MarriageForm from './pages/MarriageForm';
import DivorceList from './pages/DivorceList';
import DivorceForm from './pages/DivorceForm';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="persons" element={<PersonList />} />
            <Route path="persons/new" element={<PersonForm />} />
            <Route path="persons/:id/edit" element={<PersonForm />} />
            <Route path="births" element={<BirthList />} />
            <Route path="births/new" element={<BirthForm />} />
            <Route path="deaths" element={<DeathList />} />
            <Route path="deaths/new" element={<DeathForm />} />
            <Route path="marriages" element={<MarriageList />} />
            <Route path="marriages/new" element={<MarriageForm />} />
            <Route path="divorces" element={<DivorceList />} />
            <Route path="divorces/new" element={<DivorceForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;