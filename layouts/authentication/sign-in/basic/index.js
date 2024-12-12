import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../../../api/auth/login";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "../../../../context/userContext";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";

// Authentication layout components
import BasicLayout from "../../components/BasicLayout";
import intelsys from "../../../../assets/images/IntelsysLogoWithBg.png";
import intelsys2 from "../../../../assets/images/IntelsysLogoWithBg-removebg.png";
// Images
import bgImage from "../../../../assets/images/bg-sign-in-basic.jpeg";

// console.log("Background Image Path:", bgImage); IntelsysLogo

// Next.js Link component
import Link from "next/link";

// const bgImage = require("../../../../assets/images/bg-sign-in-basic.jpeg").default;
// console.log("Background Image Path:", bgImage);

const validationSchema = Yup.object().shape({
  namaPengguna: Yup.string().required("Nama pengguna wajib diisi*"),
  kataSandi: Yup.string().required("Kata sandi wajib diisi*"),
});

function Basic() {
  const { setUser, setExpiresAt } = useUser();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { login } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  //handlelogin local storage
  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await loginUser({
        namaPengguna: values.namaPengguna,
        kataSandi: values.kataSandi,
      });

      if (response && response.expiresIn) {
        const now = Math.floor(Date.now() / 1000);
        setUser(response);
        setExpiresAt(now + response.expiresIn);
        localStorage.setItem("expiresAt", now + response.expiresIn);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Login berhasil",
        });
        // Redirect ke halaman analytics
        router.push("/dashboards/analytics");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Nama pengguna atau kata sandi salah",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <BasicLayout image={bgImage.src || bgImage}>
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
                    textAlign: "center",
                    height: "auto",
                    width: "100%", // Menyesuaikan lebar dengan kontainer
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
              L O G I N
            </MDTypography>
          </Grid>
        </MDBox>

        <style jsx>{`
          @media (max-width: 768px) {
            img {
              max-width: 200px; /* Mengurangi ukuran logo untuk layar kecil */
            }
            .MuiTypography-h4 {
              font-size: 1.5rem; /* Ukuran teks lebih kecil pada layar kecil */
            }
            .MuiGrid-item {
              padding: 0 10px; /* Tambahkan padding pada grid agar lebih rapi */
            }
          }
        `}</style>

        <MDBox pt={4} pb={3} px={3}>
          <Formik
            initialValues={{ namaPengguna: "", kataSandi: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <MDBox mb={2}>
                  <Field name="namaPengguna">
                    {({ field }) => (
                      <MDInput
                        type="text"
                        label="Nama Pengguna"
                        fullWidth
                        {...field}
                        style={{ color: "#263238" }} // Warna teks lebih tegas
                        placeholder="Masukkan nama pengguna" // Placeholder lebih jelas
                      />
                    )}
                  </Field>
                  <ErrorMessage name="namaPengguna">
                    {(msg) => (
                      <MDTypography variant="caption" color="error">
                        {msg}
                      </MDTypography>
                    )}
                  </ErrorMessage>
                </MDBox>

                <MDBox mb={2}>
                  <Field name="kataSandi">
                    {({ field }) => (
                      <MDInput
                        type="password"
                        label="Kata Sandi"
                        fullWidth
                        {...field}
                        style={{ color: "#263238" }} // Warna teks lebih tegas
                        placeholder="Masukkan kata sandi" // Placeholder lebih jelas
                      />
                    )}
                  </Field>
                  <ErrorMessage name="kataSandi">
                    {(msg) => (
                      <MDTypography
                        variant="caption"
                        color="error"
                        style={{ color: "#e53935" }}
                      >
                        {msg}
                      </MDTypography>
                    )}
                  </ErrorMessage>
                </MDBox>

                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Ingat saya
                  </MDTypography>
                </MDBox>

                <MDBox mt={4} mb={1}>
                  <MDButton
                    variant="gradient"
                    // color="info"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                    // style={{
                    //   background: "linear-gradient(to right, #42a5f5, #0077c2)",
                    // }} // Gradient lebih menarik
                    style={{ backgroundColor: "#4caf50", color: "#ffffff" }} // Warna hijau untuk tombol login
                  >
                    {isSubmitting ? "Loading..." : "Login"}
                  </MDButton>
                </MDBox>

                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="button" color="text">
                    <Link href="/authentication/reset-password/cover">
                      <MDTypography
                        variant="button"
                        // color="info"
                        fontWeight="medium"
                        // textGradient
                        sx={{ cursor: "pointer", color: "#4caf50" }}
                      >
                        Lupa Kata Sandi?
                      </MDTypography>
                    </Link>
                  </MDTypography>
                </MDBox>
              </Form>
            )}
          </Formik>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
