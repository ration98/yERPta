import { fetchInstance } from "../instance";
import { BASE_URL } from "../constant";

export const getDataRefJenisTernak = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ref-jenisternak/get-all`);
};

export const saveData = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/ref-jenisternak/create-ref-jenisternak`,
    data
  );
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/ref-jenisternak/get/data-ref-jenisternak/${id}`
  );
};

export const deleteDataByNoreferensi = async (id) => {
  return await fetchInstance.delete(
    `${BASE_URL}/api/v1/ref-jenisternak/delete/${id}`
  );
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/ref-jenisternak/update-ref-jenisternak/${id}`,
    data
  );
};
