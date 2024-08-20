import { Check, Delete, Edit, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab, IconButton, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { green } from "@mui/material/colors";
// import AuthAPI from "../../../api/firebase/AuthAPI";

const DataGridActions = ({
  params,
  rowId = null,
  setRowId,
  onEdit = null,
  onDelete = null,
  onVisibilityChange = null,
  onSave = null,
  onSaveHandle = null,
  itemName = null,
}) => {
  let toolbar_title = "";
  let icon = null;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // const authAPI = new AuthAPI();
  if (onVisibilityChange !== null) {
    let proVisibility = true;
    let place = "";
    let on_title = "Show";
    let off_title = "Hide";
    if (itemName === "Product") {
      proVisibility = params.row.visible;
      place = "website";
    } else if (itemName === "Category") {
      proVisibility = params.row.showInNavbar;
      place = "navbar";
    }
    toolbar_title = proVisibility
      ? "Hide " + itemName + " from " + place
      : "Show " + itemName + " on " + place;

    if (itemName === "Coupon") {
      proVisibility = params.row.isActive;
      toolbar_title = proVisibility
        ? "Inactivate " + itemName
        : "Activate " + itemName;
    }

    icon = proVisibility ? (
      <VisibilityOffIcon color="visibilityIcon" />
    ) : (
      <VisibilityIcon color="visibilityIcon" />
    );
  }
  const handleSave = () => {
    setLoading(true);
    const userRole = params.row.role === "Admin" ? ["User", "Admin"] : ["User"];
    const userData = {
      id: params.id,
      payload: {
        role: userRole,
        modifiedAt: new Date().toString(),
      },
    };

    // authAPI
    //   .setUserInTable(userData)
    //   .then((data) => {
    //     setLoading(false);
    //     setSuccess(true);
    //     setRowId(null);
    //     onSaveHandle({success: true});
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     setSuccess(true);
    //     setRowId(null);
    //     onSaveHandle({success: false});
    //   });
  };
  useEffect(() => {
    if (rowId === params.id && success) setSuccess(false);
  }, [rowId]);

  return (
    <Box>
      {onSave !== null && (
        <Box sx={{ position: "relative" }}>
          {success ? (
            <Fab
              color="primary"
              sx={{
                width: 40,
                height: 40,
                bgcolor: green[500],
                "&:hover": { bgcolor: green[700] },
              }}
            >
              <Check />
            </Fab>
          ) : (
            <Fab
              sx={{
                width: 40,
                height: 40,
              }}
              disabled={params.id !== rowId || loading}
              onClick={handleSave}
            >
              <Save />
            </Fab>
          )}
          {loading && (
            <CircularProgress
              size={52}
              sx={{
                color: green[500],
                position: "absolute",
                top: -6,
                left: -6,
                zIndex: 1,
              }}
              thickness={2}
            />
          )}
        </Box>
      )}

      {onVisibilityChange !== null && (
        <Tooltip title={toolbar_title}>
          <IconButton
            onClick={() => {
              console.log("params:", params.row);
              let payload = {};
              switch (itemName) {
                case "Product":
                  payload = { visible: !params.row.visible };
                  break;
                case "Category":
                  payload = { showInNavbar: !params.row.showInNavbar };
                  break;
                case "Coupon":
                  payload = { isActive: !params.row.isActive };
                  break;
              }
              onVisibilityChange("UPDATE", params.row.id, payload);
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}
      {onEdit !== null && (
        <Tooltip title={"Edit " + itemName}>
          <IconButton
            onClick={() => {
              onEdit(params.row);
            }}
          >
            <Edit color="primary" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete !== null && (
        <Tooltip title={"Delete " + itemName}>
          <IconButton
            onClick={() => {
              onDelete(params.row.id);
            }}
          >
            <Delete color="danger" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default DataGridActions;
