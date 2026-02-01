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

import { BrowserRouter, Routes, Route } from "react-router-dom";

/* LANDING */
import Landing from "./pages/landing/Landing";

/* AUTH (VISUAL ONLY) */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* ONBOARDING */
import RoleIntro from "./pages/onboarding/RoleIntro";
import CareContext from "./pages/onboarding/CareContext";
import ComfortLevel from "./pages/onboarding/ComfortLevel";
import CarePriorities from "./pages/onboarding/CarePriorities";
import OnboardingDone from "./pages/onboarding/OnboardingDone";

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
      <Route path="/onboarding/role" element={<RoleIntro />} />
      <Route path="/onboarding/context" element={<CareContext />} />
      <Route path="/onboarding/comfort" element={<ComfortLevel />} />
      <Route path="/onboarding/priorities" element={<CarePriorities />} />
      <Route path="/onboarding/done" element={<OnboardingDone />} />

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
