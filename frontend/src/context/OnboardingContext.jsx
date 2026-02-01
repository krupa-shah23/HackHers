import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [onboarding, setOnboarding] = useState({
    role: null,          // self | caregiver | both
    careFor: null,       // parent | partner | child | other
    comfortLevel: null,  // high | medium | low
    priorities: [],      // meds, refills, routines, coordination
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
