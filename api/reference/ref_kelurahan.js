import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

export const getRefKelurahan = async () => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kelurahan`
  );
};

export const getKelurahanBykdKecamatan = async (kdKecamatan) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/kelurahan/${kdKecamatan}`
  );
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kelurahan/${id}`
  );
};

export const saveData = async (data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/create/data/ref_kelurahan`,
    data
  );
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/update/data/ref_kelurahan/${id}`,
    data
  );
};

export const deleteDataByNoreferensi = async (id) => {
  return await fetchInstanceLogin.delete(
    `${BASE_URL}/api/v1/get/delete/data/ref_kelurahan/${id}`
  );
};
