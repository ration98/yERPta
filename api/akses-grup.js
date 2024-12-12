import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const addAksesGrup = async (data) => {
  await fetchInstance.post(
    `${BASE_URL}/api/v1/akses-grup`,
    JSON.stringify(data)
  );
};

export const deleteAksesGrup = async (fkAkses, fkPosisiModul, fkGrup) => {
  await fetchInstance.delete(
    `${BASE_URL}/api/v1/akses-grup/${fkAkses}/${fkPosisiModul}/${fkGrup}`
  );
};

export const addAksesGrupByModul = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/akses-grup/insert-modul`,
    JSON.stringify(data)
  );
};

export const deleteAksesGrupByModul = async (fkPosisiModul) => {
  return await fetchInstance.delete(
    `${BASE_URL}/api/v1/akses-grup/delete-modul/${fkPosisiModul}`
  );
};

export const addAksesGrupAll = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/akses-grup/insert-all`,
    JSON.stringify(data)
  );
};

export const deleteAksesGrupAll = async () => {
  return await fetchInstance.delete(`${BASE_URL}/api/v1/akses-grup/delete-all`);
};
