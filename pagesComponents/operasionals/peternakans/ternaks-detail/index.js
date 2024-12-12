import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Card,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import MDBox from "../../../../components/MDBox";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import {
  saveDataTernak,
  getDataByNoReferensiTernak,
  updateDataByNoreferensiTernak,
  findByJkTernakIbu,
  findByJkTernakAyah,
} from "../../../../api/ternak";
import Swal from "sweetalert2";
import { ArrowBack, Dangerous, Save } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getDataRefJenisTernak } from "../../../../api/reference/ref_jenisternak";
import {
  getSpesies,
  getSpesiesByInduk,
} from "../../../../api/reference/ref_spesies";
import { getJkTernak } from "../../../../api/reference/ref_kelaminternak";
import { getAlasanKeluar } from "../../../../api/reference/ref_alasankeluar";
import { getAlasanMasuk } from "../../../../api/reference/ref_alasanmasuk";
import { getDataGudang } from "../../../../api/gudang";
import { getStatusData } from "../../../../api/reference/ref_statusdata";
import { useFormik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import * as Yup from "yup";

function TernakDetail() {
  const [data, setData] = useState({});
  const [fotoDto, setFotoDto] = useState(null);
  const router = useRouter();
  const [jenisTernakOptions, setJenisTernakOptions] = useState([]);
  const [spesiesOptions, setSpesiesOptions] = useState([
    { sandi: "999", keterangan: "Pilih Ternak Terlebih Dahulu" },
  ]);
  const [jkOptions, setJkOptions] = useState([]);
  const [alasanMasukOptions, setAlasanMasukOptions] = useState([]);
  const [alasanKeluarOptions, setAlasanKeluarOptions] = useState([]);
  const [statusDataOptions, setStatusDataOptions] = useState([]);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [ibuOptions, setIbuOptions] = useState([]);
  const [ayahOptions, setAyahOptions] = useState([]);
  const [isKelahiran, setIsKelahiran] = useState(false);
  const [isAdaDikandang, setIsAdaDikandang] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBacking, setIsBacking] = useState(false);
  const [isLahir, setIsLahir] = useState(false);
  const fileInputRef = useRef(null);

  const handleClearFile = () => {
    setFotoDto(null);
    setData({ ...data, fotoDto: null, foto: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const ddlHardcode = [
    { sandi: "1", label: "YA" },
    { sandi: "0", label: "TIDAK" },
  ];

  const data_gudang = async () => {
    try {
      const response = await getDataGudang();
      const data = await response.json();
      setGudangOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching jenisTernak:", error);
    }
  };

  const ddlIbu = async (noref) => {
    try {
      const response = await findByJkTernakIbu("2", noref);
      const data = await response.json();
      setIbuOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching ddlIbu:", error);
    }
  };

  const ddlAyah = async (noref) => {
    try {
      const response = await findByJkTernakAyah("1", noref);
      const data = await response.json();
      setAyahOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching ddlAyah:", error);
    }
  };

  const ref_jenisternak = async () => {
    try {
      const response = await getDataRefJenisTernak();
      const data = await response.json();
      setJenisTernakOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching jenisTernak:", error);
    }
  };

  const ref_spesies = async () => {
    try {
      const response = await getSpesies();
      const data = await response.json();
      setSpesiesOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  const ref_statusdata = async () => {
    try {
      const response = await getStatusData();
      const data = await response.json();
      setStatusDataOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  const ref_kelaminternak = async () => {
    try {
      const response = await getJkTernak();
      const data = await response.json();
      setJkOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching jk:", error);
    }
  };

  const ref_alasanmasuk = async () => {
    try {
      const response = await getAlasanMasuk();
      const data = await response.json();
      setAlasanMasukOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching alasanMasuk:", error);
    }
  };

  const ref_alasankeluar = async () => {
    try {
      const response = await getAlasanKeluar();
      const data = await response.json();
      setAlasanKeluarOptions(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching alasanKeluar:", error);
    }
  };

  const ref_spesiesByInduk = async (induk) => {
    try {
      if (induk === null) {
        // Mengosongkan dropdown bawah jika `induk` null
        setSpesiesOptions([
          {
            sandi: "999",
            keterangan: "Pilih Jenis Ternak Terlebih Dahulu",
          },
        ]);
        return;
      }

      const response = await getSpesiesByInduk(induk);
      const data = await response.json();
      console.log(data);

      if (data.length > 0) {
        setSpesiesOptions(data);
      } else {
        // Mengatur dropdown dengan opsi default jika data kosong
        setSpesiesOptions([
          {
            sandi: "999",
            keterangan: "Pilih Jenis Ternak Terlebih Dahulu",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching spesies:", error);
    }
  };

  const handleClear = () => {
    formik.setFieldValue("belumPernahmelahirkan", "");
    formik.setFieldValue("tglPertamamelahirkan", "");
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const noref = searchParams.get("id") ?? 0;

    if (searchParams.get("id")) {
      fillData(searchParams.get("id"));
    } else {
      setData({});

      // console.log(data);
    }

    data_gudang();
    ref_jenisternak();
    ref_kelaminternak();
    ref_alasanmasuk();
    ref_alasankeluar();
    ref_statusdata();
    ddlAyah(noref);
    ddlIbu(noref);
  }, []);

  const fillData = async (id) => {
    await getDataByNoReferensiTernak(id)
      .then((val) => {
        if (val.ok) {
          return val.json();
        } else {
          alert("Gagal menghapus data!");
        }
      })
      .then((data) => {
        ref_spesiesByInduk(data.jenisTernak);
        setData(data);
        if (data.belumPernahmelahirkan == 1) {
          setIsLahir(true);
        } else {
          setIsLahir(false);
        }
      });
  };

  const handleClearDate = () => {
    formik.setFieldValue("tglPertamamelahirkan", "");
  };

  const updateData = async (id, formData) => {
    try {
      const response = await updateDataByNoreferensiTernak(id, formData);

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
    setIsBacking(true);
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      router.push(
        `/operasional/peternakans/ternaks-view?id=${searchParams.get("id")}`
      );
    } else {
      router.push(`/operasional/peternakans/ternaks-list`);
    }
    // setTimeout(() => {
    setIsBacking(false); // Simulasikan selesai loading
    // }, 2000);
  };

  const validationSchema = Yup.object().shape({
    fkGudang: Yup.string().required("Kolom Nomor Gudang wajib diisi!"),
    jenisTernak: Yup.string().required("Kolom Jenis Ternak wajib diisi!"),
    spesies: Yup.string().required("Kolom Spesies wajib diisi!"),
    tglLahir: Yup.string().required("Kolom Tanggal Lahir Ternak wajib diisi!"),
    // .test(
    //   "is-before-today",
    //   "Tanggal Lahir tidak boleh lebih dari hari ini!",
    //   function (value) {
    //     // Parse the input value and today's date as dates
    //     const today = new Date();
    //     const selectedDate = new Date(value);

    //     // Set the time of today's date to 00:00:00 to compare only the date part
    //     today.setHours(0, 0, 0, 0);
    //     selectedDate.setHours(0, 0, 0, 0);

    //     // Compare the selected date with today's date
    //     return selectedDate <= today;
    //   }
    // ),
    jenisKelaminternak: Yup.string().required(
      "Kolom Jenis Kelamin Ternak wajib diisi!"
    ),
    tglMasuk: Yup.string().required("Kolom Tanggal Masuk Ternak wajib diisi!"),
    // .test(
    //   "is-before-today",
    //   "Tanggal Masuk tidak boleh lebih dari hari ini!",
    //   function (value) {
    //     // Parse the input value and today's date as dates
    //     const today = new Date();
    //     const selectedDate = new Date(value);

    //     // Set the time of today's date to 00:00:00 to compare only the date part
    //     today.setHours(0, 0, 0, 0);
    //     selectedDate.setHours(0, 0, 0, 0);

    //     // Compare the selected date with today's date
    //     return selectedDate <= today;
    //   }
    // ),
    alasanMasuk: Yup.string()
      .required("Kolom Alasan Masuk Ternak wajib diisi!")
      .max(new Date(), "Tanggal Masuk tidak boleh lebih dari hari ini!"),
    adaDikandang: Yup.string().required(
      "Kolom Ada Dikandang Ternak wajib diisi!"
    ),
    tglKeluar: Yup.mixed().when("adaDikandang", {
      is: (value) => value === "2",
      then: () =>
        Yup.mixed().required(
          "Kolom Tanggal Keluar wajib diisi jika Ada Dikandang Terisi TIDAK"
        ),
      otherwise: () =>
        Yup.mixed()
          .nullable()
          .test(
            "is-empty",
            "Kolom Tanggal Keluar harus kosong jika Ada Dikandang Terisi Selain Tidak",
            (value) => !value
          ),
    }),

    alasanKeluar: Yup.string().when("adaDikandang", {
      is: (value) => value === "0",
      then: () =>
        Yup.string().required(
          "Kolom Alasan Keluar wajib diisi jika Ada Dikandang Terisi TIDAK"
        ),
      otherwise: () =>
        Yup.string()
          .nullable()
          .test(
            "is-empty",
            "Kolom Alasan Keluar harus kosong jika Ada Dikandang Terisi Selain Tidak",
            (value) => !value
          ),
    }),

    belumPernahmelahirkan: Yup.string().when("jenisKelaminternak", {
      is: (value) => value === "2",
      then: () =>
        Yup.string().required(
          "Kolom Pernah Melahirkan wajib diisi! Jika Jenis Kelamin Ternak Betina"
        ),
      otherwise: () => Yup.string().nullable(),
      // .test(
      //   "is-empty",
      //   "Kolom Belum Pernah Melahirkan harus kosong jika Jenis kelamin Terisi Selain Betina",
      //   (value) => !value
      // ),
    }),
    tglPertamamelahirkan: Yup.mixed().when(
      ["belumPernahmelahirkan", "jenisKelaminternak"],
      {
        is: (belumPernahmelahirkan, jenisKelaminternak) =>
          belumPernahmelahirkan === "0" && jenisKelaminternak !== "1",
        then: () =>
          Yup.mixed().required(
            "Kolom Tanggal wajib diisi jika Sudah Pernah Melahirkan"
          ),
        otherwise: () =>
          Yup.mixed()
            .nullable()
            .test(
              "is-empty",
              "Kolom Tanggal Pertama Melahirkan harus kosong jika Belum Pernah Melahirkan Terisi YA Atau Berjenis Kelamin Jantan",
              (value, context) => {
                const { belumPernahmelahirkan, jenisKelaminternak } =
                  context.parent;
                if (
                  belumPernahmelahirkan === "1" ||
                  jenisKelaminternak === "1"
                ) {
                  return !value;
                }
                return !value;
              }
            ),
      }
    ),
    // statusData: Yup.string().required("Kolom Status Data wajib diisi!"),
  });

  const formik = useFormik({
    initialValues: {
      fkGudang: data.fkGudang || "",
      idTernak: data.idTernak || "",
      nama: data.nama || "",
      jenisTernak: data.jenisTernak || "",
      spesies: data.spesies || "",
      tglLahir: data.tglLahir || "",
      jenisKelaminternak: data.jenisKelaminternak || "",
      tglMasuk: data.tglMasuk || "",
      alasanMasuk: data.alasanMasuk || "",
      ibu: data.ibu || "",
      ayah: data.ayah || "",
      tglKeluar: data.tglKeluar || "",
      alasanKeluar: data.alasanKeluar || "",
      adaDikandang: data.adaDikandang || "",
      belumPernahmelahirkan: data.belumPernahmelahirkan || "",
      tglPertamamelahirkan: data.tglPertamamelahirkan || "",
      statusData: data.statusData || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      if (
        values.jenisKelaminternak === "1" &&
        (values.belumPernahmelahirkan || values.tglPertamamelahirkan)
      ) {
        // Prompt user with confirmation modal
        const result = await Swal.fire({
          title: "Perhatian",
          text: "Kolom 'Belum Pernah Melahirkan' akan dikosongkan karena Jenis Kelamin Ternak = JANTAN",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          cancelButtonText: "Kembali",
        });

        if (result.isConfirmed) {
          // Clear specific fields based on conditions
          values.belumPernahmelahirkan = "";
          values.tglPertamamelahirkan = "";

          await handleFormSubmission(values, id);
        } else {
          setIsLoading(false);
        }
      } else {
        await handleFormSubmission(values, id);
      }
    },
  });

  const handleFormSubmission = async (values, id) => {
    try {
      const formDataForPost = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formDataForPost.append(key, values[key]);
        }
      });

      if (fotoDto) {
        formDataForPost.append("fotoDto", fotoDto);
      }
      formDataForPost.append("foto", data.foto);

      if (id) {
        const result = await Swal.fire({
          title: "Apakah anda yakin Ingin Mengubah Data Ini?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ubah",
          cancelButtonText: "Kembali",
        });

        if (result.isConfirmed) {
          await updateData(id, formDataForPost);
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Data Berhasil Diubah",
          }).then(() =>
            router.push(`/operasionals/peternakans/ternaks-view?id=${id}`)
          );
        }
      } else {
        const res = await saveDataTernak(formDataForPost);

        if (res.ok) {
          Swal.fire({
            title: "Data Tersimpan",
            text: "Data berhasil disimpan",
            icon: "success",
          }).then(() => router.push("/operasionals/peternakans/ternaks-list"));
        } else {
          Swal.fire({
            title: "Data Tidak Tersimpan",
            text: "Terjadi kesalahan saat menyimpan data",
            icon: "error",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan data",
        icon: "error",
      });
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearBelumPernahMelahirkan = () => {
    formik.setFieldValue("belumPernahmelahirkan", "");
  };

  const shouldShowClearButton =
    formik.values.jenisKelaminternak === "1" &&
    formik.values.belumPernahmelahirkan &&
    formik.values.tglPertamamelahirkan;

  const handleFileChange = (file) => {
    if (file) {
      setFotoDto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, fotoDto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDataChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      handleFileChange(files[0]);
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  return (
    <MDBox>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">Form Ternak</MDTypography>
          <MDBox mt={4}>
            <form onSubmit={formik.handleSubmit}>
              {/* BARIS 1 */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    value={
                      gudangOptions.find(
                        (option) =>
                          option.no_referensi === formik.values.fkGudang
                      ) || null
                    }
                    options={gudangOptions}
                    getOptionLabel={(option) =>
                      option.id_gudang + " - " + option.nama_gudang
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.no_referensi ==
                      (value.no_referensi || formik.values.fkGudang)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "nomorKandang",
                        newValue ? newValue.id_gudang : null
                      );
                      formik.setFieldValue(
                        "fkGudang",
                        newValue ? newValue.no_referensi : null
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleFkGudang}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nomor Gudang"
                        error={
                          formik.touched.fkGudang &&
                          Boolean(formik.errors.fkGudang)
                        }
                        helperText={
                          formik.touched.fkGudang && formik.errors.fkGudang
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="idTernak"
                    label="Nomor Ternak"
                    InputLabelProps={{ shrink: true }}
                    placeholder="KOLOM INI TERISI OLEH SYSTEM"
                    InputProps={{
                      readOnly: true,
                    }}
                    // onChange={handleDataChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="nama"
                    label="Nama Ternak"
                    value={formik.values.nama}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* BARIS 2 */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      jenisTernakOptions.find(
                        (option) => option.sandi === formik.values.jenisTernak
                      ) || null
                    }
                    options={jenisTernakOptions}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi == (value.sandi || formik.values.jenisTernak)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "jenisTernak",
                        newValue ? newValue.sandi : null
                      );
                      ref_spesiesByInduk(newValue ? newValue.sandi : null);
                    }}
                    onBlur={formik.handleBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Jenis Ternak"
                        error={
                          formik.touched.jenisTernak &&
                          Boolean(formik.errors.jenisTernak)
                        }
                        helperText={
                          formik.touched.jenisTernak &&
                          formik.errors.jenisTernak
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      spesiesOptions.find(
                        (option) => option.sandi === formik.values.spesies
                      ) || null
                    }
                    options={spesiesOptions}
                    getOptionDisabled={(option) => option.sandi === "999"}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi == (value.sandi || formik.values.spesies)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "spesies",
                        newValue ? newValue.sandi : null
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleSpesies}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Spesies"
                        error={
                          formik.touched.spesies &&
                          Boolean(formik.errors.spesies)
                        }
                        helperText={
                          formik.touched.spesies && formik.errors.spesies
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* BARIS 3 */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    name="tglLahir"
                    label="Tanggal Lahir Ternak"
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    // value={data.tglLahir || ""}
                    value={formik.values.tglLahir}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tglLahir && Boolean(formik.errors.tglLahir)
                    }
                    helperText={
                      formik.touched.tglLahir && formik.errors.tglLahir
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      jkOptions.find(
                        (option) =>
                          option.sandi === formik.values.jenisKelaminternak
                      ) || null
                    }
                    options={jkOptions}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi ==
                      (value.sandi || formik.values.jenisKelaminternak)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "jenisKelaminternak",
                        newValue ? newValue.sandi : null
                      );
                      // if (newValue && newValue.sandi == "1") {
                      //   setIsJantan(true);
                      //   formik.setFieldValue("belumPernahmelahirkan", null);
                      //   formik.setFieldValue("tglPertamamelahirkan", null);
                      // } else {
                      //   setIsJantan(false);
                      // }
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleJenisKelaminternak}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Jenis Kelamin Ternak"
                        error={
                          formik.touched.jenisKelaminternak &&
                          Boolean(formik.errors.jenisKelaminternak)
                        }
                        helperText={
                          formik.touched.jenisKelaminternak &&
                          formik.errors.jenisKelaminternak
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* BARIS 4 */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    name="tglMasuk"
                    label="Tanggal Ternak Masuk"
                    // value={data.tglMasuk || ""}
                    value={formik.values.tglMasuk}
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    error={
                      formik.touched.tglMasuk && Boolean(formik.errors.tglMasuk)
                    }
                    helperText={
                      formik.touched.tglMasuk && formik.errors.tglMasuk
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      alasanMasukOptions.find(
                        (option) => option.sandi === formik.values.alasanMasuk
                      ) || null
                    }
                    options={alasanMasukOptions}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi == (value.sandi || formik.values.alasanMasuk)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "alasanMasuk",
                        newValue ? newValue.sandi : null
                      );
                      // if (newValue && newValue.sandi == 2) {
                      //   setIsKelahiran(true);
                      // } else {
                      //   setIsKelahiran(false);
                      // }
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleAlasanMasuk}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Alasan masuk"
                        error={
                          formik.touched.alasanMasuk &&
                          Boolean(formik.errors.alasanMasuk)
                        }
                        helperText={
                          formik.touched.alasanMasuk &&
                          formik.errors.alasanMasuk
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* BARIS 5 */}
              {/* {isKelahiran && ( */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      ibuOptions.find(
                        (option) => option.noReferensi === formik.values.ibu
                      ) || null
                    }
                    options={ibuOptions}
                    getOptionLabel={(option) =>
                      option.idTernak + " - " + option.nama
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.noReferensi ==
                      (value.noReferensi || formik.values.ibu)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "ibu",
                        newValue ? newValue.noReferensi : null
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleibu}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ibu Ternak"
                        error={formik.touched.ibu && Boolean(formik.errors.ibu)}
                        helperText={formik.touched.ibu && formik.errors.ibu}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      ayahOptions.find(
                        (option) => option.noReferensi === formik.values.ayah
                      ) || null
                    }
                    options={ayahOptions}
                    getOptionLabel={(option) =>
                      option.nama
                        ? `${option.idTernak} - ${option.nama}`
                        : option.idTernak
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.noReferensi ==
                      (value.noReferensi || formik.values.ayah)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "ayah",
                        newValue ? newValue.noReferensi : null
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleayah}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ayah Ternak"
                        error={
                          formik.touched.ayah && Boolean(formik.errors.ayah)
                        }
                        helperText={formik.touched.ayah && formik.errors.ayah}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* )} */}
              {/* BARIS 6 */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="adaDikandang"
                    value={
                      ddlHardcode.find(
                        (option) => option.sandi === formik.values.adaDikandang
                      ) || null
                    }
                    options={ddlHardcode}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "adaDikandang",
                        newValue ? newValue.sandi : null
                      );
                      // if (newValue && newValue.sandi == 2) {
                      //   setIsAdaDikandang(true);
                      // } else {
                      //   setIsAdaDikandang(false);
                      // }
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleAdaDikandang}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ada Dikandang"
                        error={
                          formik.touched.adaDikandang &&
                          Boolean(formik.errors.adaDikandang)
                        }
                        helperText={
                          formik.touched.adaDikandang &&
                          formik.errors.adaDikandang
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="belumPernahmelahirkan"
                    value={
                      ddlHardcode.find(
                        (option) =>
                          option.sandi === formik.values.belumPernahmelahirkan
                      ) || null
                    }
                    options={ddlHardcode}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onBlur={formik.handleBlur}
                    // readOnly={isJantan}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "belumPernahmelahirkan",
                        newValue ? newValue.sandi : null
                      );
                      if (newValue && newValue.sandi == 1) {
                        setIsLahir(true);
                        formik.setFieldValue("tglPertamamelahirkan", "");
                      } else {
                        setIsLahir(false);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // placeholder={
                        //   isJantan ? "Kolom Ini tidak dapat Jika Jantan" : ""
                        // }
                        label="Belum Pernah Melahirkan"
                        error={
                          formik.touched.belumPernahmelahirkan &&
                          Boolean(formik.errors.belumPernahmelahirkan)
                        }
                        helperText={
                          formik.touched.belumPernahmelahirkan &&
                          formik.errors.belumPernahmelahirkan
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  {/* <TextField
                    variant="outlined"
                    name="tglPertamamelahirkan"
                    InputProps={{
                      readOnly: isLahir,
                    }}
                    label="Tanggal Melahirkan"
                    type="date"
                    placeholder={
                      isLahir
                        ? "Kolom Ini tidak dapat Jika Belum pernah melahirkan"
                        : ""
                    }
                    value={formik.values.tglPertamamelahirkan}
                    error={
                      formik.touched.tglPertamamelahirkan &&
                      Boolean(formik.errors.tglPertamamelahirkan)
                    }
                    helperText={
                      formik.touched.tglPertamamelahirkan &&
                      formik.errors.tglPertamamelahirkan
                    }
                    InputLabelProps={{ shrink: true }}
                    onChange={formik.handleChange}
                    fullWidth
                  /> */}
                  <TextField
                    variant="outlined"
                    name="tglPertamamelahirkan"
                    InputProps={{
                      readOnly: isLahir,
                      endAdornment: isLahir ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear date"
                            onClick={handleClearDate}
                            edge="end"
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                    label="Tanggal Melahirkan"
                    type="date"
                    placeholder={
                      isLahir
                        ? "Kolom ini tidak dapat diisi jika belum pernah melahirkan"
                        : ""
                    }
                    value={formik.values.tglPertamamelahirkan}
                    error={
                      formik.touched.tglPertamamelahirkan &&
                      Boolean(formik.errors.tglPertamamelahirkan)
                    }
                    helperText={
                      formik.touched.tglPertamamelahirkan &&
                      formik.errors.tglPertamamelahirkan
                    }
                    InputLabelProps={{ shrink: true }}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
                {/* {shouldShowClearButton && (
                  <Grid item xs={12} md={3} justifyContent={"flex-end"}>
                    <MDButton
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                      // disabled={isJantan}
                    >
                      Kosongkan Field Belum Pernah Melahirkan dan Tanggal
                      Pertama Melahirkan
                    </MDButton>
                  </Grid>
                )} */}
              </Grid>
              {/* BARIS 7 */}
              {/* {isAdaDikandang && ( */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    name="tglKeluar"
                    label="Tanggal Keluar Ternak"
                    // value={data.tglKeluar || ""}
                    value={formik.values.tglKeluar}
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tglKeluar &&
                      Boolean(formik.errors.tglKeluar)
                    }
                    helperText={
                      formik.touched.tglKeluar && formik.errors.tglKeluar
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    value={
                      alasanKeluarOptions.find(
                        (option) => option.sandi === formik.values.alasanKeluar
                      ) || null
                    }
                    options={alasanKeluarOptions}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi ==
                      (value.sandi || formik.values.alasanKeluar)
                    }
                    id="combo-box-demo"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "alasanKeluar",
                        newValue ? newValue.sandi : null
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // onChange={handleAlasanKeluar}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Alasan Keluar"
                        error={
                          formik.touched.alasanKeluar &&
                          Boolean(formik.errors.alasanKeluar)
                        }
                        helperText={
                          formik.touched.alasanKeluar &&
                          formik.errors.alasanKeluar
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* )} */}
              {/* BARIS 8 */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={2}>
                  <MDTypography variant="h5">Foto Ternak</MDTypography>
                  <input
                    style={inputStyle}
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDataChange}
                  />
                  <Grid container spacing={3} mt={1}>
                    {/* <Grid item xs={12} md={12}>
                      <Autocomplete
                        value={
                          statusDataOptions.find(
                            (option) =>
                              option.sandi === formik.values.statusData
                          ) || null
                        }
                        options={statusDataOptions}
                        getOptionLabel={(option) => option.keterangan}
                        isOptionEqualToValue={(option, value) =>
                          option.sandi ==
                          (value.sandi || formik.values.statusData)
                        }
                        id="combo-box-demo"
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-root": { height: "43.5px" },
                        }}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "statusData",
                            newValue ? newValue.sandi : null
                          );
                        }}
                        onBlur={formik.handleBlur}
                        // onChange={handleStatusData}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Status Data"
                            error={
                              formik.touched.statusData &&
                              Boolean(formik.errors.statusData)
                            }
                            helperText={
                              formik.touched.statusData &&
                              formik.errors.statusData
                            }
                          />
                        )}
                      />
                    </Grid> */}
                  </Grid>
                </Grid>
                {(data.fotoDto != null || data.foto != null) && (
                  <Grid item xs={12} md={2} style={{ position: "relative" }}>
                    <MDTypography variant="h5">Preview</MDTypography>
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={data.fotoDto || data.foto}
                        alt="foto ternak"
                        style={{ width: "100%", height: "auto" }}
                      />
                      <Tooltip title="Hapus Foto">
                        <MDButton
                          style={{
                            position: "absolute",
                            top: 0,
                            right: -15,
                            padding: "3px 6px", // Ubah nilai padding untuk membuat button lebih kecil
                            fontSize: "10px", // Ukuran font lebih kecil
                            backgroundColor: "transparent",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px", // Sudut border lebih kecil
                            cursor: "pointer",
                          }}
                          // onClick={() => handleDeleteFoto(data.noReferensi)}
                          onClick={() => handleClearFile()}
                        >
                          <Dangerous style={iconStyle}></Dangerous>
                        </MDButton>
                      </Tooltip>
                    </div>
                  </Grid>
                )}
              </Grid>
              {/* Button Simpan dan Batalkan */}
              <Grid container mt={2} justifyContent="flex-end">
                <MDButton
                  variant="outlined"
                  color="dark"
                  startIcon={
                    isBacking ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <ArrowBack />
                    )
                  }
                  type="button"
                  onClick={handleBack}
                >
                  Batalkan
                </MDButton>
                <Grid ml={1}>
                  <MDButton
                    variant="contained"
                    color="dark"
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <Save />
                      )
                    }
                    // onClick={handleSubmit}
                    type="submit"
                    disabled={isLoading} // Disable button saat loading
                  >
                    {isLoading ? "Menyimpan..." : "Simpan"}
                  </MDButton>
                </Grid>
              </Grid>
            </form>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

const inputStyle = {
  width: "100%", // Lebar maksimum agar responsif
  padding: "8px",
  border: "1px solid rgba(0, 0, 0, 0.23)", // Warna border standar Material UI
  borderRadius: "4px",
  fontSize: "14px",
  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)", // Shadow yang lebih ringan dan sesuai dengan Material UI
  backgroundColor: "#fff", // Warna background putih
  cursor: "pointer", // Tanda kursor saat hover seperti Material UI
  outline: "none", // Hilangkan outline saat focus seperti Material UI
};

const buttonStyle = {
  position: "absolute",
  top: 10,
  right: 10,
  padding: "5px 10px",
  fontSize: "12px",
  backgroundColor: "#db1514",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const iconStyle = {
  width: "20px",
  height: "20px",
  color: "red",
};

export default TernakDetail;
