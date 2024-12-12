import { fetchInstanceLogin } from "./instance";
import { BASE_URL } from "./constant";

export const getData = async () => {
  return await fetchInstanceLogin.get(`${BASE_URL}/api/v1/pengguna`);
};

export const getDataQuery = async () => {
  return await fetchInstanceLogin.get(`${BASE_URL}/api/v1/pengguna/query`);
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstanceLogin.get(`${BASE_URL}/api/v1/pengguna/${id}`);
};

export const getDataQueryByNoref = async (id) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/pengguna/query/${id}`
  );
};

export const saveData = async (data) => {
  return await fetchInstanceLogin.upload(`${BASE_URL}/api/v1/pengguna`, data);
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstanceLogin.putUpload(
    `${BASE_URL}/api/v1/pengguna/${id}`,
    data
  );
};

export const updateStatusByNoref = async (data) => {
  return await fetchInstanceLogin.put(
    `${BASE_URL}/api/v1/pengguna/update-status`,
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const deleteDataByNoreferensiPengguna = async (id) => {
  return await fetchInstanceLogin.delete(`${BASE_URL}/api/v1/pengguna/${id}`);
};

export const deleteFotoByNoreferensi = async (id) => {
  return await fetchInstanceLogin.delete(
    `${BASE_URL}/api/v1/pengguna/delete-foto/${id}`
  );
};
