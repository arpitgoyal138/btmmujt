import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
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
const AddDonationGiven = ({
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
  };

  let initProImages = [];
  if (donationDetail !== null) {
    initProImages = donationDetail.images;
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
  function handleImageChange(e) {
    setProgress(0);
    setIsUploading(true);
    const upImage = e.target.files[0];
    if (upImage) {
      // console.log("image:", upImage);
      // Compress Image and get BLOB
      const compressProps = {
        size: 2, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 900, // the max width of the output image, defaults to 1920px
        maxHeight: 900, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
        rotate: true, // Enables rotation, defaults to false
      };
      const imgCompressor = new CompressAPI();
      const req = imgCompressor.compressImage(upImage, compressProps);
      req
        .then((resData) => {
          console.log("Image resData:", resData);
          if (!resData.success) {
            setIsUploading(false);
            return;
          }
          const imgBlob = resData.data;
          //console.log("compressed img blob data:", imgBlob);
          // Set blob data to images state

          ///// Convert base64 to file /////////
          const fileName = "IMG_" + Date.now() + "_" + imgBlob.alt;
          const base64str = imgBlob.data;
          const imgExt = imgBlob.ext;
          setImageData((prevState) => {
            if (prevState) {
              return [
                ...prevState,
                { blob: { ...imgBlob }, name: fileName, url: "" },
              ];
            } else {
              return imgBlob;
            }
          });
          const reqData = imgCompressor.base64ToImage(base64str, imgExt);
          if (!reqData.success) {
            setIsUploading(false);
            return;
          }
          const file = reqData.data;
          handleFileUpload({
            path: "images/donations/",
            file,
            fileName,
          });
        })
        .catch((ex) => {
          setIsUploading(false);
          console.log("CompressImage Error:", ex);
        });
    }
  }
  const handleFileUpload = ({ path, file, fileName }) => {
    // console.log("path:", path, " file:", file);
    // fileName = fileName.replace(/[()]/g, "");
    const storageRef = ref(storage, `${path}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload is " + progress + "% done");
        setProgress(prog);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        setIsUploading(false);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized": // User doesn't have permission to access the object
            console.log("Upload Error: unauthorized access");
            alert("Upload Error: unauthorized access");
            break;
          case "storage/canceled": // User canceled the upload
            console.log("Upload Error: Upload is cancelled");
            alert("Upload Error: Upload is cancelled");
            break;
          case "storage/unknown": // Unknown error occurred, inspect error.serverResponse
            console.log("Upload Error: Unknown error occurred");
            alert("Upload Error: Unknown error occurred");
            break;
          default:
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            // Set url in imageData where name == fileName
            setImageData((prevState) => {
              return prevState.map((img) => {
                if (img.name === fileName) {
                  return { ...img, blob: null, url: downloadURL };
                } else {
                  return img;
                }
              });
            });

            setIsUploading(false);
          })
          .catch((ex) => {
            setIsUploading(false);
            alert("Error while fetching image url: ", ex);
          });
      }
    );
  };
  const handleDeleteFile = (index, fileName) => {
    console.log("delete file:", index, " name:", fileName);
    const tempImageData = [...imageData];
    tempImageData.splice(index, 1);
    setImageData(tempImageData);
    const fileRef = ref(storage, `images/donations/${fileName}`);
    // Delete the file
    deleteObject(fileRef)
      .then(() => {
        // File deleted successfully
        console.log("deleted successfully");
      })
      .catch((err) => {
        // Uh-oh, an error occurred!
        console.log("Error while deleting image: ", err);
      });
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
          label="Name"
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
          label="Mobile"
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
          label="Address"
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
          label="District"
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
          label="State"
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
          label="Amount"
          variant="standard"
          value={donationData.amount}
          onChange={(e) => handleFormData({ amount: Number(e.target.value) })}
        />
      </Grid2>
      <Grid2 xs={12}>
        {imageData.map((img, index) => {
          const bgImg =
            img.url !== undefined && img.url !== ""
              ? `url(${img.url})`
              : `url(${img.blob.prefix}${img.blob.data})`;
          // console.log("img.url:", img.url, "__ bg img:", bgImg);
          return (
            <label className="uploaded-product" key={index}>
              <Paper
                style={{
                  backgroundImage: bgImg,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Tooltip title="Delete">
                  <IconButton
                    className="action-button"
                    aria-label="delete"
                    onClick={() => {
                      if (window.confirm("Sure to delete?"))
                        handleDeleteFile(index, img.name);
                    }}
                  >
                    <DeleteIcon className="action-icons delete-icon" />
                  </IconButton>
                </Tooltip>
              </Paper>
            </label>
          );
        })}
        <FileUpload
          acceptFileType="image/*"
          handleChange={handleImageChange}
          bgImageSrc={AddDonationImage}
          upProgress={progress}
        />
      </Grid2>
      <Grid2 xs={12}>
        <p>Description</p>
        <CKEditor
          inputRef={descriptionRef}
          editor={ClassicEditor}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            editor.setData(donationData.description);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            handleFormData({ description: data });
          }}
        />
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
          ? "Add Donation"
          : "Update Donation"}
      </Button>

      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={hideModal}
        fullWidth
        sx={{ marginTop: "15px" }}
      >
        Cancel
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

export default AddDonationGiven;
