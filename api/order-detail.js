import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const sendDataOrderDetail = async (data) => {
  return await fetchInstance.post(`${BASE_URL}/api/v1/order-detail`, data);
};

export const updateDataOrderDetail = async (id, data) => {
  return await fetchInstance.put(`${BASE_URL}/api/v1/order-detail/${id}`, data);
};

export const getFkOrder = async (id) => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/order-detail/${id}`);
};

export const getById = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/order-detail/no-ref/${id}`
  );
};

export const getByFkProduk = async (id) => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/produk/${id}`);
};

export const getPpnById = async (id) => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ppn/get-data-ppn/${id}`);
};

export const getFkProduk = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/produk/get-data-produk`);
};

export const getFkPpn = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/Ppn/get-data-ppn`);
};

export const deleteOrderDetail = async (id) => {
  return await fetchInstance.delete(`${BASE_URL}/api/v1/order-detail/${id}`);
};
