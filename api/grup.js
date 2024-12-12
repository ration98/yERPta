import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getGrup = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/grup/query`);
};

export const getGrupById = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/grup/query/${id}`
  );
};

export const createGrup = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/grup`,
    JSON.stringify(data)
  );
};

export const updateGrupById = async (id, data) => {
  return await fetchInstance.put(
    `${BASE_URL}/api/v1/grup/${id}`,
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const deleteGrup = async (id) => {
  return await fetchInstance.delete(`${BASE_URL}/api/v1/grup/${id}`);
};

export const deleteGrupArray = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/grup/delete`, {
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


