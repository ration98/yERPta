import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getDataGudang = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/gudang/get-data-gudang`);
};
