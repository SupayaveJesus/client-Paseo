// src/service/walkerService.js
import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

// POST /walkers/nearby
const getNearbyWalkers = (lat, lng) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${BASE_URL}/walkers/nearby`,
        { lat, lng },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

// GET /walkers/:id
const getWalkerById = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/walkers/${id}`, {
        headers: getAuthHeaders()
      })
      .then((response) => resolve(response.data))
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export { getNearbyWalkers, getWalkerById };
