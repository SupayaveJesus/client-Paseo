// src/service/ownerWalkerService.js
import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// POST /walkers/nearby  { lat, lng }
const findNearbyWalkers = (lat, lng) => {
  return new Promise((resolve, reject) => {
    axios.post(
      `${BASE_URL}/walkers/nearby`,
      { lat, lng },
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => resolve(res.data))
      .catch(err => {
        console.error("findNearbyWalkers error:", err);
        reject(err);
      });
  });
};

// GET /walkers/:id
const getWalkerDetailForOwner = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/walkers/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => resolve(res.data))
      .catch(err => {
        console.error("getWalkerDetailForOwner error:", err);
        reject(err);
      });
  });
};

export {
  findNearbyWalkers,
  getWalkerDetailForOwner
};
