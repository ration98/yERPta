import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MDButton from "/components/MDButton";
import DataTable from "/examples/Tables/DataTable";
import {
  Card,
  Grid,
  Checkbox,
  Tooltip,
  Autocomplete,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getGrup, deleteGrupArray } from "../../../../api/grup";
import MDTypography from "/components/MDTypography";
import MDBox from "/components/MDBox";
import Swal from "sweetalert2";
import GroupsIcon from "@mui/icons-material/Groups";
import AgriculturalIcon from "@mui/icons-material/Agriculture";
import CalculateIcon from "@mui/icons-material/Calculate";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandshakeIcon from "@mui/icons-material/Handshake";

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
    borderRadius: "10px",
  },
  statusClosed: {
    backgroundColor: "red",
    color: "#fff",
    padding: "5px",
    borderRadius: "10px",
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

function GrupPenggunasList() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  //checkbox
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  //dropdown opsi
  const [action, setAction] = useState("");
  const [confirmEnabled, setConfirmEnabled] = useState(false);

  useEffect(() => {
    getAllData();
  }, []);

  //get data query
  const getAllData = async () => {
    try {
      const response = await getGrup();
      const data = await response.json();

      // console.log("respon: ", data);

      setRows(data);
      setFilteredRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const actionOptions = [{ value: "delete", label: "Hapus" }];

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

    console.log("Selected All:", filteredRows);
  };

  const handleConfirm = async () => {
    setConfirmEnabled(true);
    if (selectedRows.length === 0) {
      console.warn("No rows selected");
      return; // Tidak lakukan apa-apa jika tidak ada baris yang dipilih
    }

    if (action === "delete") {
      Swal.fire({
        title: "Anda yakin untuk menghapus data ini?",
        text: "Data yang anda hapus tidak akan bisa dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batalkan",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("Deleting rows:", selectedRows);
          try {
            const response = await deleteGrupArray({
              noreferensiArray: selectedRows,
            });

            if (response) {
              getAllData();
              Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data telah dihapus",
                confirmButtonText: "OK",
              });
            } else {
              throw new Error("Failed to delete data");
            }
          } catch (error) {
            console.error("Error deleting data:", error);
            Swal.fire({
              icon: "error",
              title: "Gagal menghapus data",
              text: "Terjadi kesalahan saat menghapus data. Silakan coba lagi.",
              confirmButtonText: "OK",
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
    }

    setAction(""); // Reset action setelah konfirmasi
    setSelectedRows([]); // Clear selected rows setelah konfirmasi
    setConfirmEnabled(false); // Simulasikan selesai loading
  };

  const handleActionChange = (event, value) => {
    setAction(value ? value.value : "");
    setConfirmEnabled(value !== null);
  };

  const CustomCell = ({ row, value }) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
      router.push(
        `/karyawan-dan-grup/grup/grup-view?id=${row.original.noReferensi}`
      );
    };

    const tooltipContent = (
      <div className={classes.tooltipContent}>
        <div className={classes.tooltipText}>
          <div>
            <strong>Grup:</strong> {row.original.namaGrup}
          </div>
          <div>
            <strong>Deskripsi:</strong> {row.original.catatan}
          </div>
        </div>
        {row.original.foto && (
          <img
            src={row.original.foto}
            alt="foto"
            className={classes.tooltipFoto}
          />
        )}
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
        PopperProps={{ disablePortal: true }}
      >
        <span
          onClick={handleClick}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            display: "flex",
            alignItems: "center",
          }}
        >
          {(() => {
            const lowerCaseNamaGrup = row.original.namaGrup?.toLowerCase();
            switch (lowerCaseNamaGrup) {
              case "hrm":
                return (
                  <GroupsIcon style={{ marginRight: "8px" }} fontSize="small" />
                );
              case "operational":
              case "operasional":
                return (
                  <AgriculturalIcon
                    style={{ marginRight: "8px" }}
                    fontSize="small"
                  />
                );
              case "accounting":
              case "akuntansi":
                return (
                  <CalculateIcon
                    style={{ marginRight: "8px" }}
                    fontSize="small"
                  />
                );
              case "scm":
                return (
                  <InventoryIcon
                    style={{ marginRight: "8px" }}
                    fontSize="small"
                  />
                );
              case "crm":
                return (
                  <HandshakeIcon
                    style={{ marginRight: "8px" }}
                    fontSize="small"
                  />
                );
              default:
                return (
                  <GroupsIcon style={{ marginRight: "8px" }} fontSize="small" />
                );
            }
          })()}
          {value}
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
        Header: "Nama Grup",
        accessor: "namaGrup",
        Cell: ({ row, value }) => <CustomCell row={row} value={value} />,
        width: "10%",
      },
      {
        Header: "Tanggal Dibuat",
        accessor: "tglDibuat",
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
        Header: "Tanggal Dimodifikasi",
        accessor: "tglDimodifikasi",
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
    ],
    rows: filteredRows,
  };

  {
    /* Hapus Data Array */
  }
  // <Grid
  //   container
  //   spacing={2}
  //   alignItems="center"
  //   justifyContent="center" // Menambahkan properti ini
  // >
  //   {selectedRows.length > 0 && (
  //     <>
  //       <Grid
  //         item
  //         xs={12}
  //         sm={6}
  //         md={1.5}
  //         mb={{ xs: 2, sm: 0 }}
  //         display="flex"
  //         justifyContent="center"
  //       >
  //         <Autocomplete
  //           options={actionOptions}
  //           getOptionLabel={(option) => option.label}
  //           value={
  //             action ? actionOptions.find((opt) => opt.value === action) : null
  //           }
  //           onChange={handleActionChange}
  //           renderInput={(params) => (
  //             <TextField
  //               {...params}
  //               label="Pilih Aksi"
  //               variant="outlined"
  //               size="small"
  //               sx={{
  //                 width: "100%",
  //                 "& .MuiInputBase-root": { height: "40.5px" },
  //               }}
  //             />
  //           )}
  //         />
  //       </Grid>

  //       {/* Konfirmasi */}
  //       <Grid item xs={12} sm={6} md={1} display="flex" justifyContent="center">
  //         <MDButton
  //           variant="gradient"
  //           color="dark"
  //           size="small"
  //           onClick={handleConfirm}
  //           disabled={!confirmEnabled}
  //           sx={{
  //             width: "100%",
  //             height: "40.5px",
  //             ml: { xs: 0, sm: 2 },
  //             mt: { xs: 2, sm: 0 },
  //           }}
  //         >
  //           Konfirmasi
  //         </MDButton>
  //       </Grid>
  //     </>
  //   )}
  // </Grid>

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
          {/* Judul List Grup */}
          <Grid item>
            <MDTypography variant="h5">List Grup</MDTypography>
          </Grid>

          {/* Hapus Data Array */}
          {selectedRows.length > 0 && (
            <Grid
              container
              item
              xs={12}
              sm="auto"
              md="auto"
              alignItems="center"
              spacing={2}
              justifyContent="center"
              sx={{ minWidth: "300px" }} // Menambah ukuran minimum
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={1.5}
                mb={{ xs: 2, sm: 0 }}
                sx={{ minWidth: "150px" }}
              >
                <Autocomplete
                  options={actionOptions}
                  getOptionLabel={(option) => option.label}
                  value={
                    action
                      ? actionOptions.find((opt) => opt.value === action)
                      : null
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

              {/* Button Konfirmasi */}
              <Grid item xs={12} sm={6} md={1}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={handleConfirm}
                  disabled={!confirmEnabled}
                  sx={{
                    // width: "100%",
                    // height: "40.5px",
                    ml: { xs: 0, sm: 2 },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  Konfirmasi
                </MDButton>
              </Grid>
            </Grid>
          )}

          {/* Button Tambah Data */}
          <Grid>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              sx={{
                // width: "100%",
                // height: "40.5px",
                ml: { xs: 0, sm: 2 },
                mt: { xs: 2, sm: 0 },
              }}
              onClick={() => router.push("/karyawan-dan-grup/grup/grup-detail")}
            >
              &nbsp; Tambah Data
            </MDButton>
          </Grid>
        </Grid>

        <DataTable
          table={{
            columns: dataTableData.columns,
            rows: filteredRows,
          }}
          entriesPerPage={{ defaultValue: 10, entries: [5, 10, 15, 20, 25] }}
          isSorted={false}
          canSearch
        />
      </MDBox>
    </Card>
  );
}

export default GrupPenggunasList;
