/**
=========================================================
* NextJS Material Dashboard 2 PRO - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard-pro
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the page layout of NextJS Material Dashboard 2 PRO are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the DefaultNavbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `name` key is used for the name of the route on the DefaultNavbar.
  3. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  4. The `icon` key is used for the icon of the route on the DefaultNavbar, you have to add a node.
  5. The `collapse` key is used for making a collapsible item on the DefaultNavbar that contains other routes inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  6. The `route` key is used to store the route location which is used for the react router.
  7. The `href` key is used to store the external links location.
*/

// @mui material components
import Icon from "@mui/material/Icon";

const pageRoutes = [
  {
    name: "pages",
    columns: 3,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "dashboards",
        icon: <Icon>dashboard</Icon>,
        collapse: [
          {
            name: "analytics",
            route: "/dashboards/analytics",
          },
          {
            name: "sales",
            route: "/dashboards/sales",
          },
        ],
      },

      //CRM
      {
        name: "crm",
        icon: <Icon>handshake</Icon>,
        collapse: [
          {
            name: "pihak-ketiga",
            collapse: [
              {
                name: "pihak-ketiga-detail",
                route: "/crm/pihak-ketiga/pihak-ketiga-detail",
              },
              {
                name: "pihak-ketiga-list",
                route: "/crm/pihak-ketiga/pihak-ketiga-list",
              },
            ],
          },
          {
            name: "kontak-alamat",
            collapse: [
              {
                name: "kontak-alamat-detail",
                route: "/crm/kontak-alamat/kontak-alamat-detail",
              },
              {
                name: "kontak-alamat-list",
                route: "/crm/kontak-alamat/kontak-alamat-list",
              },
            ],
          },
        ],
      },

      //SCM
      {
        name: "scm",
        icon: <Icon>inventory</Icon>,
        collapse: [
          {
            name: "order-penjualan",
            collapse: [
              {
                name: "penjualan-detail",
                route: "/scm/order-penjualan/penjualan-detail",
              },
              {
                name: "penjualan-list",
                route: "/scm/order-penjualan/penjualan-list",
              },
            ],
          },
        ],
      },

      //Accounting

      //Operasionals
      {
        name: "operasionals",
        icon: <Icon>agriculture</Icon>,
        collapse: [
          {
            name: "peternakans",
            collapse: [
              {
                name: "ternaks-detail",
                route: "/operasionals/peternakans/ternaks-detail",
              },
              {
                name: "ternaks-list",
                route: "/operasionals/peternakans/ternaks-list",
              },
            ],
          },
        ],
      },

      //HRM
      {
        name: "hrm",
        icon: <Icon>person</Icon>,
        collapse: [
          {
            name: "list",
            route: "/pagesComponents/hrm/karyawan/karyawan-list",
          },
          {
            name: "list",
            route: "/pagesComponents/hrm/karyawan/karyawan-list",
          },
        ],
      },
      // {
      //   name: "hrm",
      //   icon: <Icon>groups</Icon>,
      //   collapse: [
      //     {
      //       name: "karyawan",
      //       collapse: [
      //         {
      //           name: "karyawan-detail",
      //           route: "/hrm/karyawan/karyawan-detail",
      //         },
      //         {
      //           name: "karyawan-list",
      //           route: "/hrm/karyawan/karyawan-list",
      //         },
      //       ],
      //     },
      //   ],
      // },

      {
        name: "users",
        icon: <Icon>people</Icon>,
        collapse: [
          {
            name: "new user",
            route: "/pages/users/new-user",
          },
        ],
      },
      {
        name: "extra",
        icon: <Icon>queue_play_next</Icon>,
        collapse: [
          {
            name: "pricing page",
            route: "/pages/pricing-page",
          },
          { name: "RTL", route: "/pages/rtl" },
          { name: "widgets", route: "/pages/widgets" },
          { name: "charts", route: "/pages/charts" },
          {
            name: "notfications",
            route: "/pages/notifications",
          },
        ],
      },
      {
        name: "projects",
        icon: <Icon>precision_manufacturing</Icon>,
        collapse: [
          {
            name: "timeline",
            route: "/pages/projects/timeline",
          },
        ],
      },
      {
        name: "account",
        icon: <Icon>account_balance</Icon>,
        collapse: [
          {
            name: "settings",
            route: "/pages/account/setting",
          },
          {
            name: "billing",
            route: "/pages/account/billing",
          },
          {
            name: "invoice",
            route: "/pages/account/invoice",
          },
        ],
      },
      {
        name: "profile",
        icon: <Icon>badge</Icon>,
        collapse: [
          {
            name: "profile overview",
            route: "/pages/profile/profile-overview",
          },
          {
            name: "all projects",
            route: "/pages/profile/all-projects",
          },
        ],
      },
    ],
  },
  {
    name: "authenticaton",
    collapse: [
      {
        name: "sign in",
        dropdown: true,
        icon: <Icon>login</Icon>,
        collapse: [
          {
            name: "basic",
            route: "/authentication/sign-in/basic",
          },
          {
            name: "cover",
            route: "/authentication/sign-in/cover",
          },
          {
            name: "illustration",
            route: "/authentication/sign-in/illustration",
          },
        ],
      },
      {
        name: "sign up",
        dropdown: true,
        icon: <Icon>assignment</Icon>,
        collapse: [
          {
            name: "cover",
            route: "/authentication/sign-up/cover",
          },
        ],
      },
      {
        name: "reset password",
        dropdown: true,
        icon: <Icon>restart_alt</Icon>,
        collapse: [
          {
            name: "cover",
            route: "/authentication/reset-password/cover",
          },
        ],
      },
    ],
  },
  {
    name: "docs",
    collapse: [
      {
        name: "getting started",
        href: "https://www.creative-tim.com/learning-lab/nextjs/quick-start/material-dashboard/",
        description: "All about overview, quick start, license and contents",
        icon: <Icon>article</Icon>,
      },
      {
        name: "foundation",
        href: "https://www.creative-tim.com/learning-lab/nextjs/colors/material-dashboard/",
        description: "See our colors, icons and typography",
        icon: <Icon>grading</Icon>,
      },
      {
        name: "components",
        href: "https://www.creative-tim.com/learning-lab/nextjs/alerts/material-dashboard/",
        description: "Explore our collection of fully designed components",
        icon: <Icon>apps</Icon>,
      },
      {
        name: "plugins",
        href: "https://www.creative-tim.com/learning-lab/nextjs/datepicker/material-dashboard/",
        description: "Check how you can integrate our plugins",
        icon: <Icon>extension</Icon>,
      },
    ],
  },
];

export default pageRoutes;
