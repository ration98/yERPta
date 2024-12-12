import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MDButton from "../../../../../components/MDButton";
// import MDBox from "components/MDBox";
import MDBox from "../../../../../components/MDBox";
import DataTable from "/examples/Tables/DataTable";
import {
  Card,
  Grid,
  Autocomplete,
  Tooltip,
  TextField,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  getGrupPengguna,
  getGrupPenggunaDropdown,
  createGrupPengguna,
  deleteGrupPengguna,
} from "../../../../../api/pengguna-grup";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

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

function PenggunaGrupList({ groupId }) {
  const classes = useStyles();
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [dataDropdownOptions, setDataDropdownOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  //Checkbox
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // useEffect(() => {
  //   if (groupId) {
  //     getAllData(groupId);  // Panggil data pengguna grup dengan groupId
  //     getDataDropdown();
  //   }
  // }, [groupId]);

  useEffect(() => {
    const fetchDataPengguna = async () => {
      try {
        const response = await getGrupPenggunaDropdown(groupId);
        const data = await response.json();
        setDataDropdownOptions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading users:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat memuat pengguna.", "error");
      }
    };

    if (groupId) {
      fetchDataPengguna();
      getAllData(groupId);
    }
  }, [groupId]);

  //get data query
  const getAllData = async (groupId) => {
    try {
      const response = await getGrupPengguna(groupId);
      const data = await response.json();

      // console.log("respon: ", data);
      setRows(data);
      setFilteredRows(data);
      // setDataDropdownOptions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("Data Dropdown Options: ", dataDropdownOptions);
  }, [dataDropdownOptions]);

  const handleAddUser = async () => {
    try {
      if (!selectedUser || !groupId) {
        Swal.fire(
          "Gagal",
          "Pilih pengguna dan pastikan grup tersedia.",
          "warning"
        );
        return;
      }

      // Menambahkan pengguna ke grup dengan memanggil `createGrupPengguna`
      await createGrupPengguna({
        noReferensi: selectedUser,
        fkGrup: groupId,
      });

      Swal.fire(
        "Berhasil",
        "Pengguna berhasil ditambahkan ke grup.",
        "success"
      );
      setSelectedUser(null); // Reset pengguna yang dipilih

      // Refresh data dropdown setelah penambahan pengguna
      const updatedDropdown = await getGrupPenggunaDropdown(groupId);
      setDataDropdownOptions(await updatedDropdown.json());
      getAllData(groupId);
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat menambahkan pengguna.",
        "error"
      );
    }
  };

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

  const getStatusCellStyle = (status) => {
    if (status === "Aktif") {
      return classes.statusActive;
    } else if (status === "Nonaktif") {
      return classes.statusClosed;
    }
    return null;
  };

  const handleDeleteUser = async (fkGrup, fkPengguna, namaGrup) => {
    Swal.fire({
      title: "Data akan dihapus!",
      text: `Apakah anda yakin ingin menghapus user ini dari grup ${namaGrup}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGrupPengguna(fkGrup, fkPengguna);
          Swal.fire("Dihapus!", "Pengguna telah dihapus dari grup.", "success");
          getAllData(fkGrup); // Refresh data tabel setelah penghapusan
          // location.reload();

          // Tambahkan kembali pengguna yang dihapus ke dropdown
          const deletedUser = rows.find(
            (user) => user.noReferensi === fkPengguna
          );
          if (deletedUser) {
            setDataDropdownOptions((prevOptions) => [
              ...prevOptions,
              deletedUser,
            ]);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Gagal",
            "Terjadi kesalahan saat menghapus pengguna.",
            "error"
          );
        }
      }
    });
  };

  const defaultMaleAvatar =
    "/assets/images/foto-pengguna-default/Laki-Laki.png";
  const defaultFemaleAvatar =
    "/assets/images/foto-pengguna-default/Perempuan.png";

  const CustomCell = ({ row, value }) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
      router.push(
        `/karyawan-dan-grup/karyawan/karyawan-view?id=${row.original.noReferensi}`
      );
    };

    const getDefaultAvatar = (jenisKelamin) => {
      return jenisKelamin === "Laki - Laki"
        ? defaultMaleAvatar
        : defaultFemaleAvatar;
    };

    const fotoSrc =
      row.original.foto || getDefaultAvatar(row.original.jenisKelamin);

    const tooltipContent = (
      <div className={classes.tooltipContent}>
        <div className={classes.tooltipText}>
          <div>
            <strong>Nama Pengguna:</strong> {row.original.fkPengguna}
          </div>
          <div>
            <strong>Nama Lengkap:</strong> {row.original.namaLengkap}
          </div>
          <div className={getStatusCellStyle(row.original.status)}>
            <strong>Status Akun:</strong> {row.original.status}
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
            <img
              src={fotoSrc}
              alt="Foto Pengguna"
              className={classes.avatar} // Tambahkan style avatar jika diperlukan
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultMaleAvatar;
              }}
            />
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
        Cell: ({ row, value }) => <CustomCell row={row} value={value} />,
        width: "10%",
      },
      { Header: "Nama Lengkap", accessor: "namaLengkap", width: "10%" },
      { Header: "Jenis Kelamin", accessor: "jenisKelamin", width: "10%" },
      {
        Header: "Status Akun",
        accessor: "status",
        Cell: ({ row }) => (
          <div className={getStatusCellStyle(row.original.status)}>
            {row.original.status}
          </div>
        ),
        width: "10%",
      },
      {
        Header: "Aksi",
        accessor: "aksi",
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <IconButton
              onClick={() =>
                handleDeleteUser(
                  groupId,
                  row.original.noReferensi,
                  row.original.namaGrup
                )
              }
              style={{ color: "red", padding: "0" }} // Mengatur padding agar lebih rapi
              size="large" // Mengatur ukuran ikon menjadi besar
            >
              <DeleteIcon style={{ fontSize: "24px" }} />{" "}
              {/* Ubah ukuran ikon sesuai kebutuhan */}
            </IconButton>
          </div>
        ),
        width: "10%",
      },
    ],
    rows: filteredRows,
  };

  return (
    <Card>
      <MDBox p={3}>
        {/* Dropdown dan Button di atas judul DataTable */}
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
        >
          {/* Grid untuk Dropdown Pilih Pengguna */}
          <Grid item xs={12} sm={6} md={2.5} mb={{ xs: 2, sm: 0 }}>
            <Autocomplete
              value={
                Array.isArray(dataDropdownOptions)
                  ? dataDropdownOptions.find(
                      (option) => option.noReferensi === selectedUser
                    ) || null
                  : null
              }
              options={dataDropdownOptions}
              getOptionLabel={(option) => option.namaPengguna || ""}
              isOptionEqualToValue={(option, value) =>
                option.noReferensi === value?.noReferensi
              }
              id="autocomplete-pilih-pengguna"
              sx={{ width: "100%" }}
              onChange={(event, newValue) => {
                setSelectedUser(newValue ? newValue.noReferensi : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pilih Pengguna"
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

          {/* Button Tambahkan */}
          <Grid item xs={12} sm={6} md={1.5}>
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              disabled={!selectedUser}
              sx={{
                width: "100%",
                height: "40.5px",
                ml: { xs: 0, sm: 2 },
                mt: { xs: 2, sm: 0 },
              }} // Responsif, sesuaikan margin dan lebar
            >
              Tambahkan
            </MDButton>
          </Grid>
        </MDBox>

        {/* DataTable komponen */}
        <DataTable
          table={{
            columns: dataTableData.columns,
            rows: filteredRows,
          }}
          entriesPerPage={false}
          isSorted={false}
          canSearch={false}
        />
      </MDBox>
    </Card>
  );
}

export default PenggunaGrupList;
