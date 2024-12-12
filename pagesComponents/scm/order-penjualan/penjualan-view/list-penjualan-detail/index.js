import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Grid, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import DataTable from "../../../../../examples/Tables/DataTable";
import MDTypography from "../../../../../components/MDTypography";
import Swal from "sweetalert2";
import MDBox from "../../../../../components/MDBox";
import { deleteOrderDetail, getFkOrder } from "../../../../../api/order-detail";
import { forView } from "../../../../../api/order-penjualan";
import EditIcon from "@mui/icons-material/Edit";

function OrderDetailList({ handleEdit }) {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const router = useRouter();
  const showActionControls = selectedRows.length > 0;

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    getFkOrder(id)
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

  // const handleEdit = (noReferensi) => {
  //   router.push(`/form/pengguna/detail?noReferensi=${noReferensi}`);
  // };

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
          await deleteOrderDetail(sandi);
          Swal.fire({
            title: "Berhasil!",
            text: "Data telah dihapus",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          const searchParams = new URLSearchParams(window.location.search);
          const id = searchParams.get("id");
          // getAllData();
          // forView(id);
          location.reload();
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

  const dataTableData = {
    columns: [
      {
        Header: "Deskripsi",
        accessor: "namaProduk",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Pajak",
        accessor: "ppn",
        style: {
          textAlign: "center",
        },
        Cell: ({ value }) => <span>{value}%</span>,
      },
      {
        Header: "Harga",
        accessor: "harga",
        style: {
          textAlign: "center",
        },
      },
      {
        Header: "Harga Tanpa Potongan",
        accessor: "subHarga",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Quantity",
        accessor: "jumlah",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Potongan",
        accessor: "diskon",
        style: {
          textAlign: "left",
        },
      },
      {
        Header: "Total",
        accessor: "total",
      },
      {
        Header: "Aksi",
        accessor: "noReferensi",
        Cell: ({ value }) => (
          <>
            <IconButton onClick={() => handleEdit(value)}>
              <EditIcon
                fontSize="medium"
                style={{ color: "orange", verticalAlign: "middle" }}
              />
            </IconButton>
            <IconButton onClick={() => handleDelete(value)}>
              <DeleteIcon
                fontSize="medium"
                style={{ color: "red", verticalAlign: "middle" }}
              />
            </IconButton>
          </>
        ),
      },
    ],
  };

  const classes = useStyles();

  return (
    <MDBox mt={4}>
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
              <MDTypography variant="h5">List Order Detail</MDTypography>
            </Grid>
          </Grid>
          <DataTable
            table={{
              columns: dataTableData.columns,
              rows: filteredRows,
            }}
            entriesPerPage={false}
            isSorted={false}
            // canSearch
          />
        </MDBox>
      </Card>
    </MDBox>
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

export default OrderDetailList;
