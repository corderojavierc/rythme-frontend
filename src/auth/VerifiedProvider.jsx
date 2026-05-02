/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";

const VerifiedContext = createContext({
  isVerified: false,
  setIsVerified: () => {},
});

export function VerifiedProvider({ children }) {
  const savedAuth = localStorage.getItem("auth");
  const [isVerified, setIsVerified] = useState(savedAuth === "true");

  useEffect(() => {
    localStorage.setItem("verified", isVerified);
  }, [isVerified]);

  return (
    <VerifiedContext.Provider value={{ isVerified, setIsVerified }}>
      {children}
    </VerifiedContext.Provider>
  );
}

export function useVerified() {
  return useContext(VerifiedContext);
}
