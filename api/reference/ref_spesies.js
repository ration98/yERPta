import { fetchInstance } from "../instance";
import { BASE_URL } from "../constant";

export const getSpesies = async () => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/referensi-spesies/get-all`
  );
};

export const getSpesiesByInduk = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/referensi-spesies/get-induk/${id}`
  );
};
