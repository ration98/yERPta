import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Typography, Card, Divider, Tabs, Tab } from "@mui/material";
import MDButton from "/components/MDButton";
import MDBox from "/components/MDBox";
import {
  ArrowBack,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { getGrupById, deleteGrup } from "../../../../api/grup";
import PenggunaGrupList from "./pengguna-grup";
import GrupAkses from "./grup-akses";
import { getAksesModul } from "../../../../api/akses-menu";

function GrupView({ initialData }) {
  const router = useRouter();
  const { id } = router.query;
  const [isDelete, setIsDelete] = useState(false);
  const [data, setData] = useState(initialData || {});
  //untuk mendapatkan id grup dari query parameter
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  //tab
  const [tabIndex, setTabIndex] = useState(0);
  //modul
  const [moduleAccessData, setModuleAccessData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!initialData && id) {
          const response = await getGrupById(id);
          const fetchedData = await response.json();
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id && id !== selectedGroupId) setSelectedGroupId(id); // Set selectedGroupId jika ID dari URL tersedia
    fetchData();
  }, [id, initialData]);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const response = await getAksesModul(id);
        if (response.ok) {
          const fetchedModuleData = await response.json();
          setModuleAccessData(fetchedModuleData);
        } else {
          console.error("Error fetching module data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    };

    fetchModuleData();
  }, [id]);

  const handleBackToList = () => {
    router.push("/karyawan-dan-grup/grup/grup-list");
  };

  const handleEdit = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    router.push(`/karyawan-dan-grup/grup/grup-detail?id=${id}`);
  };

  const fieldsAboveFoto = ["namaGrup"];

  const fieldsBelowFoto = ["catatan", "tglDimodifikasi"];

  const customFieldNames = {
    catatan: "Deskripsi Grup",
    tglDimodifikasi: "Tanggal Dimodifikasi",
  };

  // Fungsi untuk memformat tanggal menjadi dd-MM-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, " - ");
  };

  const StyledBoxKridensial = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    // padding: "10px 0",
    padding: "15px 20", // Tambah padding agar lebih luas
    textAlign: "center",
    borderRadius: "8px",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Lebih halus
    transition: "background-color 0.3s ease",
    maxWidth: "80%",
    // maxWidth: "100%", // Perluas ke full-width
    // margin: "0 auto",
    margin: "20px auto", // Tambah margin di atas dan bawah
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  };

  const StyledTypographyKridensial = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    fontWeight: "bold",
    fontSize: "1.4rem", // Sedikit diperbesar
    fontFamily: "'Roboto', sans-serif",
    marginBottom: "10px", // Tambah jarak ke bawah
  };

  const handleDelete = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    Swal.fire({
      title: "Anda yakin untuk menghapus data ini?",
      text: "Data yang anda hapus tidak akan bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batalkan",
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Dibatalkan",
          text: "Operasi penghapusan data dibatalkan.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const defaultHRMgrup = "/assets/images/foto-grup/hrm.png";
  const defaultSCMgrup = "/assets/images/foto-grup/inventory.png";
  const defaultCRMgrup = "/assets/images/foto-grup/handshake.png";
  const defaultOperationalgrup = "/assets/images/foto-grup/agriculture.png";
  const defaultAccountinggrup = "/assets/images/foto-grup/calculate.png";

  // Logika untuk memilih gambar berdasarkan nama grup
  const getGroupImage = (namaGrup) => {
    const lowerCaseNamaGrup = namaGrup?.toLowerCase();

    switch (lowerCaseNamaGrup) {
      case "hrm":
        return defaultHRMgrup;
      case "scm":
        return defaultSCMgrup;
      case "crm":
        return defaultCRMgrup;
      case "operational":
      case "operasional":
        return defaultOperationalgrup;
      case "accounting":
      case "akuntansi":
        return defaultAccountinggrup;
      default:
        return defaultHRMgrup; // Gambar default jika tidak ada yang cocok
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Grup View" />
        <Tab label="Akses Grup" />
      </Tabs>
      {tabIndex === 0 && (
        <MDBox mt={3}>
          <Grid container alignItems="center" spacing={2}>
            {/* Bagian Foto */}
            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
              <MDBox
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
                  padding: 2,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "16px", // Tambahkan jarak di bawah gambar
                }}
              >
                <img
                  // Jika data.foto ada, gunakan itu, jika tidak, gunakan defaultHRMgrup
                  src={getGroupImage(data.namaGrup)}
                  alt="Foto Grup"
                  style={{
                    width: 140, // Atur lebar sesuai kebutuhan
                    height: "auto", // Menjaga aspek rasio
                    maxHeight: 180, // Atur tinggi maksimum jika diperlukan
                    maxWidth: "100%", // Sesuaikan agar tidak lebih dari kontainer
                  }}
                />
              </MDBox>
            </Grid>

            {/* Bagian Samping Foto */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                {fieldsAboveFoto.map((field) => (
                  <Grid item xs={12} key={field}>
                    <MDBox
                      mb={-1}
                      display="flex"
                      alignItems="center"
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        textAlign: { xs: "center", sm: "left" },
                        fontSize: field === "namaGrup" ? "2.6rem" : "inherit",
                        fontWeight: field === "namaGrup" ? "bold" : "normal",
                      }}
                    >
                      {field === "namaGrup" && (
                        <MDBox display="flex" alignItems="center">
                          <span>
                            {data[field] || "Nama Grup tidak tersedia"}
                          </span>
                        </MDBox>
                      )}
                      {["namaGrup"].indexOf(field) === -1 && (
                        <span>{data[field]}</span>
                      )}
                    </MDBox>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Bagian Bawah Foto & penggunaGrup */}
            <Grid container spacing={2} mt={4}>
              {fieldsBelowFoto.slice(0, 5).map((field, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={field}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <MDBox
                    mb={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexGrow={1} // Membuat box ini memanjang secara fleksibel
                  >
                    <MDBox display="flex" alignItems="center" width="100%">
                      <Typography
                        variant="subtitle1"
                        sx={{ width: "40%", marginRight: "20px" }}
                      >
                        {customFieldNames[field]}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          overflow: "hidden", // Mencegah teks meluap
                          textOverflow: "ellipsis", // Menampilkan "..." jika teks terpotong
                          wordWrap: "break-word", // Memastikan kata panjang akan dipotong
                          maxWidth: "60%", // Membatasi lebar teks agar tidak melebihi grid
                        }}
                      >
                        {field === "tglDimodifikasi"
                          ? formatDate(data[field])
                          : data[field]}
                      </Typography>
                    </MDBox>
                  </MDBox>

                  {/* Divider ditempatkan setelah setiap item kecuali yang terakhir */}
                  {index < fieldsBelowFoto.slice(0, 5).length && (
                    <Divider
                      sx={{
                        borderTopWidth: 2,
                        borderTopColor: "rgba(0, 0, 0, 0.7)",
                        width: "100%",
                        mt: 1,
                      }}
                    />
                  )}
                </Grid>
              ))}

              <Grid item xs={12}>
                <MDBox sx={StyledBoxKridensial}>
                  <Typography
                    variant="subtitle1"
                    sx={StyledTypographyKridensial}
                  >
                    {/* <VpnKeyIcon sx={{ marginRight: "8px", color: "#1976d2" }} />{" "} */}
                    Daftar Pengguna Dalam Grup
                  </Typography>
                </MDBox>
                {/* <PenggunaGrup groupId={selectedGroupId} /> */}
                {selectedGroupId && (
                  <PenggunaGrupList groupId={selectedGroupId} />
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Button Kembali, Hapus, Edit */}
          <MDBox mt={3} display="flex" justifyContent="flex-end">
            <MDButton
              variant="outlined"
              color="dark"
              size="large"
              onClick={handleBackToList}
              startIcon={<ArrowBack />}
              sx={{ ml: 2 }}
            >
              Kembali
            </MDButton>
            <MDButton
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
            </MDButton>
            <MDButton
              variant="contained"
              color="dark"
              size="large"
              startIcon={<EditIcon />}
              sx={{ ml: 2 }}
              onClick={handleEdit}
            >
              Modifikasi
            </MDButton>
          </MDBox>
        </MDBox>
      )}
      {tabIndex === 1 && (
        <MDBox mt={3}>
          <Grid container alignItems="center" spacing={2}>
            {/* Bagian Foto */}
            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
              <MDBox
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
                  padding: 2,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "16px", // Tambahkan jarak di bawah gambar
                }}
              >
                <img
                  // Jika data.foto ada, gunakan itu, jika tidak, gunakan defaultHRMgrup
                  src={getGroupImage(data.namaGrup)}
                  alt="Foto Grup"
                  style={{
                    width: 140, // Atur lebar sesuai kebutuhan
                    height: "auto", // Menjaga aspek rasio
                    maxHeight: 180, // Atur tinggi maksimum jika diperlukan
                    maxWidth: "100%", // Sesuaikan agar tidak lebih dari kontainer
                  }}
                />
              </MDBox>
            </Grid>

            {/* Bagian Samping Foto */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                {fieldsAboveFoto.map((field) => (
                  <Grid item xs={12} key={field}>
                    <MDBox
                      mb={-1}
                      display="flex"
                      alignItems="center"
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        textAlign: { xs: "center", sm: "left" },
                        fontSize: field === "namaGrup" ? "2.6rem" : "inherit",
                        fontWeight: field === "namaGrup" ? "bold" : "normal",
                      }}
                    >
                      {field === "namaGrup" && (
                        <MDBox display="flex" alignItems="center">
                          <span>
                            {data[field] || "Nama Grup tidak tersedia"}
                          </span>
                        </MDBox>
                      )}
                      {["namaGrup"].indexOf(field) === -1 && (
                        <span>{data[field]}</span>
                      )}
                    </MDBox>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Bagian Bawah Foto & aksesGrup */}
            <Grid container spacing={2} mt={4}>
              {fieldsBelowFoto.slice(0, 5).map((field, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={field}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <MDBox
                    mb={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    flexGrow={1} // Membuat box ini memanjang secara fleksibel
                  >
                    <MDBox display="flex" alignItems="center" width="100%">
                      <Typography
                        variant="subtitle1"
                        sx={{ width: "40%", marginRight: "20px" }}
                      >
                        {customFieldNames[field]}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          overflow: "hidden", // Mencegah teks meluap
                          textOverflow: "ellipsis ", // Menampilkan "..." jika teks terpotong
                          wordWrap: "break-word", // Memastikan kata panjang akan dipotong
                          maxWidth: "60%", // Membatasi lebar teks agar tidak melebihi grid
                        }}
                      >
                        {field === "tglDimodifikasi"
                          ? formatDate(data[field])
                          : data[field]}
                      </Typography>
                    </MDBox>
                  </MDBox>

                  {/* Divider ditempatkan setelah setiap item kecuali yang terakhir */}
                  {index < fieldsBelowFoto.slice(0, 5).length && (
                    <Divider
                      sx={{
                        borderTopWidth: 2,
                        borderTopColor: "rgba(0, 0, 0, 0.7)",
                        width: "100%",
                        mt: 1,
                      }}
                    />
                  )}
                </Grid>
              ))}

              <Grid item xs={12}>
                <MDBox sx={StyledBoxKridensial}>
                  <Typography
                    variant="subtitle1"
                    sx={StyledTypographyKridensial}
                  >
                    {/* <VpnKeyIcon sx={{ marginRight: "8px", color: "#1976d2" }} />{" "} */}
                    MODUL AKSES
                  </Typography>
                </MDBox>
                {/* <PenggunaGrup groupId={selectedGroupId} /> */}
                {selectedGroupId && (
                  <GrupAkses
                    groupId={selectedGroupId}
                    initialData={moduleAccessData}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Button Kembali, Hapus, Edit */}
          <MDBox mt={3} display="flex" justifyContent="flex-end">
            <MDButton
              variant="outlined"
              color="dark"
              size="large"
              onClick={handleBackToList}
              startIcon={<ArrowBack />}
              sx={{ ml: 2 }}
            >
              Kembali
            </MDButton>
            <MDButton
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
            </MDButton>
            <MDButton
              variant="contained"
              color="dark"
              size="large"
              startIcon={<EditIcon />}
              sx={{ ml: 2 }}
              onClick={handleEdit}
            >
              Modifikasi
            </MDButton>
          </MDBox>
        </MDBox>
      )}
    </Card>
  );
}

export default GrupView;
