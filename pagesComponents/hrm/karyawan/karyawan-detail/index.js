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
import MDBox from "/components/MDBox";
import MDButton from "/components/MDButton";
import MDTypography from "/components/MDTypography";
import Swal from "sweetalert2";
import {
  ArrowBack,
  Dangerous,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  saveData,
  getDataByNoReferensi,
  updateDataByNoreferensi,
} from "../../../../api/pengguna";
import { getRefJenisIdentitas } from "../../../../api/reference/ref_jenisidentitas";
import { getRefJenisKelamin } from "../../../../api/reference/ref_jeniskelamin";
import { getRefProvinsi } from "../../../../api/reference/ref_provinsi";
import { getKabupatenKotaByProvinsi } from "../../../../api/reference/ref_kabupatenkota";
import { getKecamatanBykdKabKota } from "../../../../api/reference/ref_kecamatan";
import { getKelurahanBykdKecamatan } from "../../../../api/reference/ref_kelurahan";

function PenggunaDetail({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData || {});
  const [jenisIdentitas, setJenisIdentitas] = useState([]);
  const [jenisKelamin, setJenisKelamin] = useState([]);
  const [provinsi, setProvinsi] = useState([]);
  const [kabKota, setKabKota] = useState([
    { sandi: 999, keterangan: "Pilih Provinsi Terlebih Dahulu" },
  ]);
  const [kecamatan, setKecamatan] = useState([
    { sandi: 999, keterangan: "Pilih Kabupaten Kota Terlebih Dahulu" },
  ]);
  const [kelurahan, setKelurahan] = useState([
    { sandi: 999, keterangan: "Pilih Kecamatan Terlebih Dahulu" },
  ]);
  const [fotoDto, setFotoDto] = useState(null);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    console.log("URL changed", window.location.search);
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      getDataByNoReferensi(id)
        .then((val) => {
          return val;
        })
        .then((data) => {
          if (data) {
            setOldPassword(data.kataSandi || "");
            setData(data);
            getrefkabupatenkota(data.provinsi);
            getrefkecamatan(data.kotaKabupaten);
            getrefkelurahan(data.kecamatan);
            formik.setValues({
              ...data,
              admin: data.admin !== undefined ? String(data.admin) : "",
              kataSandi: "", // **Pastikan kolom kata sandi kosong saat edit**
            });
            setPassword("");
            setShowPassword(true); // Sembunyikan password saat mengedit
          }
        })
        .catch(() => alert("Terjadi kesalahan pada saat mengambil data!"));
    } else {
      setData({});
      formik.resetForm(); // Reset formik values ke initialValues untuk data baru
      setPassword("");
      setShowPassword(true); // Tampilkan password saat menambah data baru
    }
    getrefjenisidentitas();
    getrefjeniskelamin();
    getrefprovinsi();
  }, []);

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
    color: "red",
    width: "20px",
    height: "20px",
  };

  //Pemanggilan API DROPDOWN Ref_JenisKelamin
  const getrefjeniskelamin = async () => {
    try {
      const response = await getRefJenisKelamin();
      // const data = await response.json();
      // const data = await getRefJenisKelamin();
      setJenisKelamin(response);
    } catch (error) {
      console.error("Error fetching jenisKelamin:", error);
    }
  };

  //Pemanggilan Dropdown Admin(Hardcode)
  const adminSistem = [
    { sandi: "1", keterangan: "Ya" },
    { sandi: "0", keterangan: "Tidak" },
  ];

  //Pemanggilan API DROPDOWN Ref_Provinsi
  const getrefprovinsi = async () => {
    try {
      const response = await getRefProvinsi();
      // const data = await response.json();
      // const data = await getRefProvinsi();
      setProvinsi(response);
    } catch (error) {
      console.error("Error fetching provinsi:", error);
    }
  };

  //Pemanggilan API DROPDOWN Ref_KabupatenKota
  const getrefkabupatenkota = async (kdProvinsi) => {
    try {
      const response = await getKabupatenKotaByProvinsi(kdProvinsi);
      // const data = await response.json();
      // const data = await getKabupatenKotaByProvinsi(kdProvinsi);
      // console.log(response);
      if (response.length > 0) {
        setKabKota(response);
      } else {
        setKabKota([
          {
            sandi: 999,
            keterangan: "Pilih Provinsi Terlebih Dahulu",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching kabupatenKota:", error);
    }
  };

  //Pemanggilan API DROPDOWN Ref_Kecamatan
  const getrefkecamatan = async (kdKabKota) => {
    try {
      const response = await getKecamatanBykdKabKota(kdKabKota);
      // const data = await response.json();
      // const data = await getKecamatanBykdKabKota(kdKabKota);
      if (response.length > 0) {
        setKecamatan(response);
      } else {
        setKecamatan([
          {
            sandi: 999,
            keterangan: "Pilih Kabupaten Kota Terlebih Dahulu",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching kecamatan:", error);
    }
  };

  //Pemanggilan API DROPDOWN Ref_Kelurahan
  const getrefkelurahan = async (kdKecamatan) => {
    try {
      const response = await getKelurahanBykdKecamatan(kdKecamatan);
      // const data = await response.json();
      // const data = await getKelurahanBykdKecamatan(kdKecamatan);
      if (response.length > 0) {
        setKelurahan(response);
      } else {
        setKelurahan([
          {
            sandi: 999,
            keterangan: "Pilih Kecamatan Terlebih Dahulu",
          },
        ]);
      }
      // console.log(data);
    } catch (error) {
      console.error("Error fetching kelurahan:", error);
    }
  };

  //Pemanggilan API DROPDOWN Ref_JenisIdentitas
  const getrefjenisidentitas = async () => {
    try {
      const response = await getRefJenisIdentitas();
      // const data = await response.json();
      // const data = await getRefJenisIdentitas();
      setJenisIdentitas(response);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching jenisIdentitas:", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    // setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const updateData = async (id, data) => {
    try {
      const response = await updateDataByNoreferensi(id, data);
      console.log(response);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendefinisikan pola regex
  const regexPatterns = {
    Numeric: /^[0-9]+$/,
    AlphaNumeric: /^[a-zA-Z0-9]+$/,
    Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    Alphabet: /^[A-Za-z\b ]+$/,
    PhoneNumber: /^\d{10,13}$/,
    TelpNumber: /^\d{3,15}$/,
    Npwp: /^\d{15,16}$/,
    Password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    Kodepos: /^\d{5}$/,
    Passport: /^[A-Za-z0-9]{10}$/,
    KKK: /^[0-9]{16}$/,
  };

  // Membuat fungsi untuk membuat field validasi
  const createValidationField = (type, regex, errorMessage) =>
    Yup.string()
      .matches(regex, errorMessage)
      .required(`Kolom ${type} wajib diisi`);

  // Membuat skema validasi menggunakan Yup
  const validationSchema = Yup.object({
    idPengguna: createValidationField(
      "Nomor Id Pengguna",
      regexPatterns.Numeric,
      "Kolom Nomor Id Pengguna harus berupa angka"
    ),
    namaLengkap: createValidationField(
      "Nama Lengkap",
      regexPatterns.Alphabet,
      "Kolom Nama Lengkap harus berupa alphabet"
    ),
    jenisKelamin: Yup.string().required("Kolom Jenis Kelamin wajib diisi"),
    tempatLahir: createValidationField(
      "Tempat Lahir",
      regexPatterns.Alphabet,
      "Kolom Tempat Lahir harus berupa alphabet"
    ),
    tglLahir: Yup.string().required("Kolom Tanggal Lair wajib diisi"),
    namaPengguna: createValidationField(
      "Nama Pengguna",
      regexPatterns.AlphaNumeric,
      "Kolom Nama Pengguna harus berupa alphanumeric"
    ),
    // kataSandi: createValidationField(
    //   "Kata Sandi",
    //   regexPatterns.Password,
    //   "Kata sandi harus memiliki minimal 8 karakter, termasuk huruf besar, huruf kecil, dan angka"
    // ),
    admin: Yup.string().required("Kolom Admin wajib diisi"),
    tglMasuk: Yup.date().required("Kolom Tangal Mulai Bekerja wajib diisi"),
    tglKeluar: Yup.date().required("Kolom Tangal Akhir Bekerja wajib diisi"),
    jenisIdentitas: createValidationField("Jenis Identitas"),

    nomorIdentitas: Yup.string()
      .required("Kolom Nomor Identitas wajib diisi")
      .when("jenisIdentitas", (jenisIdentitas, schema) => {
        if (jenisIdentitas[0] === "1") {
          return schema.test({
            name: "validasi-ktp",
            exclusive: true,
            message:
              "Mohon periksa kembali, standar NIK pada KTP adalah 16 digit",
            // test: (value) => value === "",
            test: (value) =>
              value && value.length === 16 && regexPatterns.KKK.test(value),
          });
        } else if (jenisIdentitas[0] === "2") {
          return schema.test({
            name: "validasi-paspor",
            exclusive: true,
            message:
              "Jika Jenis Identitas terisi Pasport, maka Nomor Identitas hanya boleh terisi alfanumerik",
            test: (value) => value && regexPatterns.AlphaNumeric.test(value),
          });
        } else if (jenisIdentitas[0] === "3" || jenisIdentitas[0] === "4") {
          return schema.test({
            name: "validasi-kitap-kitas",
            exclusive: true,
            message:
              "Jika Jenis Identitas terisi Kitap/Kitas, maka Nomor Identitas hanya boleh terisi alfanumerik",
            test: (value) => value && regexPatterns.AlphaNumeric.test(value),
          });
        }
      }),

    alamatKTP: Yup.string().required("Kolom Alamat KTP wajib diisi"),
    provinsi: createValidationField("Privinsi"),
    kotaKabupaten: createValidationField("Kabupaten / Kota"),
    kecamatan: createValidationField("Kecamatan"),
    kelurahan: createValidationField("Kelurahan"),
    rt: createValidationField(
      "RT",
      regexPatterns.Numeric,
      "Kolom RT hanya boleh terisi angka"
    ),
    rw: createValidationField(
      "RW",
      regexPatterns.Numeric,
      "Kolom RW hanya boleh terisi angka"
    ),
    kodePos: createValidationField(
      "Kode Pos",
      regexPatterns.Numeric,
      "Kolom Kode Pos hanya boleh terisi angka"
    ).matches(regexPatterns.Kodepos, "Kolom Kode Pos harus terisi 5 angka"),
    alamatDomisili: createValidationField("Alamat Domisili"),
    noPonsel: Yup.string()
      .optional() // Field ini opsional, bisa kosong tanpa memicu validasi
      .matches(
        regexPatterns.Numeric,
        "Kolom Nomor Telepon hanya boleh terisi angka"
      )
      .matches(
        regexPatterns.PhoneNumber,
        "Kolom Nomor Ponsel harus terisi minimal 10 hingga maksimal 13 angka"
      ),
    noTelepon: createValidationField(
      "Nomor Telepon",
      regexPatterns.Numeric,
      "Kolom Nomor Telepon hanya boleh terisi angka"
    ).matches(
      regexPatterns.TelpNumber,
      "Kolom Nomor Telepon harus terisi minimal 3 hingga maksimal 15 angka"
    ),
    alamatEmail: createValidationField(
      "Alamat Email",
      regexPatterns.Email,
      "Format email tidak valid"
    ),
    npwp: createValidationField(
      "NPWP",
      regexPatterns.Numeric,
      "Kolom NPWP hanya boleh terisi angka"
    ).matches(
      regexPatterns.Npwp,
      "Kolom NPWP harus terisi minimal 15 dan maksimal 16 angka"
    ),
    tglBerlakuMulai: Yup.date().required(
      "Kolom Tangal Berlaku Akses wajib diisi"
    ),
    tglBerlakuSelesai: Yup.date().required(
      "Kolom Tangal Berlaku Akhir wajib diisi"
    ),
  });

  // console.log(validationSchema);

  const formik = useFormik({
    initialValues: {
      idPengguna: data.idPengguna || "",
      namaLengkap: data.namaLengkap || "",
      jenisKelamin: data.jenisKelamin || "",
      tempatLahir: data.tempatLahir || "",
      tglLahir: data.tglLahir || "",
      namaPengguna: data.namaPengguna || "",
      kataSandi: "",
      admin: data.admin !== undefined ? String(data.admin) : "",
      tglMasuk: data.tglMasuk || "",
      tglKeluar: data.tglKeluar || "",
      jenisIdentitas: data.jenisIdentitas || "",
      nomorIdentitas: data.nomorIdentitas || "",
      alamatKTP: data.alamatKTP || "",
      provinsi: data.provinsi || "",
      kotaKabupaten: data.kotaKabupaten || "",
      kecamatan: data.kecamatan || "",
      kelurahan: data.kelurahan || "",
      rt: data.rt || "",
      rw: data.rw || "",
      kodePos: data.kodePos || "",
      alamatDomisili: data.alamatDomisili || "",
      noPonsel: data.noPonsel || "",
      noTelepon: data.noTelepon || "",
      alamatEmail: data.alamatEmail || "",
      npwp: data.npwp || "",
      tglBerlakuMulai: data.tglBerlakuMulai || "",
      tglBerlakuSelesai: data.tglBerlakuSelesai || "",
      catatan: data.catatan || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      const formDataForPost = new FormData();

      // **Pastikan values didefinisikan dengan baik sebelum diiterasi
      Object.keys(values).forEach((key) => {
        // Hanya kirim kata sandi jika ada perubahan
        if (key === "kataSandi") {
          console.log("Password Baru: ", password);
          if (
            formik.values.kataSandi === "" ||
            formik.values.kataSandi === oldPassword
          ) {
            console.log("Password tidak berubah");
            return; // Jangan kirim kata sandi jika kosong atau sama dengan kata sandi lama
          }
        } else {
          console.log("Password berubah, kirim ke backend");
        }

        if (values[key]) {
          formDataForPost.append(key, values[key]);
          // console.log(key, values[key]); // Log nilai yang dikirim
        }
      });

      if (fotoDto) {
        formDataForPost.append("fotoDto", fotoDto);
      }
      formDataForPost.append("foto", data.foto);

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
            updateData(id, formDataForPost)
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Berhasil",
                  text: "Data Berhasil Diubah",
                }).then(() => router.push("/hrm/karyawan/karyawan-list"));
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
          const res = await saveData(formDataForPost);
          console.log(res);
          if (res) {
            Swal.fire({
              title: "Data Tersimpan",
              text: "Data berhasil disimpan",
              icon: "success",
            }).then(() => router.push("/hrm/karyawan/karyawan-list"));
          } else {
            Swal.fire({
              title: "Data Tidak Tersimpan",
              text: "Terjadi kesalahan saat menyimpan data",
              icon: "error",
            });
          }
        } catch (res) {
          Swal.fire({
            title: "Error",
            text: "Terjadi kesalahan saat menyimpan data",
            icon: "error",
          });
          console.error("Error:", error);
        }
      }
    },
  });

  const handleBack = () => {
    console.log("URL changed", window.location.search);
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");

    if (id) {
      router.push(`/hrm/karyawan/karyawan-view?id=${id}`);
    } else {
      router.push(`/hrm/karyawan/karyawan-list`);
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

  const handleClearFile = () => {
    setFotoDto(null);
    setData({ ...data, fotoDto: null, foto: null });
    console.log(data);
    // console.log(fileInputRef.current.value);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleDeleteFoto = async (id) => {
  //   try {
  //     if (data.foto) {
  //       const response = await deleteFotoByNoreferensi(id);
  //       if (!response.ok) {
  //         throw new Error("Gagal Delete foto");
  //       }
  //     }
  //     // setData({});
  //     console.log(data.foto);

  //     handleClearFile();
  //   } catch (error) {
  //     console.error("Error:", error);
  //     throw error;
  //   }
  // };

  return (
    <MDBox>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5">Karyawan Detail</MDTypography>
          <form onSubmit={formik.handleSubmit}>
            <MDBox mt={4}>
              {/* Baris 1 */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={2.4}>
                  <TextField
                    variant="outlined"
                    name="idPengguna"
                    label="Nomor Induk Karyawan"
                    value={formik.values.idPengguna}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.idPengguna &&
                      Boolean(formik.errors.idPengguna)
                    }
                    helperText={
                      formik.touched.idPengguna && formik.errors.idPengguna
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <TextField
                    variant="outlined"
                    name="namaLengkap"
                    label="Nama Lengkap"
                    value={formik.values.namaLengkap}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.namaLengkap &&
                      Boolean(formik.errors.namaLengkap)
                    }
                    helperText={
                      formik.touched.namaLengkap && formik.errors.namaLengkap
                    }
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": { height: "43px" },
                  }}
                  md={2.4}
                >
                  <Autocomplete
                    value={
                      jenisKelamin.find(
                        (option) => option.sandi === formik.values.jenisKelamin
                      ) || null
                    }
                    options={jenisKelamin}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi ==
                      (value.sandi || formik.values.jenisKelamin)
                    }
                    id="combo-box-demo"
                    sx={{ width: "100%" }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "jenisKelamin",
                        newValue ? newValue.sandi : ""
                      );
                      // setData({
                      //   ...data,
                      //   jenisKelamin: newValue ? newValue.sandi : null,
                      // });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Jenis Kelamin"
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.jenisKelamin &&
                          Boolean(formik.errors.jenisKelamin)
                        }
                        helperText={
                          formik.touched.jenisKelamin &&
                          formik.errors.jenisKelamin
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <TextField
                    variant="outlined"
                    name="tempatLahir"
                    label="Tempat Lahir"
                    value={formik.values.tempatLahir}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.tempatLahir &&
                      Boolean(formik.errors.tempatLahir)
                    }
                    helperText={
                      formik.touched.tempatLahir && formik.errors.tempatLahir
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={2.4}>
                  <TextField
                    variant="outlined"
                    name="tglLahir"
                    label="Tanggal Lahir"
                    type="date"
                    value={formik.values.tglLahir}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.tglLahir && Boolean(formik.errors.tglLahir)
                    }
                    helperText={
                      formik.touched.tglLahir && formik.errors.tglLahir
                    }
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              {/* Baris 2 */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="namaPengguna"
                    label="Nama Pengguna"
                    value={formik.values.namaPengguna}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.namaPengguna &&
                      Boolean(formik.errors.namaPengguna)
                    }
                    helperText={
                      formik.touched.namaPengguna && formik.errors.namaPengguna
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="kataSandi"
                    label="Kata Sandi"
                    type={showPassword ? "password" : "text"}
                    value={formik.values.kataSandi}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.kataSandi &&
                      Boolean(formik.errors.kataSandi)
                    }
                    helperText={
                      formik.touched.kataSandi && formik.errors.kataSandi
                    }
                    fullWidth
                    InputProps={{
                      // **Pastikan kolom bisa diubah jika menambah data baru atau jika kata sandi dimasukkan saat edit**
                      readOnly:
                        !!formik.values.id && formik.values.kataSandi === "", // *Hanya readonly jika ID ada dan password belum diubah
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="kataSandi"
                    label="Kata Sandi"
                    type={showPassword ? "password" : "text"}
                    value={formik.values.kataSandi}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.kataSandi &&
                      Boolean(formik.errors.kataSandi)
                    }
                    helperText={
                      formik.touched.kataSandi && formik.errors.kataSandi
                    }
                    fullWidth
                    InputProps={{
                      readOnly: !!formik.values.id,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            // disabled={!formik.values.kataSandi}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid> */}

                <Grid
                  item
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": { height: "43.5px" },
                  }}
                  md={4}
                >
                  <Autocomplete
                    value={
                      adminSistem.find(
                        (option) => option.sandi === formik.values.admin
                      ) || null
                    }
                    options={adminSistem}
                    getOptionLabel={(option) => option.keterangan}
                    isOptionEqualToValue={(option, value) =>
                      option.sandi === (value?.sandi || formik.values.admin)
                    }
                    id="combo-box-demo"
                    sx={{ width: "100%" }}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        "admin",
                        newValue ? newValue.sandi : ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Administrator Sistem"
                        error={
                          formik.touched.admin && Boolean(formik.errors.admin)
                        }
                        helperText={formik.touched.admin && formik.errors.admin}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border={1}
                    borderColor="grey.300"
                    borderRadius={12}
                    p={2}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <MDTypography
                          variant="body2"
                          style={{ marginRight: "0.5rem" }}
                        >
                          Tanggal Mulai Bekerja
                        </MDTypography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          name="tglMasuk"
                          label="Dari"
                          type="date"
                          value={formik.values.tglMasuk}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.tglMasuk &&
                            Boolean(formik.errors.tglMasuk)
                          }
                          helperText={
                            formik.touched.tglMasuk && formik.errors.tglMasuk
                          }
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          name="tglKeluar"
                          label="Hingga"
                          type="date"
                          value={formik.values.tglKeluar}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.tglKeluar &&
                            Boolean(formik.errors.tglKeluar)
                          }
                          helperText={
                            formik.touched.tglKeluar && formik.errors.tglKeluar
                          }
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Grid>
              </Grid>
              {/* Baris 3 */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "43px" },
                      }}
                      md={6}
                    >
                      <Autocomplete
                        value={
                          jenisIdentitas.find(
                            (option) =>
                              option.sandi === formik.values.jenisIdentitas
                          ) || null
                        }
                        options={jenisIdentitas}
                        getOptionLabel={(option) => option.keterangan}
                        isOptionEqualToValue={(option, value) =>
                          option.sandi ==
                          (value.sandi || formik.values.jenisIdentitas)
                        }
                        id="combo-box-demo"
                        onChange={(event, newValue) => {
                          formik.setFieldValue(
                            "jenisIdentitas",
                            newValue ? newValue.sandi : ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Jenis Identitas"
                            error={
                              formik.touched.jenisIdentitas &&
                              Boolean(formik.errors.jenisIdentitas)
                            }
                            helperText={
                              formik.touched.jenisIdentitas &&
                              formik.errors.jenisIdentitas
                            }
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        name="nomorIdentitas"
                        label="Nomor Identitas"
                        value={formik.values.nomorIdentitas}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.nomorIdentitas &&
                          Boolean(formik.errors.nomorIdentitas)
                        }
                        helperText={
                          formik.touched.nomorIdentitas &&
                          formik.errors.nomorIdentitas
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        name="alamatKTP"
                        label="Alamat KTP"
                        value={formik.values.alamatKTP}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.alamatKTP &&
                          Boolean(formik.errors.alamatKTP)
                        }
                        helperText={
                          formik.touched.alamatKTP && formik.errors.alamatKTP
                        }
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": { height: "43.5px" },
                  }}
                  md={7}
                  container
                  spacing={2}
                >
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      value={
                        provinsi.find(
                          (option) => option.sandi === formik.values.provinsi
                        ) || null
                      }
                      options={provinsi}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi == (value.sandi || formik.values.provinsi)
                      }
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "provinsi",
                          newValue ? newValue.sandi : ""
                        );
                        // Panggil fungsi ref_kabupatenkota dengan sandi provinsi yang dipilih
                        getrefkabupatenkota(newValue ? newValue.sandi : null);
                      }}
                      onBlur={formik.handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Provinsi"
                          error={
                            formik.touched.provinsi &&
                            Boolean(formik.errors.provinsi)
                          }
                          helperText={
                            formik.touched.provinsi && formik.errors.provinsi
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    md={6}
                  >
                    <Autocomplete
                      value={
                        kabKota.find(
                          (option) =>
                            option.sandi === formik.values.kotaKabupaten
                        ) || null
                      }
                      getOptionDisabled={(option) => option.sandi === 999}
                      options={kabKota}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi ==
                        (value.sandi || formik.values.kotaKabupaten)
                      }
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "kotaKabupaten",
                          newValue ? newValue.sandi : ""
                        );
                        // Panggil fungsi ref_kecamatan dengan sandi kabupatenkota yang dipilih
                        getrefkecamatan(newValue ? newValue.sandi : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Kabupaten / Kota"
                          error={
                            formik.touched.kotaKabupaten &&
                            Boolean(formik.errors.kotaKabupaten)
                          }
                          helperText={
                            formik.touched.kotaKabupaten &&
                            formik.errors.kotaKabupaten
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    md={6}
                  >
                    <Autocomplete
                      value={
                        kecamatan.find(
                          (option) => option.sandi === formik.values.kecamatan
                        ) || null
                      }
                      getOptionDisabled={(option) => option.sandi === 999}
                      options={kecamatan}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi == (value.sandi || formik.values.kecamatan)
                      }
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "kecamatan",
                          newValue ? newValue.sandi : ""
                        );
                        // Panggil fungsi ref_kelurahan dengan sandi kecamatan yang dipilih
                        getrefkelurahan(newValue ? newValue.sandi : null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Kecamatan"
                          error={
                            formik.touched.kecamatan &&
                            Boolean(formik.errors.kecamatan)
                          }
                          helperText={
                            formik.touched.kecamatan && formik.errors.kecamatan
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": { height: "43.5px" },
                    }}
                    md={6}
                  >
                    <Autocomplete
                      value={
                        kelurahan.find(
                          (option) => option.sandi === formik.values.kelurahan
                        ) || null
                      }
                      getOptionDisabled={(option) => option.sandi === 999}
                      options={kelurahan}
                      getOptionLabel={(option) => option.keterangan}
                      isOptionEqualToValue={(option, value) =>
                        option.sandi == (value.sandi || formik.values.kelurahan)
                      }
                      id="combo-box-demo"
                      sx={{ width: "100%" }}
                      onChange={(event, newValue) => {
                        formik.setFieldValue(
                          "kelurahan",
                          newValue ? newValue.sandi : null
                        );
                        // console.log(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Kelurahan"
                          error={
                            formik.touched.kelurahan &&
                            Boolean(formik.errors.kelurahan)
                          }
                          helperText={
                            formik.touched.kelurahan && formik.errors.kelurahan
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      name="rt"
                      label="RT"
                      value={formik.values.rt}
                      onChange={formik.handleChange}
                      error={formik.touched.rt && Boolean(formik.errors.rt)}
                      helperText={formik.touched.rt && formik.errors.rt}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      name="rw"
                      label="RW"
                      value={formik.values.rw}
                      onChange={formik.handleChange}
                      error={formik.touched.rw && Boolean(formik.errors.rw)}
                      helperText={formik.touched.rw && formik.errors.rw}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      name="kodePos"
                      label="Kode Pos"
                      value={formik.values.kodePos}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.kodePos && Boolean(formik.errors.kodePos)
                      }
                      helperText={
                        formik.touched.kodePos && formik.errors.kodePos
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Baris 4 */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={5}>
                  <TextField
                    variant="outlined"
                    name="alamatDomisili"
                    label="Alamat Domisili"
                    value={formik.values.alamatDomisili}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.alamatDomisili &&
                      Boolean(formik.errors.alamatDomisili)
                    }
                    helperText={
                      formik.touched.alamatDomisili &&
                      formik.errors.alamatDomisili
                    }
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} md={7} container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="noPonsel"
                      label="No Ponsel"
                      value={formik.values.noPonsel}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.noPonsel &&
                        Boolean(formik.errors.noPonsel)
                      }
                      helperText={
                        formik.touched.noPonsel && formik.errors.noPonsel
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="noTelepon"
                      label="No Telepon"
                      value={formik.values.noTelepon}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.noTelepon &&
                        Boolean(formik.errors.noTelepon)
                      }
                      helperText={
                        formik.touched.noTelepon && formik.errors.noTelepon
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="alamatEmail"
                      label="Alamat Email"
                      value={formik.values.alamatEmail}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.alamatEmail &&
                        Boolean(formik.errors.alamatEmail)
                      }
                      helperText={
                        formik.touched.alamatEmail && formik.errors.alamatEmail
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="npwp"
                      label="NPWP"
                      value={formik.values.npwp}
                      onChange={formik.handleChange}
                      error={formik.touched.npwp && Boolean(formik.errors.npwp)}
                      helperText={formik.touched.npwp && formik.errors.npwp}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Baris 5 */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={7} container spacing={2}>
                  {/* Tanggal Berlaku Akses */}
                  <Grid item xs={12} md={12}>
                    <MDBox
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      border={1}
                      borderColor="grey.300"
                      borderRadius={12}
                      p={2}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <MDTypography
                            variant="body2"
                            style={{ marginRight: "0.5rem" }}
                          >
                            Tanggal Berlaku Akses
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            variant="outlined"
                            name="tglBerlakuMulai"
                            label="Dari"
                            type="date"
                            value={formik.values.tglBerlakuMulai}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.tglBerlakuMulai &&
                              Boolean(formik.errors.tglBerlakuMulai)
                            }
                            helperText={
                              formik.touched.tglBerlakuMulai &&
                              formik.errors.tglBerlakuMulai
                            }
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            variant="outlined"
                            name="tglBerlakuSelesai"
                            label="Hingga"
                            type="date"
                            value={formik.values.tglBerlakuSelesai}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.tglBerlakuSelesai &&
                              Boolean(formik.errors.tglBerlakuSelesai)
                            }
                            helperText={
                              formik.touched.tglBerlakuSelesai &&
                              formik.errors.tglBerlakuSelesai
                            }
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDTypography variant="h5">Foto Pengguna</MDTypography>
                    <input
                      style={inputStyle}
                      type="file"
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,.png" // Hanya menerima file dengan format jpg, jpeg, atau png
                      onChange={handleDataChange}
                    />
                  </Grid>
                  {(data.fotoDto != null || data.foto != null) && (
                    <Grid item xs={12} md={3} style={{ position: "relative" }}>
                      <MDTypography variant="h5">Preview</MDTypography>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={data.fotoDto || data.foto}
                          alt="foto pengguna"
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
                              transition: "background-color 0.3s ease",
                            }}
                            //onClick={() => handleDeleteFoto(data.noReferensi)}
                            onClick={() => handleClearFile()}
                          >
                            <Dangerous style={iconStyle}></Dangerous>
                          </MDButton>
                        </Tooltip>
                      </div>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    variant="outlined"
                    name="catatan"
                    label="Catatan"
                    value={formik.values.catatan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
          </form>
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default PenggunaDetail;
