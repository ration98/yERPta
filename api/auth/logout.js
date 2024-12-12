import { fetchInstanceLogin } from "../instance";
import { BASE_URL } from "../constant";

// Fungsi logout yang mengambil token dari localStorage
export const logoutUser = async () => {
  const token = localStorage.getItem("authToken"); // Ambil token dari localStorage
  if (!token) {
    throw new Error("No token found"); // Error jika token tidak ditemukan
  }

  try {
    const response = await fetchInstanceLogin.post(
      `${BASE_URL}/api/v1/auth/logout`,
      {}, // Tidak butuh body untuk request logout
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token di header Authorization
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // Lempar kembali error agar bisa ditangani di tempat lain
  }
};
