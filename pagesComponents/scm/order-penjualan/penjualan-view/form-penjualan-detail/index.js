import { useEffect, useState, useCallback } from "react";
import { Autocomplete, Box, Card, Grid, Icon, TextField } from "@mui/material";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import MDBox from "../../../../../components/MDBox";
import MDButton from "../../../../../components/MDButton";
import MDTypography from "../../../../../components/MDTypography";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import {
  getFkProduk,
  getByFkProduk,
  getFkPpn,
  sendDataOrderDetail,
  getPpnById,
  getById,
  updateDataOrderDetail,
} from "../../../../../api/order-detail";

const validationSchema = Yup.object().shape({
  fkProduk: Yup.string().required("Jenis produk harus dipilih"),
});

const OrderDetailForm = ({ noRef }) => {
  const [data, setData] = useState({});
  const [produkOptions, setProdukOptions] = useState([]);
  const [ppnOptions, setPpnOptions] = useState([]);
  const [produkDetail, setProdukDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fkOrderGet, setFkOrderGet] = useState("");
  const router = useRouter();

  // Fetch data produk and ppn
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
    await fetchData(getFkPpn, setPpnOptions);
    await fetchData(getFkProduk, setProdukOptions);
  };

  const getProductDetail = async (id) => {
    setLoading(true);
    try {
      const response = await getByFkProduk(id);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setProdukDetail(data);
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPpnDetail = async (id) => {
    setLoading(true);
    try {
      const response = await getPpnById(id);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePpnChange = useCallback(async (event, newValue) => {
    if (newValue) {
      formik.setFieldValue("ppn", newValue.nilai);
      formik.setFieldValue("kodePpn", newValue.kodePpn);
      await getPpnDetail(newValue.noReferensi);
    } else {
      formik.setFieldValue("ppn", "");
      formik.setFieldValue("kodePpn", "");
    }
  }, []);

  useEffect(() => {
    getAllRef();
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const fkOrder = searchParams.get("id");
      setFkOrderGet(fkOrder); //set untuk kebutuhan inisial
    }
  }, []); // untuk menampilkan get referensi dropdown

  useEffect(() => {
    if (noRef != "") {
      fillData(noRef);
    }
  }, [noRef]);

  useEffect(() => {
    if (produkDetail) {
      const harga = produkDetail.harga;
      formik.setFieldValue("harga", harga);
    }
  }, [produkDetail]); // untuk generate dari dropdown otomatis ke kolom lain

  const fillData = async (id) => {
    await getById(id)
      .then((val) => {
        if (val.ok) {
          return val.json();
        } else {
          alert("Gagal Menemukan data!");
        }
      })
      .then((data) => {
        formik.setValues(data);
        // setData(data);
      });
  };

  const handleProductChange = useCallback(async (event, newValue) => {
    if (newValue) {
      formik.setFieldValue("fkProduk", newValue.noReferensi);
      formik.setFieldValue("namaProduk", newValue.namaProduk);
      await getProductDetail(newValue.noReferensi);
    } else {
      formik.setFieldValue("fkProduk", "");
      formik.setFieldValue("harga", "");
      formik.setFieldValue("subHarga", "");
      formik.setFieldValue("namaProduk", "");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      fkOrder: fkOrderGet,
      fkProduk: 0,
      namaProduk: "",
      kodeLabel: "",
      ppn: "",
      jumlah: 1,
      diskon: 0,
      harga: 0,
      subHarga: 0,
      total: 0,
      // other fields
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const dataToSend = JSON.stringify(values);
      try {
        let res;
        if (noRef) {
          // Jika noref ada, lakukan update
          res = await updateDataOrderDetail(noRef, dataToSend);
        } else {
          // Jika noref tidak ada, lakukan penyimpanan data baru
          res = await sendDataOrderDetail(dataToSend);
        }

        if (res.ok) {
          Swal.fire("Berhasil", "Data tersimpan", "success").then(() =>
            router.push("/scm/order-penjualan/penjualan-list")
          );
        } else {
          Swal.fire("Gagal", "Data tidak tersimpan", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Gagal", "Terjadi kesalahan pada server", "error");
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <MDBox mt={4}>
          <Card>
            <MDBox p={3}>
              <MDTypography mt={2} variant="h5">
                Form Order Detail
              </MDTypography>
              <MDBox mt={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      value={
                        produkOptions.find(
                          (option) =>
                            option.noReferensi === formik.values.fkProduk
                        ) || null
                      }
                      options={produkOptions}
                      getOptionLabel={(option) => option.namaProduk}
                      isOptionEqualToValue={(option, value) =>
                        option.noReferensi === value.noReferensi
                      }
                      id="combo-box-produk"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={handleProductChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Jenis Produk"
                          error={
                            formik.touched.fkProduk &&
                            Boolean(formik.errors.fkProduk)
                          }
                          helperText={
                            formik.touched.fkProduk && formik.errors.fkProduk
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Autocomplete
                      value={
                        ppnOptions.find(
                          (option) => option.kodePpn === formik.values.kodePpn
                        ) || null
                      }
                      options={ppnOptions}
                      getOptionLabel={(option) =>
                        `${option.nilai}% - ${option.label}`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.kodePpn === value.kodePpn
                      }
                      id="combo-box-ppn"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43.5px" },
                      }}
                      onChange={handlePpnChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Pajak"
                          error={
                            formik.touched.kodePpn &&
                            Boolean(formik.errors.kodePpn)
                          }
                          helperText={
                            formik.touched.kodePpn && formik.errors.kodePpn
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      variant="outlined"
                      name="harga"
                      label="Harga"
                      type="text"
                      value={formik.values.harga}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.harga && Boolean(formik.errors.harga)
                      }
                      helperText={formik.touched.harga && formik.errors.harga}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      variant="outlined"
                      name="jumlah"
                      label="Jumlah"
                      type="number"
                      value={formik.values.jumlah}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.jumlah && Boolean(formik.errors.jumlah)
                      }
                      helperText={formik.touched.jumlah && formik.errors.jumlah}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <TextField
                      variant="outlined"
                      name="diskon"
                      label="Potongan"
                      type="number"
                      value={formik.values.diskon}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.diskon && Boolean(formik.errors.diskon)
                      }
                      helperText={formik.touched.diskon && formik.errors.diskon}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                {/* <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="deskripsi"
                      label="Deskripsi"
                      value={formik.values.deskripsi}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={4.3}
                      error={
                        formik.touched.deskripsi &&
                        Boolean(formik.errors.deskripsi)
                      }
                      helperText={
                        formik.touched.deskripsi && formik.errors.deskripsi
                      }
                    />
                  </Grid>
                </Grid> */}
                <Grid container mt={4} justifyContent="flex-end">
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
                  <Grid ml={1}>
                    {noRef && (
                      <MDButton
                        variant="contained"
                        color="light"
                        startIcon={<Icon>cancel</Icon>}
                        onClick={() => location.reload()}
                      >
                        Cancel
                      </MDButton>
                    )}
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

export default OrderDetailForm;
