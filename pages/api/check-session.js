import { verifyToken } from "../../lib/auth";

export default function handler(req, res) {
  const tokenData = verifyToken(req);

  if (!tokenData) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }

   // Berhasil verifikasi token, lanjutkan ke logika berikutnya
   return res.status(200).json({ message: 'Authenticated', user: tokenData });
}
