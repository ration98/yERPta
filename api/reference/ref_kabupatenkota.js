import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

export const getRefKabupatenKota = async () => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kabupatenkota`
  );
};

export const getKabupatenKotaByProvinsi = async (kdProvinsi) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/kabupatenkota/${kdProvinsi}`
  );
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kabupatenkota/${id}`
  );
};

export const saveData = async (data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/create/data/ref_kabupatenkota`,
    data
  );
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/update/data/ref_kabupatenkota/${id}`,
    data
  );
};

export const deleteDataByNoreferensi = async (id) => {
  return await fetchInstanceLogin.delete(
    `${BASE_URL}/api/v1/get/delete/data/ref_kabupatenkota/${id}`
  );
};
