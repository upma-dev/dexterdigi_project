import axios from "axios";
import apis from "./apis";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? token.replace(/^"(.*)"$/, "$1") : "";
};

export const createNewsApi = async (payload) => {
  const token = getToken();
  return axios.post(apis.news.create, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllNewsApi = async (params) => {
  const token = getToken();
  return axios.get(apis.news.list, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNewsByIdApi = async (id) => {
  const token = getToken();
  return axios.get(`${apis.news.getById}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateNewsApi = async (id, payload) => {
  const token = getToken();
  return axios.put(`${apis.news.update}${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteNewsApi = async (id) => {
  const token = getToken();
  return axios.delete(`${apis.news.delete}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeNewsStatusApi = async (id, status) => {
  const token = getToken();
  return axios.patch(
    `${apis.news.status}${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
