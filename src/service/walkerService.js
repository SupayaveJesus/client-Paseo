// src/service/walkerService.js
import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// ======================================
// DISPONIBILIDAD Y UBICACIÓN
// ======================================

// POST /walkers/availability  { isAvailable: true|false }
const setAvailability = (isAvailable) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walkers/availability`,
        { isAvailable },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("setAvailability error:", err);
        reject(err);
      });
  });
};

// POST /walkers/location  { lat, lng }
const sendLocation = (lat, lng) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walkers/location`,
        { lat, lng },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          }
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("sendLocation error:", err);
        reject(err);
      });
  });
};

// ======================================
// PASEOS DEL PASEADOR
// ======================================

// GET /walks/pending
const getPendingWalks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks/pending`, {
        headers: getAuthHeaders()
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("getPendingWalks error:", err);
        reject(err);
      });
  });
};

// GET /walks/accepted
const getAcceptedWalks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks/accepted`, {
        headers: getAuthHeaders()
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("getAcceptedWalks error:", err);
        reject(err);
      });
  });
};

// 🔴 IMPORTANTE: historial del paseador va a /walks/history
// GET /walks/history  (historial del paseador)
const getHistoryWalks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks/history`, {
        headers: getAuthHeaders()
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("getHistoryWalks error:", err);
        reject(err);
      });
  });
};

// POST /walks/:id/accept
const acceptWalk = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walks/${id}/accept`,
        {},
        { headers: getAuthHeaders() }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("acceptWalk error:", err);
        reject(err);
      });
  });
};

// POST /walks/:id/reject
const rejectWalk = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walks/${id}/reject`,
        {},
        { headers: getAuthHeaders() }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("rejectWalk error:", err);
        reject(err);
      });
  });
};

// POST /walks/:id/start
const startWalk = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walks/${id}/start`,
        {},
        { headers: getAuthHeaders() }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("startWalk error:", err);
        reject(err);
      });
  });
};

// POST /walks/:id/end
const endWalk = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walks/${id}/end`,
        {},
        { headers: getAuthHeaders() }
      )
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("endWalk error:", err);
        reject(err);
      });
  });
};

// POST /walks/:id/photo   (subir foto del paseo)
const uploadWalkPhoto = (id, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("photo", file);

    axios
      .post(`${BASE_URL}/walks/${id}/photo`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.error("uploadWalkPhoto error:", err);
        reject(err);
      });
  });
};

export {
  setAvailability,
  sendLocation,
  getPendingWalks,
  getAcceptedWalks,
  getHistoryWalks,
  acceptWalk,
  rejectWalk,
  startWalk,
  endWalk,
  uploadWalkPhoto
};
