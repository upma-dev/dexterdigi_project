import axios from "axios";
import apis from "./apis";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? token.replace(/^"(.*)"$/, "$1") : "";
};

export const createAuthorApi = async (payload) => {
  const token = getToken();
  return axios.post(apis.author.create, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAuthorsApi = async (params = {}) => {
  const token = getToken();
  return axios.get(apis.author.list, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

