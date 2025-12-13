import { createContext, useState, useEffect } from "react";
import { setAccessToken, getAccessToken, removeAccessToken, getUserFromToken, getUserRole } from "../utils/TokenUtilities";
import { clientLogin, clientRegister, walkerLogin, walkerRegister } from "../service/authService";


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAccessToken() || null);
  const [user, setUser] = useState(getUserFromToken());
  const [role, setRole] = useState(getUserRole()); // "owner" | "walker" | null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = getAccessToken();
    if (storedToken && !token) {
      const payload = getUserFromToken();
      setToken(storedToken);
      setUser(payload);
      setRole(payload?.type || null);
    }
  }, []); 


  const loginOwner = (loginData) => {
    setLoading(true);
    return clientLogin(loginData)
      .then((data) => {

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
    role,            
    loading,
    isAuthenticated: !!token,

    loginOwner,
    loginWalker,
    registerOwner,
    registerWalker,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };