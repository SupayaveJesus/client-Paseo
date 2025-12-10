// src/service/petService.js
import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// LISTAR MASCOTAS DEL DUEÑO → GET /pets
const getPets = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/pets`, {          // ⬅️ /pets
        headers: getAuthHeaders(),
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("getPets error:", error);
        reject(error);
      });
  });
};

// CREAR MASCOTA → POST /pets
const createPet = (petData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/pets`, petData, {   // ⬅️ /pets
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("createPet error:", error);
        reject(error);
      });
  });
};

// ACTUALIZAR MASCOTA → PUT /pets/:id
const updatePet = (id, petData) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${BASE_URL}/pets/${id}`, petData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("updatePet error:", error);
        reject(error);
      });
  });
};

// ELIMINAR MASCOTA → DELETE /pets/:id
const deletePet = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${BASE_URL}/pets/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("deletePet error:", error);
        reject(error);
      });
  });
};

// SUBIR FOTO → POST /pets/:id/photo
const uploadPetPhoto = (id, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("photo", file);

    axios
      .post(`${BASE_URL}/pets/${id}/photo`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("uploadPetPhoto error:", error);
        reject(error);
      });
  });
};

export { getPets, createPet, updatePet, deletePet, uploadPetPhoto };
