import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";
import OwnerLoginPage from "./pages/auth/OwnerLoginPage";
import WalkerLoginPage from "./pages/auth/WalkerLoginPage";
import OwnerRegister from "./pages/auth/OwnerRegister";
import WalkerRegister from "./pages/auth/WalkerRegister";
import OwnerHomePage from "./pages/owner/OwnerHomePage";
import WalkerHomePage from "./pages/walker/WalkerHomePage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login-owner" />} />

        <Route path="/register-owner" element={<OwnerRegister />} />
        <Route path="/login-owner" element={<OwnerLoginPage />} />
        
        <Route path="/login-walker" element={<WalkerLoginPage />} />
        <Route path="/register-walker" element={<WalkerRegister />} />

        <Route path="/owner/home" element={<OwnerHomePage />} />
        <Route path="/walker/home" element={<WalkerHomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
