import React from "react";
import PropTypes from "prop-types";

// @mui/material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Material Dashboard 2 PRO React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";

// Material Dashboard 2 PRO React base styles
import typography from "../../../../assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <MDBox position="absolute" width="100%" bottom={0} py={4}>
      <Container>
        <Grid
          container
          spacing={2}
          direction={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            sm={6}
            textAlign={isSmallScreen ? "center" : "left"}
          >
            <MDBox
              display="flex"
              justifyContent={isSmallScreen ? "center" : "flex-start"}
              alignItems="center"
              flexWrap="wrap"
              color={light ? "white" : "text"}
              fontSize={size.sm}
            >
              &copy; {new Date().getFullYear()}, created by
              <Link href="https://www.intelsysdata.com/" target="_blank">
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  color={light ? "white" : "dark"}
                >
                  &nbsp;PT. Madani Intelsysdata&nbsp;
                </MDTypography>
              </Link>
              for a better ERP.
            </MDBox>
          </Grid>
          {/* Uncomment this section if you want to add more links */}
          {/* <Grid item xs={12} sm={6} textAlign={isSmallScreen ? "center" : "right"}>
            <MDBox
              component="ul"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: isSmallScreen ? "center" : "flex-end",
                listStyle: "none",
                mt: 3,
                mb: 0,
                p: 0,
              }}
            >
              <MDBox component="li" pr={2} lineHeight={1}>
                <Link href="https://www.creative-tim.com/" target="_blank">
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color={light ? "white" : "dark"}
                  >
                    Creative Tim
                  </MDTypography>
                </Link>
              </MDBox>
              <MDBox component="li" px={2} lineHeight={1}>
                <Link href="https://www.creative-tim.com/presentation" target="_blank">
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color={light ? "white" : "dark"}
                  >
                    About Us
                  </MDTypography>
                </Link>
              </MDBox>
              <MDBox component="li" px={2} lineHeight={1}>
                <Link href="https://www.creative-tim.com/blog" target="_blank">
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color={light ? "white" : "dark"}
                  >
                    Blog
                  </MDTypography>
                </Link>
              </MDBox>
              <MDBox component="li" pl={2} lineHeight={1}>
                <Link href="https://www.creative-tim.com/license" target="_blank">
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color={light ? "white" : "dark"}
                  >
                    License
                  </MDTypography>
                </Link>
              </MDBox>
            </MDBox>
          </Grid> */}
        </Grid>
      </Container>
    </MDBox>
  );
}

// Setting default props for the Footer
Footer.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
