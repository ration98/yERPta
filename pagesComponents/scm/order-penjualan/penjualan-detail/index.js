import { useEffect, useState } from "react";
import { Autocomplete, Box, Card, Grid, Icon, TextField } from "@mui/material";
import { useFormik, FormikProvider, Field } from "formik";
import * as Yup from "yup";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import Swal from "sweetalert2";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getMetodePembayaran } from "../../../../api/reference/ref_metodepembayaran";
import { getKetersediaan } from "../../../../api/reference/ref_ketersediaan";
import { getMetodePengiriman } from "../../../../api/reference/ref_metodepengiriman";
import { getPihakKetiga } from "../../../../api/pihakketiga";
import { getTermin } from "../../../../api/reference/ref_termin";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  sendDataOrder,
  getOrderById,
  updateDataOrder,
} from "../../../../api/order-penjualan";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

const validationSchema = Yup.object().shape({
  fkPihakKetiga: Yup.string().required("Kolom Pelanggan harus dipilih"),
  tglPengiriman: Yup.string()
    .required("Kolom Tanggal Pengiriman harus diisi")
    .test(
      "is-greater-or-equal-today",
      "Tanggal Pengiriman harus sama atau lebih besar dari tanggal sekarang",
      function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Mengatur jam ke awal hari untuk perbandingan
        const selectedDate = new Date(value);
        return selectedDate >= today;
      }
    ),
  terminPembayaran: Yup.string().required(
    "Kolom Termin Pembayaran Harus Diisi"
  ),
  metodePembayaran: Yup.string().required(
    "Kolom Metode Pembayaran Harus Diisi"
  ),
  metodePengiriman: Yup.string().required(
    "Kolom Metode Pengiriman Harus Diisi"
  ),
});

const OrderPenjualanDetail = () => {
  const [data, setData] = useState({});
  const router = useRouter();
  const [pihakKetigaOptions, setPihakKetigaOptions] = useState([]);
  const [preorderOptions, setPreorderOptions] = useState([]);
  const [terminOptions, setTerminOptions] = useState([]);
  const [metodePembayaranOptions, setMetodePembayaranOptions] = useState([]);
  const [metodePengirimanOptions, setMetodePengirimanOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async (apiCall, setState) => {
    try {
      const response = await apiCall();
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllRef = async () => {
    fetchData(getPihakKetiga, setPihakKetigaOptions);
    fetchData(getKetersediaan, setPreorderOptions);
    fetchData(getMetodePengiriman, setMetodePengirimanOptions);
    fetchData(getMetodePembayaran, setMetodePembayaranOptions);
    fetchData(getTermin, setTerminOptions);
  };

  const fillData = async (id) => {
    try {
      await getOrderById(id)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((valueResult) => {
          setData(valueResult);
        });
    } catch (error) {
      showErrorAlert("Terjadi kesalahan saat mengambil data");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    getAllRef();

    if (id) {
      fillData(id);
    } else {
      setData({});
    }
  }, []);

  const handleBack = () => {
    router.push("/scm/order-penjualan/penjualan-list");
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Berhasil",
      text: message,
      icon: "success",
    }).then(() => handleBack());
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Gagal",
      text: message,
      icon: "error",
    });
  };

  const formik = useFormik({
    initialValues: {
      fkPihakKetiga: data.fkPihakKetiga || "",
      tglPengiriman: data.tglPengiriman || "",
      preorder: data.preorder || "",
      terminPembayaran: data.terminPembayaran || "",
      metodePembayaran: data.metodePembayaran || "",
      metodePengiriman: data.metodePengiriman || "",
      ppn: data.ppn || "",
      harga: data.harga || "",
      total: data.total || "",
      status: data.status || "",
      catatanPublik: data.catatanPublik || "",
      catatanPrivasi: data.catatanPrivasi || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");
      //   values.noReferensiKategori = data.noReferensiKategori; //ini di set karena noReferensiKategori gak ada di values, values diambil dari textfield(isian di detail), sedangkan variable data ada noReferensiKategorinya karena dia di set dari response api
      // console.log(values.noReferensiKategori);
      const dataToSend = JSON.stringify(values);

      if (id) {
        Swal.fire({
          title: "Apakah anda yakin ingin mengubah data ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ubah",
          cancelButtonText: "Kembali",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await updateDataOrder(id, dataToSend);
              showSuccessAlert("Data berhasil diubah");
            } catch (error) {
              showErrorAlert("Data gagal diubah");
            }
          }
        });
      } else {
        try {
          const res = await sendDataOrder(dataToSend);
          if (res.ok) {
            showSuccessAlert("Data tersimpan");
          } else {
            showErrorAlert("Data tidak tersimpan");
          }
        } catch (error) {
          console.error("Error:", error);
          showErrorAlert("Terjadi kesalahan pada server");
        }
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <MDBox>
          <Card>
            <MDBox p={3}>
              <MDTypography mt={2} variant="h5">
                Form Order Penjualan
              </MDTypography>
              <MDBox mt={4}>
                {/* BARIS 1 */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      label="No Order"
                      fullWidth
                      readOnly={true}
                      placeholder="KOLOM INI TERISI OLEH SYSTEM"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      value={
                        pihakKetigaOptions.find(
                          (option) =>
                            option.noReferensi === formik.values.fkPihakKetiga
                        ) || null
                      }
                      options={pihakKetigaOptions}
                      getOptionLabel={(option) => option.nama}
                      isOptionEqualToValue={(option, value) =>
                        option.noReferensi === value.noReferensi
                      }
                      id="combo-box-demo"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "fkPihakKetiga",
                          newValue ? newValue.noReferensi : null
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Pelanggan"
                          error={
                            formik.touched.fkPihakKetiga &&
                            Boolean(formik.errors.fkPihakKetiga)
                          }
                          helperText={
                            formik.touched.fkPihakKetiga &&
                            formik.errors.fkPihakKetiga
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      name="tglPengiriman"
                      label="Tanggal Pengiriman"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      value={formik.values.tglPengiriman}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.tglPengiriman &&
                        Boolean(formik.errors.tglPengiriman)
                      }
                      helperText={
                        formik.touched.tglPengiriman &&
                        formik.errors.tglPengiriman
                      }
                      fullWidth
                    />
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Tanggal Pengiriman"
                        value={formik.values.tanggalPengiriman}
                        onChange={(newValue) =>
                          formik.setFieldValue("tanggalPengiriman", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{
                              width: "100%",
                              "& .MuiInputBase-root": {
                                borderRadius: 1,
                                bgcolor: "background.paper",
                              },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "text.secondary",
                                },
                                "&:hover fieldset": {
                                  borderColor: "primary.main",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "primary.main",
                                },
                              },
                            }}
                            error={
                              formik.touched.tanggalPengiriman &&
                              Boolean(formik.errors.tanggalPengiriman)
                            }
                            helperText={
                              formik.touched.tanggalPengiriman &&
                              formik.errors.tanggalPengiriman
                            }
                          />
                        )}
                      />
                    </LocalizationProvider> */}
                  </Grid>
                </Grid>
                {/* BARIS 2 */}
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      value={
                        preorderOptions.find(
                          (option) =>
                            option.noReferensi === formik.values.preorder
                        ) || null
                      }
                      options={preorderOptions}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.noReferensi === value.noReferensi
                      }
                      id="combo-box-demo"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "preorder",
                          newValue ? newValue.noReferensi : null
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Keterlambatan"
                          error={
                            formik.touched.preorder &&
                            Boolean(formik.errors.preorder)
                          }
                          helperText={
                            formik.touched.preorder && formik.errors.preorder
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      value={
                        terminOptions.find(
                          (option) =>
                            option.sandi === formik.values.terminPembayaran
                        ) || null
                      }
                      options={terminOptions}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi === value.sandi
                      }
                      id="combo-box-demo"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "terminPembayaran",
                          newValue ? newValue.sandi : null
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Termin Pembayaran"
                          error={
                            formik.touched.terminPembayaran &&
                            Boolean(formik.errors.terminPembayaran)
                          }
                          helperText={
                            formik.touched.terminPembayaran &&
                            formik.errors.terminPembayaran
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      value={
                        metodePembayaranOptions.find(
                          (option) =>
                            option.sandi === formik.values.metodePembayaran
                        ) || null
                      }
                      options={metodePembayaranOptions}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi === value.sandi
                      }
                      id="combo-box-demo"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "metodePembayaran",
                          newValue ? newValue.sandi : null
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Metode Pembayaran"
                          error={
                            formik.touched.metodePembayaran &&
                            Boolean(formik.errors.metodePembayaran)
                          }
                          helperText={
                            formik.touched.metodePembayaran &&
                            formik.errors.metodePembayaran
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      value={
                        metodePengirimanOptions.find(
                          (option) =>
                            option.sandi === formik.values.metodePengiriman
                        ) || null
                      }
                      options={metodePengirimanOptions}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi === value.sandi
                      }
                      id="combo-box-demo"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "metodePengiriman",
                          newValue ? newValue.sandi : null
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Metode Pengiriman"
                          error={
                            formik.touched.metodePengiriman &&
                            Boolean(formik.errors.metodePengiriman)
                          }
                          helperText={
                            formik.touched.metodePengiriman &&
                            formik.errors.metodePengiriman
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                {/* BARIS 3 HIDE */}
                {/* <Card>
                    <MDBox p={3}>
                      <MDTypography mt={4} mb={2} variant="h5">
                        Perhitungan
                      </MDTypography>
                      <Grid container spacing={3} mt={1}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            variant="outlined"
                            name="ppn"
                            label="Jumlah PPN"
                            type="number"
                            value={formik.values.ppn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.ppn && Boolean(formik.errors.ppn)
                            }
                            helperText={formik.touched.ppn && formik.errors.ppn}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            variant="outlined"
                            name="jumlahHarga"
                            label="Jumlah Harga"
                            type="number"
                            value={formik.values.jumlahHarga}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.jumlahHarga &&
                              Boolean(formik.errors.jumlahHarga)
                            }
                            helperText={
                              formik.touched.jumlahHarga &&
                              formik.errors.jumlahHarga
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            variant="outlined"
                            name="total"
                            label="Total"
                            type="number"
                            value={formik.values.total}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.total && Boolean(formik.errors.total)
                            }
                            helperText={
                              formik.touched.total && formik.errors.total
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card> */}
                {/* BARIS 4 */}
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="catatanPublik"
                      label="Catatan Publik"
                      value={formik.values.catatanPublik}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={4.3}
                      error={
                        formik.touched.catatanPublik &&
                        Boolean(formik.errors.catatanPublik)
                      }
                      helperText={
                        formik.touched.catatanPublik &&
                        formik.errors.catatanPublik
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="catatanPrivasi"
                      label="Catatan Privasi"
                      value={formik.values.catatanPrivasi}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={4.3}
                      error={
                        formik.touched.catatanPrivasi &&
                        Boolean(formik.errors.catatanPrivasi)
                      }
                      helperText={
                        formik.touched.catatanPrivasi &&
                        formik.errors.catatanPrivasi
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container mt={4} justifyContent="flex-end">
                  <MDButton
                    variant="outlined"
                    color="dark"
                    startIcon={<ArrowBack />}
                    type="button"
                    onClick={handleBack}
                  >
                    Kembali
                  </MDButton>
                  <Grid ml={1}>
                    <MDButton
                      variant="contained"
                      color="dark"
                      startIcon={<Icon>save</Icon>}
                      type="submit"
                    >
                      Simpan
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </Card>
        </MDBox>
      </form>
    </FormikProvider>
  );
};

export default OrderPenjualanDetail;
