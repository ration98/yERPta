import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Grid, Typography, Card, Divider } from "@mui/material";
import MDButton from "/components/MDButton";
import {
  ArrowBack,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person,
  LocationOn,
  Phone,
  Email,
  AssignmentInd,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  VpnKey as VpnKeyIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  getDataQueryByNoref,
  deleteDataByNoreferensiPengguna,
  updateStatusByNoref,
} from "../../../../api/pengguna";

function PenggunaView({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData || {});
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!initialData && id) {
          const fetchedData = await getDataQueryByNoref(id);
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, initialData]);

  const handleBackToList = () => {
    router.push("/karyawan-dan-grup/karyawan/karyawan-list");
  };

  const handleEdit = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    router.push(`/karyawan-dan-grup/karyawan/karyawan-detail?id=${id}`);
  };

  const fieldsAboveFoto = [
    "namaLengkap",
    "alamatKTP",
    "noTelepon",
    "alamatEmail",
    "status",
  ];

  const getStatusColor = (status) => (status === "Aktif" ? "green" : "red");

  const fieldsBelowFoto = [
    "idPengguna",
    "namaPengguna",
    "tglLahir",
    "jenisKelamin",
    "admin",
    "tglBerlakuMulai",
    "tglBerlakuSelesai",
    "tglLoginTerakhir",
  ];

  const customFieldNames = {
    idPengguna: "Nomor Induk Karyawan",
    namaPengguna: "Nama Pengguna",
    tglLahir: "Tanggal Lahir",
    jenisKelamin: "Jenis Kelamin",
    admin: "Administrator Sistem",
    tglBerlakuMulai: "Tanggal Berlaku Akses",
    tglBerlakuSelesai: "Tanggal Berlaku Selesai",
    tglLoginTerakhir: "Tanggal Login Terakhir",
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
      .replace(/\//g, "-");
  };

  // Fungsi untuk memformat waktu menjadi jam:menit:detik
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\./g, ":");
  };

  const isPortrait = (url) => {
    const img = new Image();
    img.src = url;
    return img.naturalWidth < img.naturalHeight;
  };

  const StyledBoxKridensial = {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: "10px 0",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
    maxWidth: "80%",
    margin: "0 auto",
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
    fontFamily: "'Roboto', sans-serif",
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
          await deleteDataByNoreferensiPengguna(id);
          Swal.fire({
            title: "Berhasil!",
            text: "Data telah dihapus",
            icon: "success",
            showConfirmButton: false,
          }).then(() =>
            router.push("/karyawan-dan-grup/karyawan/karyawan-list")
          );
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Gagal!",
            text: "Data gagal dihapus",
            icon: "error",
            showConfirmButton: true,
          });
        }
      }
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    const statusDescription = newStatus === 1 ? "Aktif" : "Nonaktif";
    const payload = {
      noReferensi: [id],
      status: newStatus,
    };

    Swal.fire({
      title: `Apakah Anda yakin ingin mengubah status akun menjadi ${statusDescription}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ubah",
      cancelButtonText: "Kembali",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateStatusByNoref(payload);
          setData((prevData) => ({
            ...prevData,
            status: newStatus === 1 ? "Aktif" : "Nonaktif",
          }));
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Status berhasil diubah",
          });
        } catch (error) {
          console.error("Gagal update status:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Status gagal diubah",
          });
        }
      }
    });
  };

  const getStatusButtonProps = (status) => {
    const isAktif = status === "Aktif";
    const buttonColor = isAktif ? "#ff0000" : "#00cc00";
    const hoverColor = isAktif ? "#cc0000" : "#009900";
    const boxShadowColor = isAktif
      ? "rgba(255, 0, 0, 0.4)"
      : "rgba(0, 204, 0, 0.4)";

    return {
      variant: "contained",
      color: "primary",
      size: "large",
      sx: {
        ml: 2,
        backgroundColor: buttonColor,
        boxShadow: `0 4px 8px ${boxShadowColor}`,
        "&:hover": {
          backgroundColor: hoverColor,
          boxShadow: `0 8px 16px ${boxShadowColor}`,
        },
        "&:focus": {
          boxShadow: `0 8px 16px ${boxShadowColor}`,
        },
      },
      onClick: () => handleStatusUpdate(isAktif ? 0 : 1),
      children: (
        <>
          {isAktif ? (
            <CancelIcon sx={{ mr: 1 }} />
          ) : (
            <VerifiedIcon sx={{ mr: 1 }} />
          )}
          {isAktif ? "Nonaktifkan" : "Aktifkan"}
        </>
      ),
    };
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box>
        <Grid container alignItems="center" spacing={2}>
          {/* Bagian Foto */}
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            {data.foto ? (
              <Box
                sx={{
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
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
                    width: isPortrait(data.foto) ? "100%" : 240,
                    height: isPortrait(data.foto) ? 210 : "auto",
                    maxWidth: 350,
                  }}
                />
              </Box>
            ) : (
              <Typography>Tidak ada foto</Typography>
            )}
          </Grid>

          {/* Bagian Samping Foto */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              {fieldsAboveFoto.map((field) => (
                <Grid item xs={12} key={field}>
                  <Box
                    mb={-1}
                    display="flex"
                    alignItems="center"
                    sx={{
                      flexDirection: { xs: "column", sm: "row" },
                      textAlign: { xs: "center", sm: "left" },
                      fontSize: field === "namaLengkap" ? "2.6rem" : "inherit",
                      fontWeight: field === "namaLengkap" ? "bold" : "normal",
                      marginBottom: field === "alamatKTP" ? 1 : 0,
                    }}
                  >
                    {field === "alamatKTP" && (
                      <Box display="flex" alignItems="flex-start">
                        <LocationOn sx={{ mr: 1 }} />
                        <Box sx={{ maxWidth: "calc(100% - 32px)" }}>
                          <span>
                            {data[field] || "Alamat KTP tidak tersedia"}
                          </span>
                        </Box>
                      </Box>
                    )}
                    {field === "noTelepon" && (
                      <Box display="flex" alignItems="center">
                        <Phone sx={{ mr: 1 }} />
                        <span>
                          {data[field] || "No Telepon tidak tersedia"}
                        </span>
                      </Box>
                    )}
                    {field === "alamatEmail" && (
                      <Box display="flex" alignItems="center">
                        <Email sx={{ mr: 1 }} />
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            textDecoration: "underline",
                            color: "#1976d2",
                            cursor: "pointer",
                            fontSize: "inherit",
                          }}
                        >
                          <a
                            href={`mailto:${data[field]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            {data[field] || "Email tidak tersedia"}
                          </a>
                        </span>
                      </Box>
                    )}
                    {field === "namaLengkap" && (
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 1 }} />
                        <span>
                          {data[field] || "Nama Lengkap tidak tersedia"}
                        </span>
                      </Box>
                    )}
                    {field === "status" && (
                      <Box display="flex" alignItems="center">
                        <AssignmentInd
                          sx={{ mr: 1, color: getStatusColor(data[field]) }}
                        />
                        <span style={{ color: getStatusColor(data[field]) }}>
                          {data[field] || "Status tidak tersedia"}
                        </span>
                      </Box>
                    )}
                    {[
                      "namaLengkap",
                      "alamatKTP",
                      "noTelepon",
                      "alamatEmail",
                      "status",
                    ].indexOf(field) === -1 && <span>{data[field]}</span>}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Bagian Bawah Foto */}
          <Grid container spacing={2} mt={4}>
            {fieldsBelowFoto.slice(0, 5).map((field, index) => (
              <Grid item xs={12} sm={6} key={field}>
                <Box mb={2} display="flex" alignItems="center">
                  <Typography
                    variant="subtitle1"
                    sx={{ width: "40%", marginRight: "20px" }}
                  >
                    {customFieldNames[field]}
                  </Typography>
                  <Typography variant="body1">
                    {field === "tglBerlakuMulai" ||
                    field === "tglBerlakuSelesai"
                      ? formatDate(data[field])
                      : field === "tglLahir"
                      ? formatDate(data[field])
                      : data[field]}
                  </Typography>
                </Box>
                {index < fieldsBelowFoto.slice(0, 6).length - 1 && (
                  <Divider
                    sx={{
                      borderTopWidth: 2,
                      borderTopColor: "rgba(0, 0, 0, 0.7)",
                    }}
                  />
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={StyledBoxKridensial}>
                <Typography variant="subtitle1" sx={StyledTypographyKridensial}>
                  <VpnKeyIcon sx={{ marginRight: "8px", color: "#1976d2" }} />{" "}
                  Kredensial
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Box mb={2} display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  sx={{ width: "20%", marginRight: "20px" }}
                >
                  Tanggal Berlaku Akses
                </Typography>
                <Box>
                  <Box display="flex" alignItems="center">
                    <CalendarTodayIcon sx={{ marginRight: "4px" }} />
                    <Typography variant="body1" sx={{ marginRight: "36px" }}>
                      {formatDate(data["tglBerlakuMulai"])}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        marginRight: "15px",
                        marginLeft: "-25px",
                        color: "gray",
                        textTransform: "lowercase",
                      }}
                    >
                      Hingga
                    </Typography>
                    <CalendarTodayIcon sx={{ marginRight: "4px" }} />
                    <Typography variant="body1">
                      {formatDate(data["tglBerlakuSelesai"])}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider
                sx={{
                  borderTopWidth: 2,
                  borderTopColor: "rgba(0, 0, 0, 0.7)",
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={2} display="flex" alignItems="center">
                <Typography
                  variant="subtitle1"
                  sx={{ width: "20%", marginRight: "20px" }}
                >
                  {customFieldNames["tglLoginTerakhir"]}
                </Typography>
                <Typography variant="body1">
                  {data["tglLoginTerakhir"]
                    ? (() => {
                        const date = new Date(
                          data["tglLoginTerakhir"].replace(" ", "T")
                        );

                        // Format tanggal menjadi "dd-MM-yyyy"
                        const formattedDate = date
                          .toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-");

                        // Format waktu menjadi "HH:mm:ss"
                        const formattedTime = date
                          .toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                          .replace(/\./g, ":");

                        return `${formattedDate} ${formattedTime}`; // Gabungkan tanggal dan waktu
                      })()
                    : "-"}
                </Typography>
              </Box>
              <Divider
                sx={{
                  borderTopWidth: 2,
                  borderTopColor: "rgba(0, 0, 0, 0.7)",
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Button Kembali, Hapus, Edit */}
        <Box mt={3} display="flex" justifyContent="flex-end">
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
          <MDButton {...getStatusButtonProps(data.status)} />
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
        </Box>
      </Box>
    </Card>
  );
}

export default PenggunaView;
