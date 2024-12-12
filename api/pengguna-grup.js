import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getGrupPenggunaDropdown = async (fkGrup) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/grup-karyawan/non-assigned-users?fkGrup=${fkGrup}`
  );
};

export const createGrupPengguna = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/grup-karyawan`,
    JSON.stringify(data)
  );
};

export const getGrupPengguna = async (groupId) => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/grup-karyawan/group-users?fkGrup=${groupId}`
  );
};

export const deleteGrupPengguna = async (fkGrup, fkPengguna) => {
  return await fetchInstance.delete(
    `${BASE_URL}/api/v1/grup-karyawan/delete-users/${fkGrup}/${fkPengguna}`
  );
};
