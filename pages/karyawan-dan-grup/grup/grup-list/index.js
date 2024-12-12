import DataTable from "/examples/Tables/DataTable";
import Footer from "/examples/Footer";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import MDBox from "/components/MDBox";
import { DataGrid } from "@mui/x-data-grid";
import GrupPenggunasList from "../../../../pagesComponents/karyawan-dan-grup/grup/grup-list";

const dataTable = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <Card>
          <GrupPenggunasList></GrupPenggunasList>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default dataTable;
