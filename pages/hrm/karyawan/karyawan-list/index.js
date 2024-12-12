import DataTable from "/examples/Tables/DataTable";
import Footer from "/examples/Footer";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import MDBox from "/components/MDBox";
import { DataGrid } from "@mui/x-data-grid";
import PenggunasList from "../../../../pagesComponents/hrm/karyawan/karyawan-list";

const dataTable = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <Card>
          <PenggunasList></PenggunasList>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default dataTable;
