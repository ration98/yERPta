import { fetchInstance } from "../instance";
import { BASE_URL } from "../constant";

export const registerUser = async (data) => {
  return await fetchInstance.post(
    `${BASE_URL}/api/v1/auth/register`,
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

