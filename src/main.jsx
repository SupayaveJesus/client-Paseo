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

import ListPets from "./pages/owner/pets/ListPets";
import FormPet from "./pages/owner/pets/FormPest";
import PhotoProfilePets from "./pages/owner/pets/PhotoProfilePets";

import OwnerWalksPage from "./pages/owner/walks/OwnerWalksPage";
import OwnerWalkDetailPage from "./pages/owner/walks/OwnerWalkDetailPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* por ahora raíz = login dueño */}
        <Route path="/" element={<OwnerLoginPage />} />

        {/* AUTH DUEÑO */}
        <Route path="/login-owner" element={<OwnerLoginPage />} />
        <Route path="/register-owner" element={<OwnerRegister />} />
        <Route path="/owner/home" element={<OwnerHomePage />} />

        {/* AUTH PASEADOR */}
        <Route path="/login-walker" element={<WalkerLoginPage />} />
        <Route path="/register-walker" element={<WalkerRegister />} />
        <Route path="/walker/home" element={<WalkerHomePage />} />

        {/* DUEÑO - MASCOTAS */}
        <Route path="/owner/pets" element={<ListPets />} />
        <Route path="/owner/pets/create" element={<FormPet />} />
        <Route path="/owner/pets/:id/edit" element={<FormPet />} />
        <Route path="/owner/pets/:id/photo" element={<PhotoProfilePets />} />

        {/* DUEÑO - PASEOS */}
        <Route path="/owner/walks" element={<OwnerWalksPage />} />
        <Route path="/owner/walks/:id" element={<OwnerWalkDetailPage />} />
        {/* más adelante: /owner/walks/new para crear paseo */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
