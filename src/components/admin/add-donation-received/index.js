import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Grid2 from "@mui/material/Unstable_Grid2/";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
// Assets
import AddDonationImage from "./../../../assets/images/add-image.jpg";
// Firebase
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../firebase";
import "./styles.css";

// Image Libraries

import FileUpload from "../../common/FileUpload";
import CompressAPI from "../../../api/compressImage/CompressAPI";
// Auto complete
import { ReactSearchAutocomplete } from "react-search-autocomplete";
// Alert Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const AddDonationReceived = ({
  donationDetail,
  membersArr,
  hideModal,
  handleSetDonation,
  action,
}) => {
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const mobileRef = useRef(null);
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let initDonationData = {
    member_id: "",
    name: "",
    address: "",
    district: "",
    state: "",
    contact_no: "",
    amount: "",
    description: "",
    images: [],
    method: "cash",
  };

  let initProImages = [];
  if (donationDetail !== undefined && donationDetail !== null) {
    console.log("Donation Detail: ", donationDetail);
    if (donationDetail.images !== undefined && donationDetail.images !== null) {
      initProImages = donationDetail.images;
    }
    initDonationData = donationDetail;
  }
  const [donationData, setDonationData] = useState(initDonationData);

  //if (action === "EDIT") {
  // initProImages = productContext.state.images;
  //}
  const [imageData, setImageData] = useState(initProImages);
  console.log("imageData:", imageData);
  const [progress, setProgress] = useState(0);
  const titleInputLimit = {
    minLength: 5,
    maxLength: 200,
  };

  // use effect errorMsg change

  useEffect(() => {
    if (errorMsg !== "") {
      setOpenErrorDialog(true);
    } else {
      setOpenErrorDialog(false);
    }
  }, [errorMsg]);

  //close open error dialog
  const handleCloseErrorDialog = () => {
    setErrorMsg("");
  };

  function handleFormData(formData) {
    setDonationData({ ...donationData, ...formData });
  }
  const handleAddDonationClick = () => {
    setErrorMsg("");
    if (nameRef.current.value.length < 3) {
      setErrorMsg("Name should be atleast 3 characters");
      nameRef.current.focus();
      return;
    }
    if (addressRef.current.value.length < 3) {
      setErrorMsg("Address should be atleast 3 characters");
      addressRef.current.focus();
      return;
    }
    if (cityRef.current.value.length < 3) {
      setErrorMsg("City should be atleast 3 characters");
      cityRef.current.focus();
      return;
    }
    if (stateRef.current.value.length < 2) {
      setErrorMsg("State should be atleast 2 characters");
      stateRef.current.focus();
      return;
    }
    if (mobileRef.current.value.length < 10) {
      setErrorMsg("Mobile should be atleast 10 characters");
      mobileRef.current.focus();
      return;
    }
    if (amountRef.current.value < 1) {
      setErrorMsg("Amount should be atleast 1 Rupees");
      amountRef.current.focus();
      return;
    }
    handleSetDonation(action, { ...donationData, images: imageData });
  };

  // Auto complete search box
  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    //console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    //console.log("Hover result:", result);
  };

  const handleOnSelect = (item) => {
    // the item selected
    console.log("Selected item:", item);
    setDonationData({
      ...donationData,
      member_id: item.unique_code,
      name: item.name,
      address: item.address,
      district: item.district,
      state: item.state,
      contact_no: item.contact_no,
    });
  };

  const handleOnFocus = () => {
    //console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>
          Code: {item.unique_code}
        </span>
        <span style={{ display: "block", textAlign: "left" }}>
          Name: {item.name}
        </span>
      </>
    );
  };
  return (
    // <>Hello</>
    <Grid2 container spacing={2}>
      {/* show error message */}
      {errorMsg !== "" && <Grid2 xs={12}>{errorMsg}</Grid2>}

      <Grid2 xs={12}>
        <ReactSearchAutocomplete
          items={membersArr}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          formatResult={formatResult}
          placeholder="Member code (if any)"
          resultStringKeyName="unique_code"
          fuseOptions={{
            minMatchCharLength: 2,
            keys: ["unique_code", "name", "contact_no"],
            threshold: 0.0,
          }}
          inputSearchString={donationData.member_id}
        />
      </Grid2>
      <Grid2 xs={6}>
        <TextField
          inputRef={nameRef}
          required
          fullWidth
          id="name"
          label="नाम"
          variant="standard"
          value={donationData.name}
          onChange={(e) => {
            handleFormData({ name: e.target.value });
          }}
          inputProps={titleInputLimit}
        />
      </Grid2>
      <Grid2 xs={6}>
        <TextField
          inputRef={mobileRef}
          required
          fullWidth
          id="contact_no"
          label="मोबाइल न."
          variant="standard"
          value={donationData.contact_no}
          onChange={(e) => {
            handleFormData({ contact_no: e.target.value });
          }}
          inputProps={titleInputLimit}
        />
      </Grid2>
      <Grid2 xs={12}>
        <TextField
          inputRef={addressRef}
          required
          fullWidth
          id="address"
          label="पता"
          variant="standard"
          value={donationData.address}
          onChange={(e) => {
            handleFormData({ address: e.target.value });
          }}
          inputProps={titleInputLimit}
        />
      </Grid2>
      <Grid2 xs={6}>
        <TextField
          inputRef={cityRef}
          required
          fullWidth
          id="district"
          label="जिला"
          variant="standard"
          value={donationData.district}
          onChange={(e) => {
            handleFormData({ district: e.target.value });
          }}
          inputProps={titleInputLimit}
        />
      </Grid2>
      <Grid2 xs={6}>
        <TextField
          inputRef={stateRef}
          required
          fullWidth
          id="state"
          label="राज्य"
          variant="standard"
          value={donationData.state}
          onChange={(e) => {
            handleFormData({ state: e.target.value });
          }}
          inputProps={titleInputLimit}
        />
      </Grid2>

      <Grid2 xs={12}>
        <TextField
          inputRef={amountRef}
          required
          fullWidth
          type="number"
          name="amount"
          id="amount"
          label="दान राशि"
          variant="standard"
          value={donationData.amount}
          onChange={(e) => handleFormData({ amount: Number(e.target.value) })}
        />
      </Grid2>
      <Grid2 xs={12}>
        <FormControl>
          {/* <FormLabel id="demo-controlled-radio-buttons-group">
            Payment Method
          </FormLabel> */}
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={donationData.method || "cash"}
            onChange={(e) => handleFormData({ method: e.target.value })}
          >
            <FormControlLabel value="cash" control={<Radio />} label="कैश" />
            <FormControlLabel
              value="online"
              control={<Radio />}
              label="ऑनलाइन"
            />
          </RadioGroup>
        </FormControl>
      </Grid2>

      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleAddDonationClick}
        fullWidth
        sx={{ marginTop: "15px" }}
        disabled={isUploading}
      >
        {isUploading
          ? "Uploading image"
          : action === "ADD"
          ? "दान राशि जोड़ें"
          : "दान राशि अप्डेट करें"}
      </Button>

      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={hideModal}
        fullWidth
        sx={{ marginTop: "15px" }}
      >
        रद्द करें
      </Button>

      <Dialog
        open={openErrorDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseErrorDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
};

export default AddDonationReceived;
