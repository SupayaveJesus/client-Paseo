import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`
});

const getMyReviews = () => {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/reviews`, {
      headers: getAuthHeaders()
    })
      .then(res => resolve(res.data))
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};

const getReviewById = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/reviews/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => resolve(res.data))
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};

export { getMyReviews, getReviewById };
