import React, { useState } from "react";
import Swal from "sweetalert2";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";

// Authentication layout components
import CoverLayout from "../../components/CoverLayout";

// Images
import bgImage from "../../../../assets/images/bg-sign-in-cover.jpeg";
import intelsys2 from "../../../../assets/images/IntelsysLogoWithBg-removebg.png";

// Next.js Link component
import Link from "next/link";

import { resetPassword } from "../../../../api/auth/resetPassword";

function Cover() {
  const [namaPengguna, setNamaPengguna] = useState("");
  const [newKataSandi, setNewKataSandi] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      namaPengguna: namaPengguna,
      newKataSandi: newKataSandi,
    };

    try {
      await resetPassword(data);
      Swal.fire({
        title: "Sukses!",
        text: "Kata sandi berhasil diganti.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error:", error); // Log error for debugging purposes
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage.src || bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="white"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }} // Tambahkan shadow pada card
        >
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "10vh", mb: 2, mt: 0 }}
          >
            <Grid item xs={12}>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  transition: "transform 0.3s ease-in-out", // Animasi zoom saat hover
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)"; // Zoom in saat hover
                  e.currentTarget.querySelector("img").style.filter =
                    "drop-shadow(0px 0px 12px #00e5ff)"; // Efek neon intensif saat hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.querySelector("img").style.filter =
                    "drop-shadow(0px 0px 8px #00e5ff)"; // Kembali ke efek neon normal
                }}
              >
                <img
                  src={intelsys2.src || intelsys2}
                  alt="IntelsysLogo"
                  style={{
                    height: "auto",
                    width: "100%", // Menyesuaikan dengan lebar kontainer
                    maxWidth: "300px", // Batas maksimum lebar
                    objectFit: "contain",
                    filter: "drop-shadow(0px 0px 8px #00e5ff)", // Efek neon biru default
                    transition: "filter 0.3s ease-in-out", // Transisi halus untuk efek neon
                  }}
                />
              </div>
            </Grid>
            <MDTypography
              variant="h4"
              fontWeight="medium"
              style={{ color: "#4caf50", marginTop: "8px" }}
            >
              RESET PASSWORD
            </MDTypography>
          </Grid>
        </MDBox>

        <style jsx>{`
          @media (max-width: 768px) {
            img {
              max-width: 200px; /* Ukuran logo lebih kecil di layar yang lebih kecil */
            }
            .MuiTypography-h4 {
              font-size: 1.5rem; /* Ukuran font lebih kecil di perangkat mobile */
            }
            .MuiGrid-item {
              padding: 0 10px; /* Tambahkan padding di grid agar lebih rapi */
            }
          }

          @media (max-width: 480px) {
            img {
              max-width: 150px; /* Logo lebih kecil pada layar sangat kecil */
            }
            .MuiTypography-h4 {
              font-size: 1.2rem; /* Ukuran font lebih kecil lagi untuk layar kecil */
            }
          }
        `}</style>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <MDInput
                type="text"
                label="Nama Pengguna"
                variant="standard"
                fullWidth
                value={namaPengguna}
                onChange={(e) => setNamaPengguna(e.target.value)}
                placeholder="Masukkan nama pengguna" // Placeholder lebih jelas
              />
            </MDBox>
            <MDBox mb={4}>
              <MDInput
                type="password"
                label="Kata Sandi Baru"
                variant="standard"
                fullWidth
                value={newKataSandi}
                onChange={(e) => setNewKataSandi(e.target.value)}
                placeholder="Masukkan kata sandi baru" // Placeholder lebih jelas
              />
            </MDBox>
            <MDBox mt={6} mb={1}>
              {/* Biru */}
              {/* <MDButton variant="gradient" color="info" fullWidth type="submit"> */}
              <MDButton
                variant="gradient"
                style={{ backgroundColor: "#4caf50", color: "#ffffff" }}
                fullWidth
                type="submit"
              >
                Reset
              </MDButton>
            </MDBox>
            {message && (
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  {message}
                </MDTypography>
              </MDBox>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Kembali ke halaman{" "}
                <Link href="/authentication/sign-in/basic" passHref>
                  <MDTypography
                    component="span"
                    variant="button"
                    // color="info"
                    fontWeight="medium"
                    // textGradient
                    style={{ cursor: "pointer", color: "#4caf50" }}
                  >
                    Login
                  </MDTypography>
                </Link>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
