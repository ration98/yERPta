import React from "react";

import { useUser } from "../context/userContext";

// NextJS Material Dashboard 2 PRO components
import MDAvatar from "/components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

// Images
import profilePicture from "/assets/images/team-3.jpg";

//logo

import { useRouter } from "next/router";

// Fungsi yang menghasilkan routes berdasarkan user context
const getRoutes = (user, handleLogout) => {
  // console.log(handleLogout);
  return [
    {
      type: "collapse",
      name: user?.namaLengkap || "Brooklyn Alice",
      key: "user-profile",
      icon: (
        <MDAvatar
          src={user?.foto || profilePicture.src}
          alt={user?.namaLengkap || "Brooklyn Alice"}
          size="sm"
        />
      ),
      collapse: [
        {
          name: "My Profile",
          key: "my-profile",
          route: "/pages/profile/profile-overview",
        },
        {
          name: "Settings",
          key: "profile-settings",
          route: "/pages/account/settings",
        },
        {
          name: "Logout",
          key: "logout",
          route: "",
          onClick: handleLogout,
        },
      ],
    },
    { type: "divider", key: "divider-0" },
    {
      type: "collapse",
      name: "Dashboards",
      key: "dashboards",
      icon: <Icon fontSize="medium">dashboard</Icon>,
      collapse: [
        {
          name: "Analytics",
          key: "analytics",
          route: "/dashboards/analytics",
        },
        {
          name: "Sales",
          key: "sales",
          route: "/dashboards/sales",
        },
      ],
    },

    // Grup & Karyawan
    {
      type: "collapse",
      name: "Karyawan & Grup",
      key: "karyawan-dan-grup",
      // icon: <Icon fontSize="medium">groups</Icon>,
      icon: <SupervisorAccountIcon />,
      collapse: [
        {
          name: "Karyawan",
          key: "karyawan-grup",
          collapse: [
            {
              name: "Tambah karyawan",
              key: "karyawan-grup-detail",
              route: "/karyawan-dan-grup/karyawan/karyawan-detail",
            },
            {
              name: "List Karyawan",
              key: "karyawan-grup-list",
              route: "/karyawan-dan-grup/karyawan/karyawan-list",
            },
          ],
        },
        {
          name: "Grup",
          key: "grup",
          collapse: [
            {
              name: "Tambah Grup",
              key: "grup-detail",
              route: "/karyawan-dan-grup/grup/grup-detail",
            },
            {
              name: "List Grup",
              key: "karyawan-list",
              route: "/karyawan-dan-grup/grup/grup-list",
            },
          ],
        },
      ],
    },

    { type: "divider", key: "divider-0" },

    { type: "title", title: "Halaman", key: "title-pages" },
    // CRM
    {
      type: "collapse",
      name: "CRM",
      key: "crm",
      icon: <Icon fontSize="medium">handshake</Icon>,
      // icon: (
      //   <MDAvatar
      //     src={crm.src}
      //     size="sm"
      //   />
      // ),
      collapse: [
        {
          name: "Pihak Ketiga",
          key: "pihakketiga",
          collapse: [
            {
              name: "List Pihak Ketiga",
              key: "#",
              route: "#",
            },
            {
              name: "List Prospect",
              key: "#",
              route: "#",
            },
          ],
        },
        {
          name: "Kontak / Alamat",
          key: "kontak / alamat",
          collapse: [
            {
              name: "Tambah Kontak Alamat",
              key: "#",
              route: "#",
            },
            {
              name: "List Kontak Alamat",
              key: "#",
              route: "#",
            },
          ],
        },
      ],
    },

    // SCM
    {
      type: "collapse",
      name: "SCM",
      key: "scm",
      icon: <Icon fontSize="medium">inventory</Icon>,
      collapse: [
        {
          name: "Produk",
          key: "produk",
          collapse: [
            {
              name: "Tambah Produk",
              key: "produk detail",
              route: "#",
            },
            {
              name: "List Produk",
              key: "produk list",
              route: "#",
            },
          ],
        },
        {
          name: "Stok",
          key: "stok",
          collapse: [
            {
              name: "List Stok",
              key: "stok list",
              route: "#",
            },
          ],
        },
        {
          name: "Gudang",
          key: "gudang",
          collapse: [
            {
              name: "Tambah Gudang",
              key: "gudang detail",
              route: "#",
            },
            {
              name: "List Gudang",
              key: "stok list",
              route: "#",
            },
            {
              name: "Perpindahan Stok",
              key: "perpindahan stok",
              route: "#",
            },
            {
              name: "Pemindahan Masal",
              key: "pemindahan stok",
              route: "#",
            },
          ],
        },
        {
          name: "Inventori",
          key: "inventori",
          collapse: [
            {
              name: "Tambah Inventori",
              key: "inventori detail",
              route: "#",
            },
            {
              name: "List Inventori",
              key: "stok list",
              route: "#",
            },
          ],
        },
        {
          type: "collapse",
          name: "Order Penjualan",
          key: "order-penjualan",
          icon: <Icon fontSize="medium">sales</Icon>,
          collapse: [
            {
              name: "Tambah Order",
              key: "penjualan-detail",
              route: "#",
            },
            {
              name: "Order List",
              key: "penjualan-list",
              route: "#",
            },
          ],
        },
      ],
    },

    //Accounting
    {
      type: "collapse",
      name: "Accounting",
      key: "accounting",
      icon: <Icon fontSize="medium">calculate</Icon>,
      collapse: [
        {
          type: "collapse",
          name: "Tagihan / Pembayaran",
          key: "pembayaran",
          icon: <Icon fontSize="medium">sales</Icon>,
          collapse: [
            {
              name: "Detail",
              key: "detail",
              route: "#",
            },
            {
              name: "List",
              key: "list",
              route: "#",
            },
          ],
        },
        {
          type: "collapse",
          name: "Bank / Kas",
          key: "bank",
          icon: <Icon fontSize="medium">sales</Icon>,
          collapse: [
            {
              name: "Detail",
              key: "detail",
              route: "#",
            },
            {
              name: "List",
              key: "list",
              route: "#",
            },
          ],
        },
        {
          type: "collapse",
          name: "Pencatatan Transaksi",
          key: "transaksi",
          icon: <Icon fontSize="medium">sales</Icon>,
          collapse: [
            {
              name: "Detail",
              key: "detail",
              route: "#",
            },
            {
              name: "List",
              key: "list",
              route: "#",
            },
          ],
        },
      ],
    },

    //Operasional
    {
      type: "collapse",
      name: "Operasional",
      key: "operasionals",
      icon: <Icon fontSize="medium">agriculture</Icon>,
      collapse: [
        {
          type: "collapse",
          name: "Peternakan",
          key: "peternakans",
          collapse: [
            {
              name: "Tambah Ternak Baru",
              key: "ternaks-detail",
              route: "/operasionals/peternakans/ternaks-detail",
            },
            {
              name: "List Ternak",
              key: "ternaks-list",
              route: "/operasionals/peternakans/ternaks-list",
              // route: "#",
            },
          ],
        },
      ],
    },

    // HRM
    {
      type: "collapse",
      name: "HRM",
      key: "hrm",
      icon: <Icon fontSize="medium">groups</Icon>,
      collapse: [
        {
          name: "Karyawan",
          key: "karyawan",
          collapse: [
            {
              name: "Tambah karyawan",
              key: "karyawan-detail",
              route: "/hrm/karyawan/karyawan-detail",
            },
            {
              name: "List Karyawan",
              key: "karyawan-list",
              route: "/hrm/karyawan/karyawan-list",
            },
          ],
        },
      ],
    },
  ];
};

// Komponen Routes yang menggunakan user context dan mengembalikan routes
const Routes = () => {
  // const { user, setUser } = useUser(); // Ambil setUser untuk reset user setelah logout
  const { user, logout } = useUser();
  const router = useRouter();
  // console.log(user);


  // const handleLogout = () => {
  //   console.log("keluar");
  //   // Hapus token dari localStorage
  //   localStorage.removeItem("authToken");
  //   // Reset data user di context
  //   setUser(null);
  //   // Arahkan ke halaman login
  //   router.push("/authentication/sign-in/basic");
  // };

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    router.push("/authentication/sign-in/basic");
  };

  return getRoutes(user, handleLogout); // Kirim handleLogout sebagai argumen
};

export default Routes;
