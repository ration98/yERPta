import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Grid, Typography, Box, Divider, Tabs, Tab } from "@mui/material";
import { forView, updateStatusOrder } from "../../../../api/order-penjualan";
import MDButton from "../../../../components/MDButton";
import { ArrowBack, Phone } from "@mui/icons-material";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DraftsIcon from "@mui/icons-material/Drafts";
import OrderDetailList from "./list-order-detail";
import OrderDetailForm from "./form-order-detail";

const customFieldNames = {
  noReferensi: "No Referensi",
  idOrder: "ID Order",
  fkPihakKetiga: "Pelanggan",
  tglOrder: "Tanggal Order",
  tglPengiriman: "Tanggal Pengiriman",
  ketKeterlambatan: "Ketersediaan Keterlambatan",
  terminPembayaran: "Termin Pembayaran",
  metodePembayaran: "Metode Pembayaran",
  metodePengiriman: "Metode Pengiriman",
  ppn: "Total PPN",
  harga: "Total Harga",
  total: "Total",
  catatanPublik: "Catatan Publik",
  catatanPrivasi: "Catatan Privasi",
  status: "status",
  tglDibuat: "Tanggal Dibuat",
  tglValidasi: "Tanggal Divalidasi",
  tglDimodifikasi: "Tanggal Dimodifikasi",
  pembuat: "Pembuat",
  penggunaValidasi: "Pengguna Validasi",
  pemodifikas: "Pemodifikasi",
};

function OrderPenjualanView({ initialData }) {
  const [data, setData] = useState(initialData || {});
  // const [dataForm1, setDataForm1] = useState("");
  const [noRefForm2, setnoRefForm2] = useState("");
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
    const requestBody = {
      status: 0, // Menambahkan status ke request body
    };

    setIsDraft(true);
    try {
      await updateStatusOrder(id, requestBody); // Kirim requestBody ke API
    } catch (error) {
      console.error("Failed to update status to draft:", error);
    } finally {
      setIsDraft(false);
    }
    fetchData();
  };

  const handleCancel = async () => {
    const requestBody = {
      status: 2, // Menambahkan status ke request body
    };

    setIsDraft(true);
    try {
      await updateStatusOrder(id, requestBody); // Kirim requestBody ke API
    } catch (error) {
      console.error("Failed to update status to draft:", error);
    } finally {
      setIsDraft(false);
    }
    fetchData();
  };

  const handleValid = async () => {
    if (data) {
      // Validasi tglLahir
      const tglLahir = new Date(data.tglLahir);
      const today = new Date();

      if (tglLahir > today) {
        setOpenPopup(true); // Buka popup jika validasi gagal
        return; // Keluar dari fungsi jika validasi gagal
      }
    }

    const requestBody = {
      status: 1, // Menambahkan status ke request body
    };

    console.log(tglLahir);

    setIsDraft(true);
    try {
      await updateStatusOrder(id, requestBody); // Kirim requestBody ke API
    } catch (error) {
      console.error("Failed to update status to draft:", error);
    } finally {
      setIsDraft(false);
    }
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (id) {
        const response = await forView(id);
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

  const handleBackToList = () => {
    setIsBack(true);
    router.push("/scm/order-penjualan/penjualan-list");
    setIsBack(false); // Simulasikan selesai loading
  };

  const handleEdit = () => {
    setIsModifikasi(true);
    router.push(`/scm/order-penjualan/penjualan-detail?id=${id}`);
    setIsModifikasi(false);
  };

  const handleEditForm1 = (values) => {
    setnoRefForm2(values);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const fieldsAboveLogo = ["idOrder", "fkPihakKetiga", "status"];
  const fieldsBelowLogo = [
    "tglOrder",
    "tglPengiriman",
    "ketKeterlambatan",
    "terminPembayaran",
    "metodePembayaran",
    "metodePengiriman",
    "ppn",
    "harga",
    "total",
    "catatanPublik",
    "catatanPrivasi",
  ];

  const fieldsBelowLogoTab2 = ["tglDibuat", "tglDimodifikasi"];

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
              }).then(() => router.push("#"));
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

  const status = data?.status;

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
          <Tab label="Detail Data Order Penjualan" />
          <Tab label="Riwayat Data Order Penjualan" />
        </Tabs>
        {tabIndex === 0 && (
          <Box p={3}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
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
                        {field === "status" && (
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
                        {field !== "status" && (
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
                      {field === "status" && (
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
                      {field === "catatanPrivasi" && (
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
            <OrderDetailList handleEdit={handleEditForm1} />
            <OrderDetailForm noRef={noRefForm2} />
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
                        {field === "status" && (
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
                        {field !== "status" && (
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
                      {field === "status" && (
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
          {status === "Valid" && (
            <>
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
                {isDraft ? "Proses..." : "Modifikasi Detail Order"}
              </MDButton>
              <MDButton
                variant="contained"
                // backgroundColor="grey"
                color="warning"
                size="large"
                sx={{ ml: 2 }}
                startIcon={
                  isDraft ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <DraftsIcon />
                  )
                }
                onClick={handleCancel}
              >
                {isDraft ? "Proses..." : "Cancel Order"}
              </MDButton>
            </>
          )}
          {status === "Draft" && (
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

export default OrderPenjualanView;
