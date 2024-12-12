import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getDataTernak = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ternak/get-data-ternak`);
};

export const getDataTernakQuery = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ternak`);
};

export const findByNorefKeteranganTernak = async (id) => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ternak/by-noref/${id}`);
};

export const findByJkTernakIbu = async (jenisKelamin, noref) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/ternak/get-jenis-kelamin?jenisKelamin=${jenisKelamin}&id=${noref}`
  );
};

export const findByJkTernakAyah = async (jenisKelamin, noref) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/ternak/get-jenis-kelamin?jenisKelamin=${jenisKelamin}&id=${noref}`
  );
};

export const saveDataTernak = async (data) => {
  return await fetchInstance.upload(
    `${BASE_URL}/api/v1/ternak/create-data-ternak`,
    data
  );
};

export const getDataByNoReferensiTernak = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/ternak/get-data-ternak/${id}`
  );
};

export const deleteDataByNoreferensiTernak = async (id) => {
  return await fetchInstance.delete(`${BASE_URL}/api/v1/ternak/delete/${id}`);
};

export const deleteFotoByNorefTernak = async (id) => {
  return await fetchInstance.delete(
    `${BASE_URL}/api/v1/ternak/delete-foto/${id}`
  );
};

export const deleteDataArray = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/ternak/delete`, {
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

export const updateDataByNoreferensiTernak = async (id, data) => {
  return await fetchInstance.putUpload(
    `${BASE_URL}/api/v1/ternak/update-data-ternak/${id}`,
    data
  );
};

export const updateStatusTernak = async (id, data) => {
  return await fetchInstance.putUpload(
    `${BASE_URL}/api/v1/ternak/update-status-ternak/${id}`,
    data
  );
};
