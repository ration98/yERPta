import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

// --1
export const loginUser = async (data) => {
  try {
    const response = await fetchInstanceLogin.post(
      `${BASE_URL}/api/v1/auth/login`,
      JSON.stringify(data)
    );
    // Karena `fetchData` mengembalikan JSON, kita bisa langsung menggunakannya
    return response;
  } catch (error) {
    console.error("API call error:", error);
    throw error; // Lempar error agar bisa ditangkap di handleLogin
  }
};
