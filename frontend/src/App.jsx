// import { BrowserRouter, Routes, Route } from "react-router-dom";

// /* LANDING */
// import Landing from "./pages/landing/Landing";

// /* AUTH */
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import ForgotPassword from "./pages/auth/ForgotPassword";

// /* ONBOARDING */
// import RoleSelect from "./pages/onboarding/RoleSelect";

// /* DASHBOARDS */
// import CaregiverDashboard from "./pages/dashboard/CaregiverDashboard";
// import ElderDashboard from "./pages/dashboard/ElderDashboard";

// /* PROTECTION */
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* LANDING */}
//         <Route path="/" element={<Landing />} />

//         {/* AUTH */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         {/* ONBOARDING */}
//         <Route
//           path="/role"
//           element={
//             <ProtectedRoute>
//               <RoleSelect />
//             </ProtectedRoute>
//           }
//         />

//         {/* DASHBOARDS */}
//         <Route
//           path="/caregiver"
//           element={
//             <ProtectedRoute>
//               <CaregiverDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/elder"
//           element={
//             <ProtectedRoute>
//               <ElderDashboard />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* LANDING */
import Landing from "./pages/landing/Landing";

/* AUTH (VISUAL ONLY) */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* ONBOARDING */
import Start from "./pages/onboarding/screens/Start";
import Setup from "./pages/onboarding/screens/Setup";
import Finish from "./pages/onboarding/screens/Finish";
import RoleIntro from "./pages/onboarding/RoleIntro"; // Keep legacy just in case? Or remove.

// later you will add more onboarding screens here

/* DASHBOARDS */
import CaregiverDashboard from "./pages/dashboard/CaregiverDashboard";
import ElderDashboard from "./pages/dashboard/ElderDashboard";
import AddMedication from "./pages/medications/AddMedication";
import MedicationList from "./pages/medications/MedicationList";
import RefillDashboard from "./pages/pharmacy/RefillDashboard";
import PharmacyFinder from "./pages/pharmacy/PharmacyFinder";
import DailyCheckIn from "./pages/dashboard/DailyCheckIn";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* LANDING */}
    <Route path="/" element={<Landing />} />

    {/* AUTH */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* PROTECTED ROUTES */}
    <Route element={<ProtectedRoute />}>
      {/* ONBOARDING */}
      <Route path="/onboarding/start" element={<Navigate to="/onboarding/role" replace />} />
      
      {/* New Flow */}
      <Route path="/onboarding/role" element={<Start />} />
      <Route path="/onboarding/setup" element={<Setup />} />
      <Route path="/onboarding/finish" element={<Finish />} />
      
      {/* Legacy Redirects (optional) */}
      <Route path="/onboarding/context" element={<Navigate to="/onboarding/role" replace />} />
      <Route path="/onboarding/comfort" element={<Navigate to="/onboarding/setup" replace />} />
      <Route path="/onboarding/priorities" element={<Navigate to="/onboarding/setup" replace />} />
      <Route path="/onboarding/done" element={<Navigate to="/onboarding/finish" replace />} />

      {/* DASHBOARDS */}
      <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
      <Route path="/dashboard/elder" element={<ElderDashboard />} />
      <Route path="/medications" element={<MedicationList />} />
      <Route path="/medications/add" element={<AddMedication />} />
      <Route path="/refills" element={<RefillDashboard />} />
      <Route path="/pharmacy-finder" element={<PharmacyFinder />} />
      <Route path="/check-in" element={<DailyCheckIn />} />
    </Route>
  </Routes>
</BrowserRouter>

  );
}
