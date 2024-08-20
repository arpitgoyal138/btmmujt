/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import {
  Avatar,
  Box,
  Snackbar,
  Typography,
  Grid,
  Button,
  Modal,
  Fade,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CustomDataGrid from "../../../components/common/DataGrid/CustomDataGrid";
import DonationsAPI from "../../../api/firebase/DonationsAPI";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AddDonation from "../../../components/admin/add-donation";
import { styles } from "./styles";
import MembersAPI from "../../../api/firebase/MembersAPI";
import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";
import AlertDialogSlide from "../../../components/common/Dialog/AlertDialogSlide";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
// import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AllDonations = () => {
  const navigate = useNavigate();
  const [donationsArr, setDonationsArr] = useState([]);
  const [membersArr, setMembersArr] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [showDonation, setShowDonation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDonationId, setDeleteDonationId] = useState("");
  const donationsAPI = new DonationsAPI();
  const membersAPI = new MembersAPI();
  // Fetch all donations
  useEffect(() => {
    getAllDonations();
    const allMembers = membersAPI.getMembers();
    allMembers.then((resData) => {
      console.log("received allMembers:", resData);
      if (!resData) {
        return;
      }
      setMembersArr(resData.data);
      console.log("Done fetching all members: ", membersArr);
    });
  }, []);

  const getAllDonations = () => {
    const allDonations = donationsAPI.getDonations();
    allDonations.then((resData) => {
      console.log("received:", resData);
      if (!resData) {
        return;
      }
      setDonationsArr(resData.data);
      console.log("Done fetching all donations: ", donationsArr);
    });
  };
  // For Add Donation Modal
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const showAddDonationModal = (action) => {
    setOpenDonationModal(true);
  };
  const hideAddDonationModal = () => {
    console.log("close modal");
    setOpenDonationModal(false);
  };

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

  // For delete Alert
  const handleCloseDialog = () => {
    setDeleteDonationId("");
    setOpenDialog(false);
  };
  const handleAgreeDialog = () => {
    setOpenDialog(false);
    const res = donationsAPI.deleteDonation(deleteDonationId);
    res
      .then((resData) => {
        if (resData.success) {
          setMessage({
            text: "Donation deleted successfully !",
            type: "success",
          });
          showSnackbar();
          getAllDonations();
        }
      })
      .catch((ex) => {
        setMessage({
          text: "Some error occured. Please try again !!",
          type: "error",
        });
        console.log(ex);
      });
  };

  // For Delete Donation
  const handleDeleteDonation = (donation_id) => {
    setDeleteDonationId(donation_id);
    setOpenDialog(true);
  };
  //// Columns for Members DataGrid
  const columns = useMemo(
    () => [
      { field: "amount", headerName: "Amount (₹)", width: 120 },
      { field: "name", headerName: "Name", width: 120 },
      { field: "address", headerName: "Address", width: 200 },
      { field: "district", headerName: "District", width: 120 },
      { field: "state", headerName: "State", width: 80 },
      { field: "contact_no", headerName: "Mobile", width: 120 },
      {
        field: "createdAt",
        headerName: "Added at",
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
      // {
      //   field: "modifiedAt",
      //   headerName: "Updated at",
      //   width: 180,

      //   renderCell: (params) => {
      //     let t = "";
      //     if (params.row.modifiedAt === undefined) {
      //       return <div className="rowitem">-</div>;
      //     }
      //     if (typeof params.row.modifiedAt === "string") {
      //       t =
      //         new Date(params.row.modifiedAt).toLocaleDateString() +
      //         " " +
      //         new Date(params.row.modifiedAt).toLocaleTimeString();
      //     } else {
      //       t =
      //         new Date(
      //           params.row.modifiedAt.seconds * 1000 +
      //             params.row.modifiedAt.nanoseconds / 1000000
      //         ).toLocaleDateString() +
      //         " " +
      //         new Date(
      //           params.row.modifiedAt.seconds * 1000 +
      //             params.row.modifiedAt.nanoseconds / 1000000
      //         ).toLocaleTimeString();
      //     }
      //     return <div className="rowitem">{t}</div>;
      //   },
      // },
      { field: "id", width: 120 },
      // {field: "id", hide: true},
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        renderCell: (params) => (
          <DataGridActions
            {...{
              params,
              rowId,
              setRowId,
              itemName: "Donation",
            }}
            onDelete={handleDeleteDonation}
          />
        ),
      },
    ],
    [rowId]
  );

  /// Add Category to firebase
  const handleSetDonation = (action, resData) => {
    console.log("action:", action, ", handleSetDonation:", resData);
    let donationId = "D" + Date.now().toString().substring(0, 10);
    if (action !== "ADD") {
      donationId = resData.id;
    }
    const dataToSend = {
      payload: { ...resData, id: donationId },
      id: donationId,
    };
    donationsAPI.setDonation(dataToSend).then((res) => {
      if (res.success) {
        setMessage({
          text: `Donation ${
            action == "ADD" ? "Added" : "Updated"
          } successfully !`,
          type: "success",
        });
        showSnackbar();
        hideAddDonationModal();
        getAllDonations();
      } else {
        setMessage({
          text: "Some error occured. Please try again !!",
          type: "error",
        });
        showSnackbar();
        console.log(res.message);
      }
    });
  };
  const showDonationDetail = (donationID) => {
    console.log("Donation ID: ", donationID);
    const donationDetail = donationsArr.find((donation) => {
      return donation.id === donationID;
    });
    console.log("Donation Detail: ", donationDetail);
    setShowDonation(donationDetail);
    showAddDonationModal();
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
          All Donations
        </Typography>
      </Box>
      <Grid2 container spacing={2}>
        <Grid2>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setShowDonation(null);
              showAddDonationModal();
            }}
          >
            Add Donation
          </Button>
        </Grid2>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openDonationModal}
          onClose={hideAddDonationModal}
          closeAfterTransition
        >
          <Fade in={openDonationModal}>
            <Box sx={styles.boxStyle}>
              <AddDonation
                membersArr={membersArr}
                action={showDonation === null ? "ADD" : "EDIT"}
                handleSetDonation={handleSetDonation}
                hideModal={hideAddDonationModal}
                donationDetail={showDonation}
              />
            </Box>
          </Fade>
        </Modal>
        <Grid2 xs={12} mt={2} sx={{ maxWidth: "95.5vw" }}>
          <CustomDataGrid
            rows={donationsArr}
            columns={columns}
            styles={{ height: "540px" }}
            pageSizes={[10, 25, 50]}
            onCellEditCommit={(params) => setRowId(params.id)}
            onRowClickHandle={(params) => showDonationDetail(params.id)}
          />
        </Grid2>
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
      <AlertDialogSlide
        handleOnAgree={handleAgreeDialog}
        handleOnClose={handleCloseDialog}
        isOpen={openDialog}
        title="Remove Donation"
        description={"Sure to delete donation ?"}
      />
    </>
  );
};

export default AllDonations;
