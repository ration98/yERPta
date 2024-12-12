// _app.js
import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "/components/MDBox";
import Sidenav from "/examples/Sidenav";
import Configurator from "/examples/Configurator";
import theme from "/assets/theme";
import themeRTL from "/assets/theme/theme-rtl";
import themeDark from "/assets/theme-dark";
import themeDarkRTL from "/assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "/context";
import appleIcon from "../assets/images/apple-icon.png";
import brandWhite from "../assets/images/erp white.png";
import brandDark from "../assets/images/erp dark.png";
import iconERP from "../assets/images/erp (3).png";
import { UserProvider } from "../context/userContext";
import ProtectedRoute from "../layouts/authentication/components/Hoc/protectedRoute";
import getRoutes from "../routes";
import { useUser } from "../context/userContext";

const clientSideEmotionCache = createCache({ key: "css", prepend: true });

function Main({ Component, pageProps }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname, push } = useRouter();
  //tambahan
  const { user } = useUser();
  const router = getRoutes(user);
  // const routes = useMemo(() => getRoutes(user), [user]);

  // useEffect(() => {
  //   // Redirect to login if the current path is the root
  //   if (pathname === "/") {
  //     router.push("/authentication/sign-in/basic");
  //   }
  // }, [pathname, router]);

  useEffect(() => {
    if (pathname === "/") {
      push("/authentication/sign-in/basic");
    }
  }),
    [pathname, push];

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const brandIcon =
    (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite;

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        <Component {...pageProps} />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brandIcon}
              brandName="Material Dashboard"
              routes={router}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Component {...pageProps} />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brandIcon}
            brandName="ERP Project"
            routes={router}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
    </ThemeProvider>
  );
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <UserProvider>
      {/* <ProtectedRoute> */}
        <MaterialUIControllerProvider>
          <CacheProvider value={emotionCache}>
            <Head>
              ``
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="shortcut icon" href={iconERP.src} />
              <link rel="apple-touch-icon" sizes="76x76" href={appleIcon.src} />
              <title>ERP Project</title>
            </Head>
            <Main Component={Component} pageProps={pageProps} />
          </CacheProvider>
        </MaterialUIControllerProvider>
      {/* </ProtectedRoute> */}
    </UserProvider>
  );
}

export default MyApp;
