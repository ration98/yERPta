const headers = {
  "Content-type": "application/json; charset=UTF-8",
};

const fetchData = async (url, method, data) => {
  const options = {
    method,
    headers,
    body: data,
  };

  try {
    const response = await fetch(url, options);
    // const responseData = await response.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDataUpload = async (url, method, data) => {
  const options = {
    method,
    body: data,
  };

  try {
    const response = await fetch(url, options);
    // const responseData = await response.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};

const fetchDataLogin = async (url, method, data) => {
  const options = {
    method,
    headers,
    body: data,
  };

  try {
    const response = await fetch(url, options);
    // const textResponse = await response;

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json(); // Langsung mengembalikan JSON
    // return JSON.parse(response); // Parsing JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const fetchDataUploadLogin = async (url, method, data) => {
  const options = {
    method,
    body: data, // Data dikirim langsung tanpa JSON.stringify
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Langsung mengembalikan JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const fetchInstance = {
  get: async (url) => fetchData(`${url}`, "GET"),
  post: async (url, data) => fetchData(`${url}`, "POST", data),
  put: async (url, data) => fetchData(`${url}`, "PUT", data),
  delete: async (url) => fetchData(`${url}`, "DELETE"),
  upload: async (url, data) => fetchDataUpload(`${url}`, "POST", data),
  putUpload: async (url, data) => fetchDataUpload(`${url}`, "PUT", data),
};

export const fetchInstanceLogin = {
  get: async (url) => fetchDataLogin(`${url}`, "GET"),
  post: async (url, data) => fetchDataLogin(`${url}`, "POST", data),
  put: async (url, data) => fetchDataLogin(`${url}`, "PUT", data),
  delete: async (url) => fetchDataLogin(`${url}`, "DELETE"),
  upload: async (url, data) => fetchDataUploadLogin(`${url}`, "POST", data),
  putUpload: async (url, data) => fetchDataUploadLogin(`${url}`, "PUT", data),
  deleteUpload: async (url) => fetchDataLogin(`${url}`, "DELETE"),
};
