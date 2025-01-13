import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MDButton from "/components/MDButton";
import DataTable from "/examples/Tables/DataTable";
import {
  Autocomplete,
  Card,
  Grid,
  TextField,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  deleteDataByNoreferensi,
  getDataQuery,
  updateStatusByNoref,
} from "../../../../api/pengguna";
import MDTypography from "/components/MDTypography";
import MDBox from "/components/MDBox";
import Swal from "sweetalert2";

const useStyles = makeStyles(() => ({
  customTooltip: {
    backgroundColor: "#fff",
    color: "#000",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    maxWidth: 900,
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  customArrow: {
    color: "#fff",
  },
  tooltipContent: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  tooltipText: {
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },
  tooltipFoto: {
    width: "150px",
    height: "150px",
    marginLeft: "50px",
  },
  statusActive: {
    backgroundColor: "green",
    color: "#fff",
    padding: "5px",
    borderRadius: "20px",
  },
  statusClosed: {
    backgroundColor: "red",
    color: "#fff",
    padding: "5px",
    borderRadius: "20px",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    marginRight: "10px",
  },
  cellContent: {
    display: "flex",
    alignItems: "center",
  },
}));

function PenggunasList() {
  const classes = useStyles();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  //filter status akun
  // const [filterStatus, setFilterStatus] = useState(null); //old
  const [filterStatus, setFilterStatus] = useState([{ sandi: "1", keterangan: "Aktif" }]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  //checkbox
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //dropdown opsi
  const [action, setAction] = useState("");
  const [confirmEnabled, setConfirmEnabled] = useState(false);

  useEffect(() => {
    getAllData();
    statusAkunFilter();
  }, []);

  useEffect(() => {
    applyFilters(filterStatus);
  }, [rows]);

  //get data query
  const getAllData = async () => {
    try {
      // const response = await getDataQuery();
      // const data = await response.json();
      const data = await getDataQuery();
      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const statusAkunFilter = () => {
    const options = [
      { sandi: "1", keterangan: "Aktif" },
      { sandi: "0", keterangan: "Nonaktif" },
    ];
    setStatusOptions(options);
  };

  // Old
  {/* } const applyFilters = (statusFilter) => {
    let filteredData = [...rows];
    if (statusFilter) {
      filteredData = filteredData.filter(
        (row) => row.status === statusFilter.keterangan
      );
    }
    setFilteredRows(filteredData);
  };
  */}

  // NEW
  const applyFilters = (statusFilter) => {
    let filteredData = [...rows];

    if (statusFilter && statusFilter.length > 0) {
      // Filter data berdasarkan keterangan status yang dipilih
      const selectedStatuses = statusFilter.map((filter) => filter.keterangan);
      filteredData = filteredData.filter((row) => selectedStatuses.includes(row.status));
    }

    setFilteredRows(filteredData);
  }

  const handleFilterChangeStatus = (event, newValue) => {
    setFilterStatus(newValue);
    applyFilters(newValue);
  };

  const options = [
    { value: "0", label: "Nonaktifkan" },
    { value: "1", label: "Aktifkan" },
    // { value: "2", label: "Tetapkan Tag" },
    // { value: "3", label: "Jadikan Supervisor" },
  ];

  const handleSelectRow = (noReferensi) => {
    setSelectedRows((prevSelected) => {
      // Menggunakan noReferensi untuk menambah atau menghapus dari selectedRows
      const newSelectedRows = prevSelected.includes(noReferensi)
        ? prevSelected.filter((id) => id !== noReferensi) // Menghapus dari array
        : [...prevSelected, noReferensi]; // Menambahkan ke array

      // Log untuk debug
      console.log("Selected rows:", newSelectedRows);

      // Mengembalikan nilai baru untuk state
      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRows.map((row) => row.noReferensi));
    }
    setSelectAll(!selectAll);
  };

  const handleConfirm = async () => {
    const data = {
      status: parseInt(action, 10), // konversi action menjadi integer
      noReferensi: selectedRows,
    };

    // Menentukan deskripsi status
    let statusDescription = "";
    if (data.status === 1) {
      statusDescription = "Aktif";
    } else if (data.status === 0) {
      statusDescription = "Nonaktif";
    } else {
      statusDescription = "Status tidak dikenal"; // Jika ada status lain
    }

    // Menampilkan alert dengan nilai status sebelum konfirmasi
    Swal.fire({
      title: `Apakah Anda yakin ingin mengubah status akun menjadi ${statusDescription}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ubah",
      cancelButtonText: "Kembali",
    }).then(async (swalResult) => {
      if (swalResult.isConfirmed) {
        try {
          // Mengirim request ke backend
          const response = await updateStatusByNoref(data);
          console.log(response); // tampilkan log sukses
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Status berhasil diubah",
          });
          // .then(() => {
          // // Refresh halaman setelah sukses
          // window.location.reload();
          // });
          getAllData();
        } catch (error) {
          // tampilkan log error
          console.error("gagal update status:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Status gagal diubah",
          });
        }
      }
    });
  };

  const handleActionChange = (event, value) => {
    setAction(value ? value.value : "");
    setConfirmEnabled(value !== null);
  };

  const getStatusCellStyle = (status) => {
    if (status === "Aktif") {
      return classes.statusActive;
    } else if (status === "Nonaktif") {
      return classes.statusClosed;
    }
    return null;
  };

  const defaultMaleAvatar = "/assets/images/foto-pengguna-default/Laki-Laki.png";
  const defaultFemaleAvatar = "/assets/images/foto-pengguna-default/Perempuan.png";

  const CustomCell = ({ row, value }) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
      router.push(`/hrm/karyawan/karyawan-view?id=${row.original.noReferensi}`);
    };

    const getStatusCellStyle = (status) => {
      if (status === "Aktif") {
        return classes.statusActive;
      } else if (status === "Nonaktif") {
        return classes.statusClosed;
      }
      return null;
    };

    const getDefaultAvatar = (jenisKelamin) => {
      if (jenisKelamin === "Laki - Laki") {
        return defaultMaleAvatar;
      } else if (jenisKelamin === "Perempuan") {
        return defaultFemaleAvatar;
      }
      return null;
    };

    const fotoSrc = row.original.foto || getDefaultAvatar(row.original.jenisKelamin);

    const tooltipContent = (
      <div className={classes.tooltipContent}>
        <div className={classes.tooltipText}>
          <div>
            <strong>Nama Lengkap:</strong> {row.original.namaLengkap}
          </div>
          <div>
            <strong>Nama Pengguna:</strong> {row.original.namaPengguna}
          </div>
          <div>
            <strong>Email:</strong> {row.original.alamatEmail}
          </div>
          <div className={getStatusCellStyle(row.original.status)}>
            <strong>Status:</strong> {row.original.status}
          </div>
        </div>
        <img
          src={fotoSrc}
          alt="Foto Pengguna"
          className={classes.tooltipFoto}
        />
      </div>
    );

    return (
      <Tooltip
        title={tooltipContent}
        arrow
        classes={{
          tooltip: classes.customTooltip,
          arrow: classes.customArrow,
        }}
        PopperProps={{
          disablePortal: true,
        }}
      >
        <span
          onClick={handleClick}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          <div className={classes.cellContent}>
            <img src={fotoSrc} alt="Foto Pengguna" className={classes.avatar} />
            {value}
          </div>
        </span>
      </Tooltip>
    );
  };

  const dataTableData = {
    columns: [
      {
        Header: <Checkbox checked={selectAll} onChange={handleSelectAll} />,
        accessor: "select",
        width: "5%",
        Cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.includes(row.original.noReferensi)}
            onChange={() => handleSelectRow(row.original.noReferensi)}
          />
        ),
      },
      {
        Header: "Nama Pengguna",
        accessor: "namaPengguna",
        width: "10%",
        Cell: ({ row, value }) => <CustomCell row={row} value={value} />,
      },
      { Header: "Nama Lengkap", accessor: "namaLengkap", width: "10%" },
      { Header: "Jenis Kelamin", accessor: "jenisKelamin", width: "10%" },
      { Header: "No Telepon", accessor: "noTelepon", width: "10%" },
      { Header: "Alamat Email", accessor: "alamatEmail", width: "10%" },
      {
        Header: "Tanggal Terakhir Login",
        accessor: "tglLoginTerakhir",
        width: "10%",
        Cell: ({ value }) => {
          if (!value) return "-"; // Jika tidak ada nilai, tampilkan tanda "-"

          const date = new Date(value);

          // Format tanggal menjadi "dd-MM-yyyy"
          const formattedDate = date
            .toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-");

          // Format waktu menjadi "jam:menit:detik"
          const formattedTime = date
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/\./g, ":"); // Ubah titik menjadi titik dua

          return `${formattedDate} ${formattedTime}`;
        },
      },
      {
        Header: "Status Akun",
        accessor: "status",
        width: "10%",
        Cell: ({ row }) => (
          <div className={getStatusCellStyle(row.original.status)}>
            {row.original.status}
          </div>
        ),
      },
    ],
    rows: filteredRows,
  };

  const handleEdit = (noReferensi) => {
    router.push(`/hrm/karyawan/karyawan-detail?noReferensi=${noReferensi}`);
  };

  const handleDelete = async (sandi) => {
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
          await deleteDataByNoreferensi(sandi);
          Swal.fire({
            title: "Berhasil!",
            text: "Data telah dihapus",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          getAllData();
        } catch (error) {
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
  };

  return (
    <Card>
      <MDBox p={3}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          p={2}
          spacing={2}
        >
          <Grid item>
            <MDTypography variant="h5">List Karyawan</MDTypography>
          </Grid>
          <Grid item>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              onClick={() => router.push("/hrm/karyawan/karyawan-detail")}
            >
              &nbsp; Tambah Data
            </MDButton>
          </Grid>
        </Grid>

        {/* Filter Status Akun */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2.2}>
            <Autocomplete
              multiple
              options={statusOptions}
              getOptionLabel={(option) => option.keterangan}
              value={filterStatus}
              onChange={handleFilterChangeStatus}
              isOptionEqualToValue={(option, value) => option.keterangan === value.keterangan}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter Status Akun"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": { height: "40.5px" },
                  }}
                />
              )}
            />
          </Grid>

          {/* Filter Akun */}
          {selectedRows.length > 0 && (
            <>
              <Grid item xs={12} sm={6} md={1.9}>
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) => option.label}
                  value={
                    action ? options.find((opt) => opt.value === action) : null
                  }
                  onChange={handleActionChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih Aksi"
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": { height: "40.5px" },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
                <MDButton
                  // variant="contained"
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={handleConfirm}
                  disabled={!confirmEnabled}
                >
                  Konfirmasi
                </MDButton>
              </Grid>
            </>
          )}
        </Grid>
        <DataTable
          table={{ columns: dataTableData.columns, rows: filteredRows }}
          entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
          isSorted={false}
          canSearch
        />
      </MDBox>
    </Card>
  );
}

export default PenggunasList;
