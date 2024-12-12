import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Checkbox, Grid, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Swal from "sweetalert2";
import DataTable from "../../../../examples/Tables/DataTable";
import MDButton from "../../../../components/MDButton";
import MDTypography from "../../../../components/MDTypography";
import MDBox from "../../../../components/MDBox";
import { getDataTernakQuery, deleteDataArray } from "../../../../api/ternak";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getDataGudang } from "../../../../api/gudang";
import { getDataRefJenisTernak } from "../../../../api/reference/ref_jenisternak";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

function TernakList() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [filterGudang, setFilterGudang] = useState([]);
  const [filterJenisTernak, setFilterJenisTernak] = useState([]);
  const [jenisTernakOptions, setJenisTernakOptions] = useState([]);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [action, setAction] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const router = useRouter();
  const showActionControls = selectedRows.length > 0;

  useEffect(() => {
    getAllData();
    refGudang();
    refJenisTernak();
    openClosedOptions();
  }, []);

  const actionOptions = [
    { label: "Pilih aksi", value: "" },
    { label: "Delete", value: "delete" },
    // { label: "Clear", value: "clear" },
  ];

  const handleActionChange = (event, newValue) => {
    setAction(newValue?.value || ""); // Set action sesuai dengan nilai yang dipilih
  };

  const handleSelectRow = (noReferensi) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(noReferensi)
        ? prevSelected.filter((id) => id !== noReferensi)
        : [...prevSelected, noReferensi]
    );
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
    setIsConfirm(true);
    if (selectedRows.length === 0) {
      console.warn("No rows selected");
      return; // Tidak lakukan apa-apa jika tidak ada baris yang dipilih
    }

    if (action === "delete") {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data yang dipilih akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batalkan",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("Deleting rows:", selectedRows);
          try {
            const response = await deleteDataArray({
              noreferensiArray: selectedRows,
            });

            if (response.ok) {
              getAllData();
              Swal.fire({
                icon: "success",
                title: "Data berhasil dihapus!",
                text: "Data yang dipilih telah dihapus dengan sukses.",
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

    // else if (action === "clear") {
    //   console.log("Clearing rows:", selectedRows);
    //   // Implementasi pembersihan data
    // }

    setAction(""); // Reset action setelah konfirmasi
    setSelectedRows([]); // Clear selected rows setelah konfirmasi
    // setTimeout(() => {
    setIsConfirm(false); // Simulasikan selesai loading
    // }, 2000);
  };

  const getAllData = () => {
    getDataTernakQuery()
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRows(data);
        setFilteredRows(data); // Initialize filteredRows with all data
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const refGudang = async () => {
    try {
      const response = await getDataGudang();
      const data = await response.json();
      console.log(data); // Tambahkan ini untuk melihat data dari API
      const combinedOptions = [...data];
      setGudangOptions(combinedOptions);
    } catch (error) {
      console.error("Error fetching Error:", error);
    }
  };

  const refJenisTernak = async () => {
    try {
      const response = await getDataRefJenisTernak();
      const data = await response.json();
      console.log(data); // Tambahkan ini untuk melihat data dari API
      const combinedOptions = [...data];
      setJenisTernakOptions(combinedOptions);
    } catch (error) {
      console.error("Error fetching Error:", error);
    }
  };

  const applyFilters = (
    filterGudang = [],
    statusFilter = [],
    filterJenisTernak = []
  ) => {
    let filteredData = [...rows];

    if (filterGudang.length > 0) {
      filteredData = filteredData.filter((row) =>
        filterGudang.some((filter) => row.fkGudang === filter.keterangan)
      );
    }

    if (filterJenisTernak.length > 0) {
      filteredData = filteredData.filter((row) =>
        filterJenisTernak.some(
          (filter) => row.jenisTernak === filter.keterangan
        )
      );
    }

    if (statusFilter.length > 0) {
      filteredData = filteredData.filter((row) =>
        statusFilter.some((filter) => row.statusData === filter.keterangan)
      );
    }

    if (
      filterGudang.length === 0 &&
      filterJenisTernak.length === 0 &&
      statusFilter.length === 0
    ) {
      filteredData = rows; // Reset to original data if all filters are cleared
    }

    setFilteredRows(filteredData);
  };

  const handleFilterChangeGudang = (event, newValue) => {
    setFilterGudang(newValue || []);
    applyFilters(newValue || [], statusFilter);
  };

  const handleFilterChangeTernak = (event, newValue) => {
    setFilterJenisTernak(newValue || []); // Set filterJenisTernak state directly
    applyFilters(filterGudang, statusFilter, newValue || []); // Pass newValue directly
  };

  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue || []);
    applyFilters(filterGudang, newValue || []);
  };

  const CustomCell = ({ row, value }) => {
    const classes = useStyles();
    const router = useRouter();

    const handleClick = () => {
      router.push(
        `/operasionals/peternakans/ternaks-view?id=${row.original.noReferensi}`
      );
    };

    const getStatusCellStyle = (statusData) => {
      switch (statusData) {
        case "Draft":
          return classes.statusDraft;
        case "Valid":
          return classes.statusValid;
        case "Dibatalkan":
          return classes.statusDibatalkan;
        default:
          return null;
      }
    };

    const tooltipContent = (
      <div className={classes.tooltipContent}>
        <div className={classes.tooltipText}>
          <div>
            <strong>Nama:</strong> {row.original.nama}
          </div>
          <div>
            <strong>Nomor Gudang:</strong> {row.original.fkGudang}
          </div>
          <div>
            <strong>Jenis Ternak:</strong> {row.original.jenisTernak}
          </div>
          <div>
            <strong>Spesies:</strong> {row.original.spesies}
          </div>
          <div className={getStatusCellStyle(row.original.statusData)}>
            <strong>Status:</strong> {row.original.statusData}
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
        PopperProps={{
          disablePortal: true,
        }}
      >
        <span
          onClick={handleClick}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
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
        Header: "Nomor Gudang",
        accessor: "fkGudang",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Nomor Ternak",
        accessor: "idTernak",
        Cell: ({ row, value }) => <CustomCell row={row} value={value} />,
      },
      {
        Header: "Nama Ternak",
        accessor: "nama",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Jenis Ternak",
        accessor: "jenisTernak",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Spesies Ternak",
        accessor: "spesies",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Jenis Kelamin Ternak",
        accessor: "jenisKelaminternak",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Status Data",
        accessor: "statusData",
        Cell: ({ value }) => (
          <div
            style={{
              textAlign: "left",
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "20px",
              color: "#fff",
              style: {
                textAlign: "center",
              },
              backgroundColor:
                value === "Draft"
                  ? "#808080" // abu-abu untuk Draft
                  : value === "Valid"
                  ? "green" // hijau untuk Valid
                  : value === "Dibatalkan"
                  ? "red" // merah untuk Cancelled
                  : "inherit", // jika nilai tidak cocok, gunakan warna bawaan
            }}
          >
            {value}
          </div>
        ),
      },
      // {
      //   Header: "Aksi",
      //   accessor: "noReferensi",
      //   Cell: ({ value }) => (
      //     <IconButton onClick={() => handleDelete(value)}>
      //       <DeleteIcon
      //         fontSize="medium"
      //         style={{ color: "red", verticalAlign: "middle" }}
      //       />
      //     </IconButton>
      //   ),
      // },
    ],
  };

  const handleAdd = () => {
    setIsAdd(true);
    router.push("/operasionals/peternakans/ternaks-detail");
    setTimeout(() => {
      setIsAdd(false); // Simulasikan selesai loading
    }, 5000);
  };

  const classes = useStyles();
  const openClosedOptions = () => {
    const options = [
      { sandi: "2", keterangan: "Draft" },
      { sandi: "1", keterangan: "Valid" },
      { sandi: "0", keterangan: "Dibatalkan" },
    ];
    setStatusOptions(options);
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
            <MDTypography variant="h5">List Ternak</MDTypography>
          </Grid>
          {showActionControls && (
            <Grid item md={4}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item md={6}>
                  <Autocomplete
                    options={actionOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                      actionOptions.find((option) => option.value === action) ||
                      null
                    }
                    onChange={handleActionChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Action"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <MDButton
                    onClick={handleConfirm}
                    color="dark"
                    variant="contained"
                    startIcon={
                      isConfirm ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <CheckIcon />
                      )
                    }
                  >
                    {isConfirm ? "Memuat..." : "Konfirmasi"}
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              startIcon={
                isAdd ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
              onClick={handleAdd}
            >
              {isAdd ? "Memuat..." : "Tambah Data"}
            </MDButton>
          </Grid>
        </Grid>
        {/* Filter  Dropdown */}
        <Grid container spacing={2} justifyContent={"flex-end"}>
          <Grid item xs={12} md={2}>
            <Autocomplete
              options={statusOptions}
              getOptionLabel={(option) => option.keterangan}
              value={statusFilter} // Ensure value is always an array
              onChange={handleStatusFilterChange}
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter Status Data"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Autocomplete
              options={gudangOptions}
              getOptionLabel={(option) => option.keterangan}
              value={filterGudang || []} // Ensure value is always an array
              onChange={handleFilterChangeGudang}
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter Nomor Gudang"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Autocomplete
              options={jenisTernakOptions}
              getOptionLabel={(option) => option.keterangan}
              value={filterJenisTernak || []} // Ensure value is always an array
              onChange={handleFilterChangeTernak}
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter Jenis Ternak"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
        <DataTable
          table={{
            columns: dataTableData.columns,
            rows: filteredRows,
          }}
          entriesPerPage={true}
          isSorted={false}
          canSearch
        />
      </MDBox>
    </Card>
  );
}

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
  statusValid: {
    textAlign: "center",
    backgroundColor: "green",
    color: "#fff",
    padding: "5px",
    borderRadius: "10px",
  },
  statusDibatalkan: {
    textAlign: "center",
    backgroundColor: "red",
    color: "#fff",
    padding: "5px",
    borderRadius: "10px",
  },
  statusDraft: {
    textAlign: "center",
    backgroundColor: "grey",
    color: "#fff",
    padding: "5px",
    borderRadius: "10px",
  },
}));

export default TernakList;
