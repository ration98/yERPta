const headers = {
  "Content-type": "application/json; charset=UTF-8",
};

// Fungsi umum untuk menangani request
const fetchData = async (url, method, data, isUpload = false) => {
  const options = {
    method,
    headers: isUpload ? undefined : headers, // Untuk upload, tidak perlu headers
    body: data,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json(); // Mengembalikan JSON langsung
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Fungsi instance yang dapat dipakai untuk login atau lainnya
export const fetchInstance = {
  get: async (url) => fetchData(`${url}`, "GET"),
  post: async (url, data) => fetchData(`${url}`, "POST", data),
  put: async (url, data) => fetchData(`${url}`, "PUT", data),
  delete: async (url) => fetchData(`${url}`, "DELETE"),
  upload: async (url, data) => fetchData(`${url}`, "POST", data, true), // Untuk upload
  putUpload: async (url, data) => fetchData(`${url}`, "PUT", data, true), // Untuk upload PUT
  deleteUpload: async (url) => fetchData(`${url}`, "DELETE"),
};
