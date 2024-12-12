import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getDataOrder = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/order-penjualan`);
};

export const sendDataOrder = async (data) => {
  return await fetchInstance.post(`${BASE_URL}/api/v1/order-penjualan`, data);
};

export const getOrderById = async (id) => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/order-penjualan/${id}`);
};

export const updateDataOrder = async (id, data) => {
  return await fetchInstance.put(
    `${BASE_URL}/api/v1/order-penjualan/${id}`,
    data
  );
};

export const forView = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/order-penjualan/view/${id}`
  );
};

export const updateStatusOrder = async (id, data) => {
  return await fetchInstance.put(
    `${BASE_URL}/api/v1/order-penjualan/update-status/${id}`,
    JSON.stringify(data)
  );
};

export const deleteDataArrayOP = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/order-penjualan/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.noreferensiArray), // Mengirimkan data dalam body
    });

    if (!response.ok) {
      throw new Error("Failed to delete data");
    }

    return response; // Kembalikan respons untuk diperiksa di handleConfirm
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Rethrow error untuk ditangani di handleConfirm
  }
};
