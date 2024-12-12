import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

export const getRefKecamatan = async () => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kecamatan`
  );
};

export const getKecamatanBykdKabKota = async (kdKabKota) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/kecamatan/${kdKabKota}`
  );
};

export const getDataByNoReferensi = async (id) => {
  return await fetchInstanceLogin.get(
    `${BASE_URL}/api/v1/get/ref_kecamatan/${id}`
  );
};

export const saveData = async (data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/create/data/ref_kecamatan`,
    data
  );
};

export const updateDataByNoreferensi = async (id, data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/get/update/data/ref_kecamatan/${id}`,
    data
  );
};

export const deleteDataByNoreferensi = async (id) => {
  return await fetchInstanceLogin.delete(
    `${BASE_URL}/api/v1/get/delete/data/ref_kecamatan/${id}`
  );
};
