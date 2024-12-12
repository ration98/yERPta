import DataTable from "/examples/Tables/DataTable";
import Footer from "/examples/Footer";
import DashboardLayout from "/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "/examples/Navbars/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import MDBox from "/components/MDBox";
import { DataGrid } from "@mui/x-data-grid";
import PenggunaGrupList from "../../../../../pagesComponents/karyawan-dan-grup/grup/grup-view/pengguna-grup";

const dataTable = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <Card>
          <PenggunaGrupList></PenggunaGrupList>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default dataTable;
