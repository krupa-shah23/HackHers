// src/context/OnboardingContext.jsx
import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [onboarding, setOnboarding] = useState({
    role: "",
    careFor: "",
    comfortLevel: "",
    priorities: [],
  });

  const update = (data) =>
    setOnboarding((prev) => ({ ...prev, ...data }));

  return (
    <OnboardingContext.Provider value={{ onboarding, update }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
