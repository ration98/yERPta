import { fetchInstance } from "../instance";
import { BASE_URL } from "../constant";

export const getStatusData = async () => {
  return await fetchInstance.get(
    `${BASE_URL}/api/v1/ref-statusdata/get/ref-statusdata`
  );
};
