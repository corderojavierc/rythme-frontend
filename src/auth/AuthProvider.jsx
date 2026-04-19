import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
});

export function AuthProvider({ children }) {
    const savedAuth = localStorage.getItem("auth");
    const [isAuthenticated, setIsAuthenticated] = useState(savedAuth === "true");

    useEffect(() => {
        localStorage.setItem("auth", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
