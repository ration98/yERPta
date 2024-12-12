import { useEffect, useState } from "react";
import { Card, Grid, Icon, TextField } from "@mui/material";
import MDBox from "/components/MDBox";
import MDButton from "/components/MDButton";
import MDTypography from "/components/MDTypography";
import Swal from "sweetalert2";
import {
  ArrowBack,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createGrup,
  getGrupById,
  updateGrupById,
  deleteGrup,
} from "../../../../api/grup";

function GrupPenggunaDetail({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData || {});
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");

    if (id) {
      getGrupById(id)
        .then((response) => {
          if (response) {
            return response.json();
          } else {
            alert("Terjadi kesalahan saat mengambil data!");
            return null;
          }
        })
        .then((data) => {
          if (data) {
            setData(data);
            formik.setValues(data);
          }
        })
        .catch(() => alert("Terjadi kesalahan pada saat mengambil data!"));
    } else {
      setData({});
    }
  }, []);

  const updateData = async (id, data) => {
    try {
      const response = await updateGrupById(id, data);

      if (!response) {
        throw new Error("Gagal mengupdate data");
      }

      return response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  // Mendefinisikan pola regex
  const regexPatterns = {
    Alphabet: /^[A-Za-z\b ]+$/,
  };

  // Membuat fungsi untuk membuat field validasi
  const createValidationField = (type, regex, errorMessage) =>
    Yup.string()
      .matches(regex, errorMessage)
      .required(`Kolom ${type} wajib diisi`);

  // Membuat skema validasi menggunakan Yup
  const validationSchema = Yup.object({
    namaGrup: createValidationField(
      "Nama Grup",
      regexPatterns.Alphabet,
      "Kolom Nama Grup harus berupa huruf"
    ),
  });

  const formik = useFormik({
    initialValues: {
      namaGrup: data.namaGrup || "",
      catatan: data.catatan || "",
    },
    enableReinitialize: true,
    validationSchema,

    onSubmit: async (values) => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      console.log("Data yang akan disubmit:", JSON.stringify(values, null, 2)); // Debugging

      if (id) {
        // Update logic
        Swal.fire({
          title: "Apakah anda yakin Ingin Mengubah Data Ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ubah",
          cancelButtonText: "Kembali",
        }).then((result) => {
          if (result.isConfirmed) {
            updateData(id, values)
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil",
                  text: "Data Berhasil Diubah",
                }).then(() => router.push("/karyawan-dan-grup/grup/grup-list"));
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Gagal",
                  text: "Data Gagal Diubah",
                });
              });
          }
        });
      } else {
        try {
          const res = await createGrup(values);
          console.log("Respon dari API saat membuat data:", res);
          if (res) {
            Swal.fire({
              title: "Data Tersimpan",
              text: "Data berhasil disimpan",
              icon: "success",
            }).then(() => router.push("/karyawan-dan-grup/grup/grup-list"));
          } else {
            Swal.fire({
              title: "Data Tidak Tersimpan",
              text: "Terjadi kesalahan saat menyimpan data",
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Terjadi kesalahan saat menyimpan data",
            icon: "error",
          });
          console.error("Kesalahan saat menyimpan data:", error);
        }
      }
    },
  });

  const handleDelete = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    Swal.fire({
      title: "Anda Yakin Untuk Menghapus Data Ini?",
      text: "Data Yang Anda Hapus Tidak Akan Bisa Dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDelete(true);
          await deleteGrup(id).then((response) => {
            //tadi tekabaca response na, karena make await, jadi kudu berurutan, naon teh te di dagoan kitu la, jadi tadi si response teh hasilna undefined, sekian tq
            console.log("Response:", response);
            if (response) {
              Swal.fire({
                title: "Berhasil!",
                text: "Data telah dihapus",
                icon: "success",
                showConfirmButton: false,
              }).then(() => router.push("/karyawan-dan-grup/grup/grup-list"));
            } else {
              throw new Error("Failed to delete");
            }
          });
        } catch (error) {
          console.error("Error:", error);
          Swal.fire({
            title: "Gagal!",
            text: "Data gagal dihapus",
            icon: "error",
            showConfirmButton: false,
          });
        }
      }
    });
  };

  // const handleBack = () => {
  //   console.log("URL changed", window.location.search);
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const id = searchParams.get("id");

  //   router.push(`/karyawan-dan-grup/grup/grup-list`);
  // };

  const handleBack = () => {
    console.log("URL changed", window.location.search);
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");

    if (id) {
      router.push(`/karyawan-dan-grup/grup/grup-view?id=${id}`);
    } else {
      router.push(`karyawan-dan-grup/grup/grup-list`);
    }
  };

  return (
    <MDBox>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">Grup Detail</MDTypography>
          <form onSubmit={formik.handleSubmit}>
            <MDBox mt={4}>
              {/* Nama Grup */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    variant="outlined"
                    name="namaGrup"
                    label="Nama Grup"
                    value={formik.values.namaGrup}
                    onChange={(e) => {
                      console.log("namaGrup changed:", e.target.value); // Log saat namaGrup berubah
                      formik.handleChange(e);
                    }}
                    error={
                      formik.touched.namaGrup && Boolean(formik.errors.namaGrup)
                    }
                    helperText={
                      formik.touched.namaGrup && formik.errors.namaGrup
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* Catatan */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={5}>
                  <TextField
                    variant="outlined"
                    name="catatan"
                    label="Catatan"
                    value={formik.values.catatan}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.catatan && Boolean(formik.errors.catatan)
                    }
                    helperText={formik.touched.catatan && formik.errors.catatan}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
              {/* Button Back & Save */}
              <Grid container mt={2} justifyContent="flex-end">
                <MDButton
                  variant="outlined"
                  color="dark"
                  startIcon={<ArrowBack />}
                  type="button"
                  onClick={handleBack}
                  sx={{ ml: 2 }}
                >
                  Kembali
                </MDButton>
                {/* <MDButton
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<DeleteIcon />}
                  sx={{
                    ml: 2,
                    backgroundColor: "#ff0000",
                    "&:hover": { backgroundColor: "#cc0000" },
                  }}
                  onClick={handleDelete}
                >
                  Hapus
                </MDButton> */}
                {/* <Grid ml={1}> */}
                <MDButton
                  variant="contained"
                  color="dark"
                  startIcon={<Icon>save</Icon>}
                  type="submit"
                  sx={{ ml: 2 }}
                >
                  Simpan
                </MDButton>
                {/* </Grid> */}
              </Grid>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default GrupPenggunaDetail;
