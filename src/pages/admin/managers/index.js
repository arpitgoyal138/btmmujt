/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { Avatar, Box, Snackbar, Typography, Grid } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CustomDataGrid from "../../../components/common/DataGrid/CustomDataGrid";
import MembersAPI from "../../../api/firebase/MembersAPI";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AllManagers = () => {
  const navigate = useNavigate();
  const [membersArr, setMembersArr] = useState([]);
  const [rowId, setRowId] = useState(null);
  const membersAPI = new MembersAPI();

  // Fetch all members
  useEffect(() => {
    const resMembers = membersAPI.getManagers();
    resMembers.then((resData) => {
      //console.log("received:", resData);
      if (!resData) {
        return;
      }
      setMembersArr(resData.data);
      console.log("Done fetching all managers: ", membersArr);
    });
  }, []);

  // For snackbar
  const [snackbarState, setSnackbarState] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const showSnackbar = () => {
    setSnackbarState(true);
  };
  const hideSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState(false);
  };

  //// Columns for Members DataGrid
  const columns = useMemo(
    () => [
      {
        field: "latest_photo",
        headerName: "फोटो",
        width: 80,
        renderCell: (params) => {
          if (
            params.row.latest_photo !== undefined &&
            params.row.latest_photo !== null
          ) {
            return (
              <Avatar
                src={params.row.latest_photo.url}
                sx={{ width: 48, height: 48 }}
              />
            );
          }
          return (
            <Avatar
              src="/static/images/avatar/1.jpg"
              sx={{ width: 48, height: 48 }}
            />
          );
        },
        sortable: false,
        filterable: false,
      },
      { field: "unique_code", headerName: "सदस्य ID", width: 120 },
      { field: "name", headerName: "नाम", width: 120 },
      { field: "fathers_name", headerName: "पिता का नाम", width: 120 },
      { field: "address", headerName: "पता", width: 200 },
      { field: "district", headerName: "जिला", width: 100 },
      { field: "state", headerName: "राज्य", width: 50 },
      { field: "contact_no", headerName: "मोबाइल न०", width: 120 },
      { field: "post_name", headerName: "पद का नाम", width: 120 },
      { field: "work_group", headerName: "कार्यक्षेत्र", width: 100 },
      { field: "work_detail", headerName: "कार्य", width: 150 },
      {
        field: "createdAt",
        headerName: "Created at",
        width: 180,
        renderCell: (params) => {
          let t = "";
          if (typeof params.row.createdAt === "string") {
            t =
              new Date(params.row.createdAt).toLocaleDateString() +
              " " +
              new Date(params.row.createdAt).toLocaleTimeString();
          } else {
            t =
              new Date(
                params.row.createdAt.seconds * 1000 +
                  params.row.createdAt.nanoseconds / 1000000
              ).toLocaleDateString() +
              " " +
              new Date(
                params.row.createdAt.seconds * 1000 +
                  params.row.createdAt.nanoseconds / 1000000
              ).toLocaleTimeString();
          }
          return <div className="rowitem">{t}</div>;
        },
      },
      {
        field: "modifiedAt",
        headerName: "Updated at",
        width: 180,
        renderCell: (params) => {
          let t = "";
          if (params.row.modifiedAt === undefined) {
            return <div className="rowitem">-</div>;
          }
          if (typeof params.row.modifiedAt === "string") {
            t =
              new Date(params.row.modifiedAt).toLocaleDateString() +
              " " +
              new Date(params.row.modifiedAt).toLocaleTimeString();
          } else {
            t =
              new Date(
                params.row.modifiedAt.seconds * 1000 +
                  params.row.modifiedAt.nanoseconds / 1000000
              ).toLocaleDateString() +
              " " +
              new Date(
                params.row.modifiedAt.seconds * 1000 +
                  params.row.modifiedAt.nanoseconds / 1000000
              ).toLocaleTimeString();
          }
          return <div className="rowitem">{t}</div>;
        },
      },
      // {field: "id", hide: true},
      // {
      //   field: "actions",
      //   headerName: "Action",
      //   type: "actions",
      //   renderCell: (params) => (
      //     <DataGridActions
      //       {...{
      //         params,
      //         rowId,
      //         setRowId,
      //         onSave: true,
      //       }}
      //       onSaveHandle={handleSetMember}
      //     />
      //   ),
      // },
    ],
    [rowId]
  );

  /// Add Category to firebase
  const handleSetMember = (resData) => {
    console.log("Resp handleSetMember:", resData);
    // API to add product data to firestore
    if (resData.success) {
      setMessage({
        text: "Member updated successfully !",
        type: "success",
      });
      showSnackbar();
    } else {
      setMessage({
        text: "Some error occured. Please try again !!",
        type: "error",
      });
      console.log(resData.message);
    }
  };
  const showMemberDetail = (memberID) => {
    console.log("Member ID: ", memberID);
    navigate(`/admin/member-detail/${memberID}`);
  };
  return (
    <>
      <Box component="div" sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          All Managers
        </Typography>
      </Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} mt={2} sx={{ maxWidth: "95.5vw" }}>
          <CustomDataGrid
            rows={membersArr}
            columns={columns}
            styles={{ height: "540px" }}
            pageSizes={[10, 25, 50]}
            onCellEditCommit={(params) => setRowId(params.id)}
            onRowClickHandle={(params) => showMemberDetail(params.id)}
          />
        </Grid2>

        <Snackbar
          open={snackbarState}
          autoHideDuration={3000}
          onClose={hideSnackbar}
        >
          <Alert
            onClose={hideSnackbar}
            severity={message.type}
            sx={{ width: "100%" }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      </Grid2>
    </>
  );
};

export default AllManagers;
