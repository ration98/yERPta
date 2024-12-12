import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

export const resetPassword = async (data) => {
  return await fetchInstanceLogin.post(
    `${BASE_URL}/api/v1/auth/reset-password`,
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
