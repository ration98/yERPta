import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Switch,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderIcon from "@mui/icons-material/Folder";
import MDBox from "/components/MDBox";
import MDButton from "/components/MDButton";
import MDTypography from "/components/MDTypography";
import {
  addAksesGrup,
  addAksesGrupByModul,
  addAksesGrupAll,
  deleteAksesGrup,
  deleteAksesGrupByModul,
  deleteAksesGrupAll,
} from "../../../../../api/akses-grup";

function GrupAkses({ initialData, groupId }) {
  // **State**
  const [data, setData] = useState([]);
  const [globalToggle, setGlobalToggle] = useState(true); // All/None global
  const [moduleToggle, setModuleToggle] = useState([]); // All/None per modul
  const [moduleExpand, setModuleExpand] = useState([]); // Expand/collapse modul
  const [expandAll, setExpandAll] = useState(true); // Expand/collapse global

  useEffect(() => {
    const savedPermissions = localStorage.getItem("permissions");
    if (savedPermissions) {
      const parsedData = JSON.parse(savedPermissions);

      // Set data ke state
      setData(parsedData);

      // Perbarui moduleToggle berdasarkan data izin
      const newModuleToggle = parsedData.map((module) =>
        module.permissions.every((perm) => perm.enabled)
      );
      setModuleToggle(newModuleToggle);

      // Perbarui globalToggle berdasarkan data izin
      const isAllPermissionsEnabled = newModuleToggle.every((toggle) => toggle);
      setGlobalToggle(isAllPermissionsEnabled);
    } else {
      // Format data jika tidak ada di localStorage
      const formattedData = initialData.reduce((acc, item) => {
        const { posisiModul, namaModul, deskripsi } = item;
        const key = `${posisiModul}-${namaModul}`;
        if (!acc[key]) {
          acc[key] = { module: namaModul, posisiModul, permissions: [] };
        }
        acc[key].permissions.push({
          fkAkses: item.idAkses,
          name: deskripsi,
          enabled: false,
        });
        return acc;
      }, {});

      const formattedArray = Object.values(formattedData);
      setData(formattedArray);

      // Default: semua toggle diatur ke false
      setModuleToggle(formattedArray.map(() => false));
      setGlobalToggle(false);
      setModuleExpand(formattedArray.map(() => false));
    }
  }, [initialData]);

  // **Toggle Izin Individu**
  const togglePermission = async (moduleIndex, permIndex) => {
    const updatedData = [...data];
    const permission = updatedData[moduleIndex].permissions[permIndex];
    try {
      if (!permission.enabled) {
        // Tambahkan data
        await addAksesGrup({
          fkGrup: groupId,
          fkAkses: permission.fkAkses,
          fkPosisiModul: data[moduleIndex].posisiModul,
        });
      } else {
        // Hapus data
        await deleteAksesGrup(
          permission.fkAkses,
          data[moduleIndex].posisiModul,
          groupId
        );
      }

      permission.enabled = !permission.enabled;
      setData(updatedData);
      localStorage.setItem("permissions", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to toggle permission: ", error);
    }
  };

  // **Toggle Semua Izin dalam Modul**
  const toggleModulePermissions = async (moduleIndex) => {
    const module = data[moduleIndex];
    const updatedData = [...data];

    try {
      if (!moduleToggle[moduleIndex]) {
        // Jika saat ini None, ubah ke All: tambahkan izin
        await addAksesGrupByModul(
          module.permissions.map((perm) => ({
            fkGrup: groupId,
            fkAkses: perm.fkAkses,
            fkPosisiModul: module.posisiModul,
          }))
        );
      } else {
        // Jika saat ini All, ubah ke None: hapus izin
        await deleteAksesGrupByModul(module.posisiModul);
      }

      // Perbarui status 'enabled' untuk setiap permission di modul
      const newToggleState = !moduleToggle[moduleIndex];
      updatedData[moduleIndex].permissions = updatedData[
        moduleIndex
      ].permissions.map((perm) => ({
        ...perm,
        enabled: newToggleState,
      }));
      setData(updatedData);

      // Perbarui toggle untuk modul
      const updatedModuleToggle = [...moduleToggle];
      updatedModuleToggle[moduleIndex] = newToggleState;
      setModuleToggle(updatedModuleToggle);

      // Perbarui globalToggle
      const isAllPermissionsEnabled = updatedModuleToggle.every(
        (toggle) => toggle
      );
      setGlobalToggle(isAllPermissionsEnabled);

      // Simpan ke localStorage
      localStorage.setItem("permissions", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to toggle module permissions:", error);
    }
  };

  // **Toggle Semua Izin (Global)**
  const toggleAllPermissions = async () => {
    try {
      const updatedData = [...data];
      const newGlobalToggle = !globalToggle;

      if (newGlobalToggle) {
        // Tambahkan semua izin
        await addAksesGrupAll(
          data.flatMap((module) =>
            module.permissions.map((perm) => ({
              fkGrup: groupId,
              fkAkses: perm.fkAkses,
              fkPosisiModul: module.posisiModul,
            }))
          )
        );
      } else {
        // Hapus semua izin
        await deleteAksesGrupAll({ groupId });
      }

      // Update semua permissions berdasarkan status global toggle
      updatedData.forEach((module) => {
        module.permissions.forEach((perm) => {
          perm.enabled = newGlobalToggle;
        });
      });

      // Update semua module toggles
      const updatedModuleToggle = updatedData.map(() => newGlobalToggle);

      setData(updatedData);
      setGlobalToggle(newGlobalToggle);
      setModuleToggle(updatedModuleToggle);

      // Simpan data yang diupdate ke localStorage
      localStorage.setItem("permissions", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to toggle all permissions:", error);
    }
  };

  // **Expand/Collapse Modul**
  const toggleExpandModule = (moduleIndex) => {
    const updatedModuleExpand = [...moduleExpand];
    updatedModuleExpand[moduleIndex] = !updatedModuleExpand[moduleIndex];
    setModuleExpand(updatedModuleExpand);
  };

  // **Expand/Collapse Semua Modul**
  const handleExpandAll = () => {
    setExpandAll(!expandAll);
    setModuleExpand(moduleExpand.map(() => !expandAll));
  };

  return (
    <MDBox p={2}>
      {/* Header Global Buttons */}
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <ButtonGroup variant="contained" color="primary">
          <MDButton onClick={toggleAllPermissions}>
            {globalToggle ? "None" : "All"}
          </MDButton>
        </ButtonGroup>
        <MDButton onClick={handleExpandAll} variant="contained" color="primary">
          {expandAll ? "Undo Expand" : "Expand All"}
        </MDButton>
      </MDBox>

      {/* Module Cards */}
      <Grid container spacing={2}>
        {data.map((module, moduleIndex) => (
          <Grid item xs={12} key={module.module}>
            <Card>
              <CardContent>
                {/* Header Modul */}
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <MDTypography variant="h6">{module.module}</MDTypography>
                  <MDBox display="flex" alignItems="center">
                    <IconButton
                      onClick={() => toggleExpandModule(moduleIndex)}
                      color="primary"
                    >
                      {moduleExpand[moduleIndex] ? (
                        <FolderOpenIcon />
                      ) : (
                        <FolderIcon />
                      )}
                    </IconButton>
                    <ButtonGroup
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      <MDButton
                        onClick={() => toggleModulePermissions(moduleIndex)}
                      >
                        {moduleToggle[moduleIndex] ? "None" : "All"}
                      </MDButton>
                    </ButtonGroup>
                  </MDBox>
                </MDBox>

                {/* Daftar Permissions */}
                {moduleExpand[moduleIndex] && (
                  <MDBox mt={2}>
                    {module.permissions.map((perm, permIndex) => (
                      <MDBox
                        key={perm.name}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <MDTypography>{perm.name}</MDTypography>
                        <Switch
                          checked={perm.enabled}
                          onChange={() =>
                            togglePermission(moduleIndex, permIndex)
                          }
                          color="primary"
                        />
                      </MDBox>
                    ))}
                  </MDBox>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );
}

export default GrupAkses;
