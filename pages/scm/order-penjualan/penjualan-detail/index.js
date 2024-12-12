import React from "react";
import { Button, FormControl } from "@mui/material";
import { styled } from "@mui/system";
import Footer from "../../../../examples/Footer";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../../components/MDBox";
// import CobaValidasi from "../../../../pagesComponents/form/ternaks/detail/cobavalidasi";
import OrderPenjualanDetail from "../../../../pagesComponents/scm/order-penjualan/penjualan-detail";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  marginBottom: theme.spacing(2),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const MyForm = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <OrderPenjualanDetail></OrderPenjualanDetail>
        {/* <CobaValidasi></CobaValidasi> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MyForm;
