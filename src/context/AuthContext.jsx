import { createContext, useState, useEffect } from "react";
import { setAccessToken, getAccessToken, removeAccessToken, getUserFromToken, getUserRole } from "../utils/TokenUtilities";
import { clientLogin, clientRegister, walkerLogin, walkerRegister } from "../service/authService";


// Contexto
const AuthContext = createContext(null);

// Provider
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken() || null);
  const [user, setUser] = useState(getUserFromToken());
  const [role, setRole] = useState(getUserRole()); // "owner" | "walker" | null
  const [loading, setLoading] = useState(false);

  // Cuando cambie el token en localStorage (por ejemplo al recargar)
  useEffect(() => {
    const storedToken = getAccessToken();
    if (storedToken && !token) {
      const payload = getUserFromToken();
      setToken(storedToken);
      setUser(payload);
      setRole(payload?.type || null);
    }
  }, []); // solo al montar

  // =========================
  //  LOGIN / REGISTER
  // =========================

  const loginOwner = (loginData) => {
    setLoading(true);
    return clientLogin(loginData)
      .then((data) => {
        // data.token viene del backend
        setAccessToken(data.token);
        const payload = getUserFromToken();

        setToken(data.token);
        setUser(payload);
        setRole(payload?.type || "owner");

        setLoading(false);
        return data;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  const loginWalker = (loginData) => {
    setLoading(true);
    return walkerLogin(loginData)
      .then((data) => {
        setAccessToken(data.token);
        const payload = getUserFromToken();

        setToken(data.token);
        setUser(payload);
        setRole(payload?.type || "walker");

        setLoading(false);
        return data;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // El requerimiento dice que después del register
  // se vuelve a la pantalla de login, así que aquí
  // NO guardamos token, solo llamamos a la API.
  const registerOwner = (registerData) => {
    return clientRegister(registerData);
  };

  const registerWalker = (registerData) => {
    return walkerRegister(registerData);
  };

  const logout = () => {
    clearAccessToken();
    setToken(null);
    setUser(null);
    setRole(null);
  };

  const value = {
    token,
    user,
    role,            // "owner" o "walker"
    loading,
    isAuthenticated: !!token,

    // acciones
    loginOwner,
    loginWalker,
    registerOwner,
    registerWalker,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };