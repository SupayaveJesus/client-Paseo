// src/service/walkService.js
import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// GET /walks  (lista del dueño)
const getOwnerWalks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks`, {
        headers: getAuthHeaders()
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

// GET /walks/:id  (detalle + locations)
const getWalkDetail = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks/${id}`, {
        headers: getAuthHeaders()
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const getWalkPhotos = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walks/${id}/photos`, {
        headers: getAuthHeaders()
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const createWalk = (walkData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/walks`, walkData, {   // ⬅️ /walks
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error("createWalk error:", error);
        reject(error);
      });
  });
};

const leaveReview = (id, reviewData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/walks/${id}/review`, reviewData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        }
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export { getOwnerWalks, getWalkDetail, getWalkPhotos, createWalk, leaveReview };
