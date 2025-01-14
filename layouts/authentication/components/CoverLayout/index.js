import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "../../../../components/MDBox";
import PageLayout from "../../../../examples/LayoutContainers/PageLayout";
import Footer from "../../components/Footer";

function CoverLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <MDBox display="flex" flexDirection="column" minHeight="100vh">
        <MDBox
          width="calc(100% - 2rem)"
          minHeight={coverHeight}
          borderRadius="xl"
          mx={2}
          my={2}
          pt={6}
          pb={28}
          sx={{
            backgroundImage: ({
              functions: { linearGradient, rgba },
              palette: { gradients },
            }) =>
              image &&
              `${linearGradient(
                rgba(gradients.dark.main, 0.4),
                rgba(gradients.dark.state, 0.4)
              )}, url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <MDBox
          flexGrow={1}
          mt={{ xs: -50, lg: -50 }}
          px={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
              {children}
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </MDBox>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  coverHeight: "35vh",
};

CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
