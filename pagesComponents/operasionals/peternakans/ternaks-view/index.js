import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Grid, Typography, Box, Divider, Tabs, Tab } from "@mui/material";
import {
  findByNorefKeteranganTernak,
  deleteDataByNoreferensiTernak,
  updateStatusTernak,
} from "../../../../api/ternak";
import MDButton from "../../../../components/MDButton";
import { ArrowBack } from "@mui/icons-material";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DraftsIcon from "@mui/icons-material/Drafts";

const customFieldNames = {
  fkGudang: "Gudang",
  idTernak: "ID Ternak",
  nama: "Nama Ternak",
  jenisTernak: "Jenis Ternak",
  spesies: "Spesies",
  tglLahir: "Tanggal Lahir Ternak",
  jenisKelaminternak: "Jenis Kelamin Ternak",
  tglMasuk: "Tanggal Ternak Masuk",
  alasanMasuk: "Alasan Ternak Masuk",
  ibu: "Ibu Ternak",
  ayah: "Ayah Ternak",
  adaDikandang: "Ada di Kandang",
  tglKeluar: "Tanggal Ternak Keluar",
  alasanKeluar: "Alasan Ternak Keluar",
  belumPernahmelahirkan: "Belum Pernah Melahirkan",
  tglPertamamelahirkan: "Tanggal Pertama Melahirkan",
  tglDibuat: "Tanggal Dibuat",
  tglDimodifikasi: "Tanggal Dimodifikasi",
  statusData: "Status Data",
};

function TernakView({ initialData }) {
  const [data, setData] = useState(initialData || {});
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isModifikasi, setIsModifikasi] = useState(false);
  const [isDraft, setIsDraft] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);

  const handleDraft = async () => {
    const formData = new FormData();
    formData.append("statusData", "0"); // Menambahkan statusData ke FormData

    setIsDraft(true);
    try {
      await updateStatusTernak(id, formData); // Kirim formData ke API
    } catch (error) {
      console.error("Failed to update status to draft:", error);
    } finally {
      setIsDraft(false);
    }
    fetchData();
  };

  const handleValid = async () => {
    // Ambil data terbaru terlebih dahulu
    const response = await findByNorefKeteranganTernak(id);
    const fetchedData = await response.json();
    const { tglLahir, tglMasuk } = fetchedData;

    // Konversi tanggal ke objek Date untuk memudahkan perbandingan
    const tanggalLahir = new Date(tglLahir);
    const tanggalMasuk = new Date(tglMasuk);
    const tanggalHariIni = new Date();

    // Cek apakah tanggal lahir atau tanggal masuk melebihi tanggal hari ini
    if (tanggalLahir > tanggalHariIni || tanggalMasuk > tanggalHariIni) {
      Swal.fire({
        title: "Tanggal Tidak Valid",
        text: "Kolom Tanggal Lahir atau Kolom Tanggal Masuk Ternak tidak boleh lebih dari tanggal hari ini. Mohon ubah data terlebih dahulu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ubah Data",
        cancelButtonText: "Kembali",
      }).then((result) => {
        if (result.isConfirmed) {
          // Tambahkan logika untuk mengarahkan pengguna ke halaman edit atau modal edit
          router.push(`/operasionals/peternakans/ternaks-detail?id=${id}`);
        }
      });
      return; // Hentikan eksekusi fungsi jika tanggal tidak valid
    }

    const formData = new FormData();
    formData.append("statusData", "1"); // Menambahkan statusData ke FormData

    setIsValid(true);
    try {
      await updateStatusTernak(id, formData); // Kirim formData ke API
    } catch (error) {
      console.error("Failed to update status to draft:", error);
    } finally {
      setIsValid(false);
    }
    fetchData();
  };

  // const handleValid = async () => {
  //   const formData = new FormData();
  //   formData.append("statusData", "1"); // Menambahkan statusData ke FormData

  //   setIsValid(true);
  //   try {
  //     await updateStatusTernak(id, formData); // Kirim formData ke API
  //   } catch (error) {
  //     console.error("Failed to update status to draft:", error);
  //   } finally {
  //     setIsValid(false);
  //   }
  //   fetchData();
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await findByNorefKeteranganTernak(id);
        const fetchedData = await response.json();
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const statusData = data?.statusData;

  const handleBackToList = () => {
    setIsBack(true);
    router.push("/operasionals/peternakans/ternaks-list");
    // setTimeout(() => {
    setIsBack(false); // Simulasikan selesai loading
    // }, 2000);
  };

  const handleEdit = () => {
    setIsModifikasi(true);
    router.push(`/operasionals/peternakans/ternaks-detail?id=${id}`);
    // setTimeout(() => {
    setIsModifikasi(false);
    // }, 2000);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const fieldsAboveLogo = [
    "fkGudang",
    "idTernak",
    "nama",
    "jenisTernak",
    "spesies",
    "statusData",
  ];

  const fieldsBelowLogo = [
    "tglLahir",
    "jenisKelaminternak",
    "tglMasuk",
    "alasanMasuk",
    "ibu",
    "ayah",
    "adaDikandang",
    "tglKeluar",
    "alasanKeluar",
    "belumPernahmelahirkan",
    "tglPertamamelahirkan",
  ];

  const fieldsBelowLogoTab2 = ["tglDibuat", "tglDimodifikasi"];

  const isPortrait = (url) => {
    const img = new Image();
    img.src = url;
    return img.naturalWidth < img.naturalHeight;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "#4CAF50"; // Hijau
      case "Draft":
        return "#9E9E9E"; // Abu-abu
      case "Dibatalkan":
        return "#F44336"; // Merah
      default:
        return "#000"; // Default warna hitam jika tidak cocok
    }
  };

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
          await deleteDataByNoreferensiTernak(id).then((response) => {
            //tadi tekabaca response na, karena make await, jadi kudu berurutan, naon teh te di dagoan kitu la, jadi tadi si response teh hasilna undefined, sekian tq
            console.log("Response:", response.ok);
            if (response.ok) {
              Swal.fire({
                title: "Berhasil!",
                text: "Data telah dihapus",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() =>
                router.push("/operasionals/peternakans/ternaks-list")
              );
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
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
    // setTimeout(() => {
    setIsDelete(false); // Simulasikan selesai loading
    // }, 2000);
  };

  return (
    <Card>
      <Box p={3}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Detail Data Ternak" />
          <Tab label="Riwayat Data Ternak" />
        </Tabs>
        {tabIndex === 0 && (
          <Box p={3}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                {data.foto ? (
                  <Box
                    sx={{
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      padding: 2,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={data.foto}
                      alt="Foto"
                      style={{
                        width: isPortrait(data.foto) ? "100%" : 300,
                        height: isPortrait(data.foto) ? 280 : "auto",
                        maxWidth: 350,
                      }}
                    />
                  </Box>
                ) : (
                  <Typography>Tidak ada foto</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  {fieldsAboveLogo.map((field, index) => (
                    <Grid item xs={12} key={field}>
                      <Box
                        mb={1} // Mengurangi margin bottom untuk lebih dekat
                        display="flex"
                        alignItems="center"
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            width: "40%",
                            // marginRight: "px",  // Mengurangi margin-right untuk lebih dekat
                            fontSize: "0.9rem", // Ukuran font
                          }}
                        >
                          {customFieldNames[field]}
                        </Typography>
                        {field === "statusData" && (
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem", // Ukuran font
                              fontWeight: "bold", // Tebal font
                              padding: "8px 16px", // Padding untuk membuatnya terlihat seperti tombol
                              borderRadius: 9999, // Radius sudut yang besar untuk membuatnya terlihat seperti tombol
                              backgroundColor: getStatusColor(data[field]), // Warna latar belakang sesuai dengan status
                              color: "#fff", // Warna teks putih
                              textTransform: "uppercase", // Transformasi teks menjadi huruf kapital
                              textAlign: "center", // Posisi teks ke tengah
                              cursor: "default", // Kursor tetap
                              minWidth: 120, // Lebar minimum untuk menjaga tata letak
                            }}
                          >
                            {data[field] || "-"}
                          </Typography>
                        )}
                        {field !== "statusData" && (
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem", // Ukuran font
                              fontWeight: "bold", // Tebal font
                            }}
                          >
                            {data[field] || "-"}
                          </Typography>
                        )}
                      </Box>
                      {index < fieldsAboveLogo.length - 1 && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                      {field === "statusData" && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {fieldsBelowLogo.map((field, index) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <Box
                        mb={1} // Mengurangi margin bottom
                        display="flex"
                        alignItems="center"
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            width: "40%",
                            marginRight: "20px",
                            fontSize: "0.9rem", // Ukuran font
                          }}
                        >
                          {customFieldNames[field]}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "0.9rem", // Ukuran font
                            fontWeight: "bold", // Tebal font
                          }}
                        >
                          {data[field] || "-"}
                        </Typography>
                      </Box>
                      {index < fieldsBelowLogo.length - 1 && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Mengurangi margin bottom
                          }}
                        />
                      )}
                      {field === "tglPertamamelahirkan" && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box p={3}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                {data.foto ? (
                  <Box
                    sx={{
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      padding: 2,
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={data.foto}
                      alt="Foto"
                      style={{
                        width: isPortrait(data.foto) ? "100%" : 300,
                        height: isPortrait(data.foto) ? 280 : "auto",
                        maxWidth: 350,
                      }}
                    />
                  </Box>
                ) : (
                  <Typography>Tidak ada foto</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  {fieldsAboveLogo.map((field, index) => (
                    <Grid item xs={12} key={field}>
                      <Box
                        mb={1} // Mengurangi margin bottom untuk lebih dekat
                        display="flex"
                        alignItems="center"
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            width: "40%",
                            // marginRight: "px",  // Mengurangi margin-right untuk lebih dekat
                            fontSize: "0.9rem", // Ukuran font
                          }}
                        >
                          {customFieldNames[field]}
                        </Typography>
                        {field === "statusData" && (
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem", // Ukuran font
                              fontWeight: "bold", // Tebal font
                              padding: "8px 16px", // Padding untuk membuatnya terlihat seperti tombol
                              borderRadius: 9999, // Radius sudut yang besar untuk membuatnya terlihat seperti tombol
                              backgroundColor: getStatusColor(data[field]), // Warna latar belakang sesuai dengan status
                              color: "#fff", // Warna teks putih
                              textTransform: "uppercase", // Transformasi teks menjadi huruf kapital
                              textAlign: "center", // Posisi teks ke tengah
                              cursor: "default", // Kursor tetap
                              minWidth: 120, // Lebar minimum untuk menjaga tata letak
                            }}
                          >
                            {data[field] || "-"}
                          </Typography>
                        )}
                        {field !== "statusData" && (
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "0.9rem", // Ukuran font
                              fontWeight: "bold", // Tebal font
                            }}
                          >
                            {data[field] || "-"}
                          </Typography>
                        )}
                      </Box>
                      {index < fieldsAboveLogo.length - 1 && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                      {field === "statusData" && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {fieldsBelowLogoTab2.map((field, index) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <Box
                        mb={1} // Mengurangi margin bottom
                        display="flex"
                        alignItems="center"
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            width: "40%",
                            marginRight: "20px",
                            fontSize: "0.9rem", // Ukuran font
                          }}
                        >
                          {customFieldNames[field]}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "0.9rem", // Ukuran font
                            fontWeight: "bold", // Tebal font
                          }}
                        >
                          {data[field] || "-"}
                        </Typography>
                      </Box>
                      {index < fieldsBelowLogoTab2.length - 1 && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Mengurangi margin bottom
                          }}
                        />
                      )}
                      {field === "tglDimodifikasi" && (
                        <Divider
                          sx={{
                            borderTopWidth: 1,
                            borderTopColor: "rgba(0, 0, 0, 0.5)",
                            mb: 1, // Adjust margin bottom here
                          }}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <MDButton
            variant="outlined"
            color="dark"
            size="large"
            onClick={handleBackToList}
            startIcon={
              isBack ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <ArrowBack />
              )
            }
            sx={{ ml: 2 }}
          >
            {isBack ? "Memuat..." : "Kembali"}
          </MDButton>
          <MDButton
            variant="contained"
            color="warning"
            size="large"
            startIcon={
              isDelete ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            sx={{
              ml: 2,
              backgroundColor: "#ff0000",
              "&:hover": { backgroundColor: "#cc0000" },
            }}
            onClick={handleDelete}
          >
            {isDelete ? "Proses..." : "Hapus"}
          </MDButton>
          <MDButton
            variant="contained"
            color="dark"
            size="large"
            sx={{ ml: 2 }}
            startIcon={
              isModifikasi ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <EditIcon />
              )
            }
            onClick={handleEdit}
          >
            {isModifikasi ? "Memuat..." : "Modifikasi"}
          </MDButton>
          {statusData === "Valid" && (
            <MDButton
              variant="contained"
              // backgroundColor="grey"
              color="light"
              size="large"
              sx={{ ml: 2 }}
              startIcon={
                isDraft ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <DraftsIcon />
                )
              }
              onClick={handleDraft}
            >
              {isDraft ? "Proses..." : "Jadikan Draft"}
            </MDButton>
          )}
          {statusData === "Draft" && (
            <MDButton
              variant="contained"
              color="success"
              size="large"
              sx={{ ml: 2 }}
              startIcon={
                isValid ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <CheckIcon />
                )
              }
              onClick={handleValid}
            >
              {isValid ? "Proses..." : "Jadikan Valid"}
            </MDButton>
          )}
        </Box>
      </Box>
    </Card>
  );
}

export async function getServerSideProps(context) {
  // Contoh pengambilan data dari server untuk initialData
  const { id } = context.query;
  let initialData = {};

  if (id) {
    try {
      const response = await findByNorefKeteranganTernak(id);
      initialData = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return {
    props: {
      initialData,
    },
  };
}

export default TernakView;
