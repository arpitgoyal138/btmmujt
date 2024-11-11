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
import DonationsReceivedAPI from "../../../api/firebase/DonationsReceivedAPI";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { styles } from "./styles";
import MembersAPI from "../../../api/firebase/MembersAPI";
import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";
import AlertDialogSlide from "../../../components/common/Dialog/AlertDialogSlide";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AddDonationReceived from "../../../components/admin/add-donation-received";
// import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AllDonationsReceived = () => {
  const [donationsArr, setDonationsArr] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  const [totalAutoPaidAmount, setTotalAutoPaidAmount] = useState(0);
  const [membersArr, setMembersArr] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [showDonation, setShowDonation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDonationId, setDeleteDonationId] = useState("");
  const donationsReceivedAPI = new DonationsReceivedAPI();
  const membersAPI = new MembersAPI();
  // console.log("donationsArr: ", donationsArr);
  // Fetch all donations
  useEffect(() => {
    getAllDonations();
    fetchAutoPaidAmount();
    const allMembers = membersAPI.getMembers();
    allMembers.then((resData) => {
      // console.log("received allMembers:", resData);
      if (!resData) {
        return;
      }
      setMembersArr(resData.data);
      // console.log("Done fetching all members: ", resData.data);
    });
  }, []);

  const fetchAutoPaidAmount = () => {
    donationsReceivedAPI.getDonationAutoPaidAmount().then((resData) => {
      // console.log("res totalAutoPaidAmount:", resData.data.amount);
      if (resData.success) {
        setTotalAutoPaidAmount(resData.data.amount);
      }
    });
  };
  const getAllDonations = () => {
    const allDonations = donationsReceivedAPI.getDonations();
    allDonations.then((resData) => {
      // console.log("received donations:", resData);
      if (!resData) {
        return;
      }

      const sumOfCash = resData.data.reduce((total, donation) => {
        if (donation.method === "cash") {
          return total + donation.amount;
        }
        return total;
      }, 0);

      // console.log("sumOfCash: ", sumOfCash);
      setTotalCash(sumOfCash);
      const sumOfOnline = resData.data.reduce((total, donation) => {
        if (donation.method === "online") {
          return total + donation.amount;
        }
        return total;
      }, 0);
      // console.log("sumOfOnline: ", sumOfOnline);
      setTotalOnline(sumOfOnline);

      setDonationsArr(resData.data);
      // console.log("Done fetching all donations: ", resData.data);
    });
  };
  // For Add Donation Modal
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const showAddDonationModal = (action) => {
    setOpenDonationModal(true);
  };
  const hideAddDonationModal = () => {
    // console.log("close modal");
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
    const res = donationsReceivedAPI.deleteDonation(deleteDonationId);
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
      { field: "amount", headerName: "राशि (₹)", width: 120 },
      { field: "method", headerName: "प्राप्ति का तरीका", width: 120 },
      { field: "name", headerName: "नाम", width: 120 },
      { field: "address", headerName: "पता", width: 200 },
      { field: "district", headerName: "जिला", width: 120 },
      { field: "state", headerName: "राज्य", width: 80 },
      { field: "contact_no", headerName: "मोबाइल नo", width: 120 },
      {
        field: "createdAt",
        headerName: "दिनांक",
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
    // console.log("action:", action, ", handleSetDonation:", resData);
    let donationId = "D" + Date.now().toString().substring(0, 10);
    if (action !== "ADD") {
      donationId = resData.id;
    }
    const dataToSend = {
      payload: { ...resData, uid: donationId },
      id: donationId,
    };
    donationsReceivedAPI.setDonation(dataToSend).then((res) => {
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
    //console.log("Donation ID: ", donationID);
    const donationDetail = donationsArr.find((donation) => {
      return donation.id === donationID || donation.uid === donationID;
    });
    //console.log("Donation Detail: ", donationDetail);
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
          सभी प्राप्त हुए दान (₹{totalCash + totalOnline + totalAutoPaidAmount})
        </Typography>
      </Box>
      <Box component="div" sx={{ marginBottom: "1rem" }}>
        <Typography
          sx={{
            marginRight: "1rem",
            color: "darkorange",
          }}
          variant="h5"
          component="span"
        >
          कैश: ₹{totalCash}
        </Typography>
        <Typography
          sx={{
            marginLeft: "1rem",
            color: "darkgreen",
          }}
          variant="h5"
          component="span"
        >
          ऑनलाइन: ₹{totalOnline}
        </Typography>
        <Typography
          sx={{
            marginLeft: "1rem",
            color: "darkblue",
          }}
          variant="h5"
          component="span"
        >
          स्वतः भुगतान: ₹{totalAutoPaidAmount}
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
            प्राप्त हुई राशि जोड़ें
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
              <AddDonationReceived
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
            getRowClassName={(params) => `method-${params.row.method}`}
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
        cancelButtonDanger={true}
      />
    </>
  );
};

export default AllDonationsReceived;
