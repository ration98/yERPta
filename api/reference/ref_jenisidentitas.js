import { fetchInstanceLogin } from "../instance_login";
import { BASE_URL } from "../constant";

export const getRefJenisIdentitas = async () => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_jnsidentitas`
  );
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_jnsidentitas/${id}`
  );
};

export const saveData = async (data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/create/data/ref_jnsidentitas`,
    data
  );
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/update/data/ref_jnsidentitas/${id}`,
    data
  );
};

export const deleteDataByNoreferensi = async (id) => {
  return await fetchInstanceLogin.delete(
    `${BASE_URL}/api/v1/get/delete/data/ref_jnsidentitas/${id}`
  );
};
