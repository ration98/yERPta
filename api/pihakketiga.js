import { fetchInstance } from "./instance";
import { BASE_URL } from "./constant";

export const getPihakKetiga = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/pihak-ketiga/query`);
};
