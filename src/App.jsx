import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaregiverDashboard from './pages/dashboard/CaregiverDashboard';
import ElderDashboard from './pages/dashboard/ElderDashboard';
import MedicationList from './pages/medications/MedicationList';
import AddMedication from './pages/medications/AddMedication';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
          </>
        } />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<CaregiverDashboard />} />
        <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
        <Route path="/dashboard/elder" element={<ElderDashboard />} />

        {/* Medication Routes */}
        <Route path="/medications" element={<MedicationList />} />
        <Route path="/medications/add" element={<AddMedication />} />
      </Routes>
    </Router>
  );
}

export default App;
