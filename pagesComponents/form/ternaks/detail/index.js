import { useEffect, useState } from "react";
import { Card, Grid, Icon, recomposeColor } from "@mui/material";
import MDBox from "/components/MDBox";
import MDButton from "/components/MDButton";
import MDInput from "/components/MDInput";
import MDTypography from "/components/MDTypography";
import {
  saveData,
  getDataByNoReferensi,
  updateDataByNoreferensi,
} from "../../../../api/ref_jenisternak";
import Swal from "sweetalert2";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";

function TernakDetail() {
  const [data, setData] = useState({});
  const router = useRouter();

  useEffect(() => {
    //setValidationMode('NoValidation')
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("id")) {
      getDataByNoReferensi(searchParams.get("id"))
        .then((val) => {
          if (val.ok) {
            return val.json();
          } else {
            alert("Gagal menghapus data!");
          }
        })
        .then((data) => setData(data));

      // setvisible(true);
      // setvisibleEdit(false);
      // data.tanggalKunjungan(date);
    } else {
      setData({});
    }
  }, []);

  const updateDataRef = async (id) => {
    try {
      const response = await updateDataByNoreferensi(id, JSON.stringify(data));

      if (!response.ok) {
        throw new Error("Gagal mengupdate data");
      }

      return response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleBack = () => {
    router.push("/form/ternaks/list");
  };

  const handleSubmit = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
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
          if (!id) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "ID tidak ditemukan",
            });
            return;
          }

          updateDataRef(id)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data Berhasil Diubah",
              }).then(() => router.push("/ternaks/list"));
            })
            .catch((error) => {
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
        console.log("Data to be sent:", JSON.stringify(data, null, 2)); // Log data yang akan dikirim
        const response = await saveData(JSON.stringify(data)).then((res) => {
          console.log(res);
          if (res.ok) {
            Swal.fire({
              title: "Data Tersimpan",
              text: data.message,
              icon: "success",
            }).then(() => router.push("/ternaks/list"));
          } else {
            Swal.fire({
              title: "Data Tidak Tersimpan",
              text: data.message,
              icon: "error",
            });
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <MDBox>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">Form Referensi Jenis Ternak</MDTypography>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              {/* Baris pertama */}
              <Grid item xs={12} md={6}>
                <MDInput
                  variant="outlined"
                  name="sandi"
                  label="Sandi"
                  value={data.sandi || ""}
                  onChange={handleDataChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  variant="outlined"
                  name="keterangan"
                  label="Keterangan"
                  value={data.keterangan || ""}
                  onChange={handleDataChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container mt={2} justifyContent="flex-end">
              <MDButton
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                type="button"
                onClick={handleBack}
              >
                Kembali
              </MDButton>
              <Grid ml={1}>
                <MDButton
                  variant="contained"
                  color="primary"
                  startIcon={<Icon>save</Icon>}
                  onClick={handleSubmit}
                >
                  Simpan
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default TernakDetail;
