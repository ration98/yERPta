import { fetchInstance } from "../instance";
import { BASE_URL } from "../constant";

export const getMetodePengiriman = async () => {
  return await fetchInstance.get(`${BASE_URL}/api/v1/ref-metodepengiriman`);
};
