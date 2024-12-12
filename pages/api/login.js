import jwt from "jsonwebtoken";
import cookie from "cookie";
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

// Buat koneksi ke database
const pool = mysql.createPool({
  host: "192.168.18.10", // host dari MariaDB (tanpa jdbc: pada hostname)
  user: "admin", // user database
  password: "admin123", // password database
  database: "miderp", // nama database
  port: 3306, // pastikan port sudah sesuai (default MariaDB)
});

// Fungsi validasi user
async function validateUser(namaPengguna, kataSandi) {
  try {
    // Query ke database untuk mendapatkan user berdasarkan nama_pengguna
    const [rows] = await pool.query(
      "SELECT no_referensi, id_pengguna, nama_pengguna, kata_sandi FROM tbl_pengguna WHERE nama_pengguna = ?",
      [namaPengguna]
    );

    // Jika user ditemukan
    if (rows.length > 0) {
      const user = rows[0];
      // Bandingkan kata sandi yang diinput dengan kata_sandi yang di-hash di database
      const isMatch = await bcrypt.compare(kataSandi, user.kata_sandi);

      if (isMatch) {
        // Jika kata sandi cocok, return data user
        return { id: user.id, namaPengguna: user.namaPengguna };
      }
    }

    // Jika tidak ditemukan atau kata sandi salah, return null
    return null;
  } catch (error) {
    console.error("Error saat memvalidasi user:", error);
    throw error;
  }
}

// Handler untuk API login
export default async function handler(req, res) {
  const { namaPengguna, kataSandi } = req.body;

  try {
    // Validasi pengguna menggunakan namaPengguna dan kataSandi
    const user = await validateUser(namaPengguna, kataSandi);

    // Jika validasi berhasil
    if (user) {
      // Buat token JWT
      const token = jwt.sign(
        { id: user.id, namaPengguna: user.namaPengguna }, // payload JWT
        process.env.JWT_SECRET, // Simpan rahasia JWT di environment variable
        { expiresIn: "1h" } // Token berlaku selama 1 jam
      );

      // Simpan token dalam cookies
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production" ? true : false, // false di development, true di production
          secure: false,
          maxAge: 3600, // Token berlaku selama 1 jam
          // sameSite: "strict",
          sameSite: "lax",
          path: "/",
        })
      );

      return res.status(200).json({
        message: "Login berhasil",
        user: { id: user.id, namaPengguna: user.namaPengguna },
        token: token,
      });
    }

    // Jika validasi gagal (user tidak ditemukan atau kata sandi salah)
    return res
      .status(401)
      .json({ message: "Nama pengguna atau kata sandi salah" });
  } catch (error) {
    // Jika ada kesalahan saat validasi atau koneksi ke database
    console.error("Login error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
}
