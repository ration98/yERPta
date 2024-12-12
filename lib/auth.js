import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const verifyToken = (req) => {
  // Gunakan cookie-parser untuk parsing cookies
  cookieParser()(req, {}, () => {});

  const token = req.cookies.token;

  console.log("Received cookies:", req.cookies);
  console.log("ini token: ", token);

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
