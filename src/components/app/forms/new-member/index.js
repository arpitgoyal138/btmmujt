import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { states } from "./IndianStates";
import MembersAPI from "./../../../../api/firebase/MembersAPI";
//Firebase
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../../../firebase";
// Image Libraries
import CompressAPI from "./../../../../api/compressImage/CompressAPI";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AuthAPI from "../../../../api/firebase/AuthAPI";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  getAuth,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import CheckoutButton from "../../../common/CheckoutButton/CheckoutButton";
import DonationsReceivedAPI from "../../../../api/firebase/DonationsReceivedAPI";
import {
  Box,
  Container,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import Loader from "../../../loader/Loader";
import StartMembership from "../../start-membership/StartMembership";

const NewMemberForm = ({ memberData = null }) => {
  const navigate = useNavigate();
  // auth.settings.appVerificationDisabledForTesting = true;
  const initMemberForm = {
    name: "",
    fathers_name: "",
    address: "",
    district: "",
    state: "",
    rtocode: "",
    pincode: "",
    contact_no: "",
    alternate_contact_no: "",
    latest_photo: {
      base64: "",
      type: "",
      url: "",
    },
    aadhaar_photo_front: {
      base64: "",
      type: "",
      url: "",
    },
    aadhaar_photo_back: {
      base64: "",
      type: "",
      url: "",
    },
    work_group: "",
    work_detail: "",
    uid: "",
    unique_code: "",
    post_name: "सदस्य",
  };
  const nameRef = useRef(null);
  const fathers_nameRef = useRef(null);
  const addressRef = useRef(null);
  const stateRef = useRef(null);
  const rtocodeRef = useRef(null);
  const pincodeRef = useRef(null);
  const districtRef = useRef(null);
  const contact_noRef = useRef(null);
  const alternate_contact_noRef = useRef(null);
  const aadhaar_photo_frontRef = useRef(null);
  const aadhaar_photo_backRef = useRef(null);
  const latest_photoRef = useRef(null);
  const thekedarRadioRef = useRef(null);
  const karigarRadioRef = useRef(null);
  const helperRadioRef = useRef(null);
  const othersRadioRef = useRef(null);
  const work_detailRef = useRef(null);
  const formCheckRef = useRef(null);
  const postNameRef = useRef(null);
  const otpRef = useRef(null);
  const submitBtnRef = useRef(null);
  const planAmountRef = useRef(null);
  const [memberForm, setMemberForm] = useState(initMemberForm);
  const [formChecked, setFormChecked] = useState(false);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [isUploadingSelf, setIsUploadingSelf] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [alertMsg, setAlertMsg] = useState({
    type: "",
    title: "",
    show: false,
  });
  const [open, setOpen] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [memberUniqueCode, setMemberUniqueCode] = useState("");
  const [buttonText, setButtonText] = useState("पुष्टि कोड भेजें");
  const [verifyButtonClicked, setVerifyButtonClicked] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [regUserId, setRegUserId] = useState(null);
  const PLAN_60_ID = process.env.REACT_APP_PLAN_60_ID;
  const PLAN_100_ID = process.env.REACT_APP_PLAN_100_ID;
  const PLAN_200_ID = process.env.REACT_APP_PLAN_200_ID;
  const PLAN_500_ID = process.env.REACT_APP_PLAN_500_ID;
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMsg({ type: "", title: "", show: false });
    setOpen(false);
  };

  useEffect(() => {
    console.log("UseEffect == > memberUniqueCode: ", memberUniqueCode);
  }, [memberUniqueCode]);

  // console.log("memberForm: ", memberForm);
  const membersAPI = new MembersAPI();
  useEffect(() => {
    if (memberForm.donate_amount < 60) {
      //console.log("here 60");
      setCurrentPlanId(PLAN_60_ID);
      // setMemberForm({ ...memberForm, donate_amount: 60 });
    }
  }, [memberForm]);

  useEffect(() => {
    if (memberData !== null) {
      setMemberForm({ ...memberData });
      populateFormValues(memberData);
    }
  }, [memberData]);
  useEffect(() => {
    if (!otpSent) {
      setOtpTimer(0);
      window.otpTimer = 0;
      return;
    }
    const intervalId = setInterval(() => {
      console.log(
        "OTPSent:",
        otpSent,
        "__OTP Timer:",
        otpTimer,
        " verifyButtonClicked:",
        verifyButtonClicked
      );
      if (otpTimer > 0) {
        console.log("here verifyButtonClicked: ", verifyButtonClicked);
        if (!verifyButtonClicked) {
          submitBtnRef.current.disabled = true;
          console.log("set button text: ");
          setButtonText("पुनः पुष्टि कोड भेजें (" + otpTimer + "s)");
        }

        setOtpTimer(otpTimer - 1);
        window.otpTimer = otpTimer - 1;
      } else {
        submitBtnRef.current.disabled = false;
        setSubmitButtonClicked(false);
        window.buttonClicked = false;
        setButtonText("पुष्टि कोड भेजें");
        clearInterval(intervalId);
        window.otpTimer = 0;
        window.otpSent = false;
      }
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [otpSent, otpTimer]);
  const clearForm = () => {
    thekedarRadioRef.current.checked = false;
    karigarRadioRef.current.checked = false;
    helperRadioRef.current.checked = false;
    othersRadioRef.current.checked = false;
    formCheckRef.current.checked = false;
    setFormChecked(false);
    setMemberForm({ ...initMemberForm });
    setImageData([]);
    setProgress(0);
    setSubmitButtonClicked(false);
    window.buttonClicked = false;
    setOtpTimer(0);
    setOtpSent(false);
    window.otpSent = false;
    window.otpTimer = 0;
    setButtonText("पुष्टि कोड भेजें");
    // set all reference value to empty
    nameRef.current.value = "";
    fathers_nameRef.current.value = "";
    addressRef.current.value = "";
    stateRef.current.value = "";
    rtocodeRef.current.value = "";
    pincodeRef.current.value = "";
    districtRef.current.value = "";
    contact_noRef.current.value = "";
    alternate_contact_noRef.current.value = "";
    aadhaar_photo_frontRef.current.value = "";
    aadhaar_photo_backRef.current.value = "";
    latest_photoRef.current.value = "";
    work_detailRef.current.value = "";
    if (postNameRef.current !== null) {
      postNameRef.current.value = "";
    }
  };
  const populateFormValues = (data) => {
    // console.log("populate form with data:", data);
    thekedarRadioRef.current.checked = data.work_group === "Thekedar";
    karigarRadioRef.current.checked = data.work_group === "Karigar";
    helperRadioRef.current.checked = data.work_group === "Helper";
    othersRadioRef.current.checked = data.work_group === "Others";
    work_detailRef.current.value = "";
    if (data.work_group === "Others") {
      work_detailRef.current.value = data.work_detail;
    }
    setFormChecked(false);
    setSubmitButtonClicked(false);
    window.buttonClicked = false;
    setImageData([]);
    setProgress(0);
    console.log("2. set unique code:", data.unique_code);

    setMemberUniqueCode(data.unique_code);
    // set all reference value to empty
    nameRef.current.value = data.name;
    fathers_nameRef.current.value = data.fathers_name;
    addressRef.current.value = data.address;
    stateRef.current.value = data.state;
    rtocodeRef.current.value = data.rtocode ? data.rtocode : "";
    pincodeRef.current.value = data.pincode ? data.pincode : "";
    districtRef.current.value = data.district;
    contact_noRef.current.value = data.contact_no;
    alternate_contact_noRef.current.value = data.alternate_contact_no;
    postNameRef.current.value = data.post_name ? data.post_name : "";
  };
  const validate = () => {
    console.log("validate form:", memberForm);
    // validate form
    if (memberForm.name.length < 3) {
      const alertOptions = {
        type: "warning",
        title: "नाम न्यूनतम 3 अक्षरों का होना अनिवार्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      nameRef.current.focus();
      return false;
    } else if (memberForm.fathers_name.length < 3) {
      const alertOptions = {
        type: "warning",
        title: "पिता का नाम न्यूनतम 3 अक्षरों का होना अनिवार्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      fathers_nameRef.current.focus();
      return false;
    } else if (memberForm.address.length < 3) {
      const alertOptions = {
        type: "warning",
        title: "स्थायी पता न्यूनतम 3 अक्षरों का होना अनिवार्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      addressRef.current.focus();
      return false;
    } else if (memberForm.rtocode.length > 0 && memberForm.rtocode.length < 3) {
      const alertOptions = {
        type: "warning",
        title: "R.T.O. कोड 4 अक्षरों का होना अनिवार्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      rtocodeRef.current.focus();
      return false;
    } else if (memberForm.pincode.length > 0 && memberForm.pincode.length < 6) {
      const alertOptions = {
        type: "warning",
        title: "पिनकोड 6 अक्षरों का होना अनिवार्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      pincodeRef.current.focus();
      return false;
    } else if (memberForm.aadhaar_photo_front.url === "") {
      const alertOptions = {
        type: "warning",
        title: "आधार कार्ड की सामने की फोटो संलग्न करना अनिवार्य है ",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      aadhaar_photo_frontRef.current.focus();
      return false;
    } else if (memberForm.contact_no.length !== 10) {
      const alertOptions = {
        type: "warning",
        title: "व्हाट्सप्प मोबाइल नंबर 10 अक्षरों का होना अनिवार्य है ",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      contact_noRef.current.focus();
      return false;
    } else if (memberForm.aadhaar_photo_back.url === "") {
      const alertOptions = {
        type: "warning",
        title: "आधार कार्ड की पीछे की फोटो संलग्न करना अनिवार्य है ",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      aadhaar_photo_backRef.current.focus();
      return false;
    }
    // else if (memberForm.latest_photo.url === "") {
    // alert("कृप्या अपनी हाल ही की फोटो संलग्न करें");
    // latest_photoRef.current.focus();
    // return false;
    // }
    else if (memberForm.work_group === "") {
      const alertOptions = {
        type: "warning",
        title: "कृप्या अपने कार्यक्षेत्र का चयन करें",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      return false;
    } else if (
      memberForm.work_group === "Others" &&
      memberForm.work_detail.length < 3
    ) {
      const alertOptions = {
        type: "warning",
        title: "कृप्या अपने कार्य के विषय में जानकारी दें ",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      work_detailRef.current.focus();
      return false;
    } else return true;
  };
  function handleImageChange(e, imgFor) {
    if (imgFor === "front") {
      setIsUploadingFront(true);
    } else if (imgFor === "back") {
      setIsUploadingBack(true);
    } else if (imgFor === "self") {
      setIsUploadingSelf(true);
    }
    setProgress(0);
    const upImage = e.target.files[0];
    console.log("upImage:", upImage);
    if (upImage) {
      // console.log("image:", upImage);
      // Compress Image and get BLOB
      const compressProps = {
        size: 5, // the max size in MB, defaults to 2MB
        quality: 0.8, // the quality of the image, max is 1,
        maxWidth: 900, // the max width of the output image, defaults to 1920px
        maxHeight: 900, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      };
      const imgCompressor = new CompressAPI();
      const req = imgCompressor.compressImage(upImage, compressProps);
      req
        .then((resData) => {
          if (!resData.success) {
            return;
          }
          const imgBlob = resData.data;

          // console.log("compressed img blob data:", imgBlob);
          // Set blob data to images state
          setImageData((prevState) => {
            if (prevState) {
              return [...prevState, imgBlob];
            } else {
              return imgBlob;
            }
          });

          ///// Convert base64 to file /////////
          const fileName = imgBlob.alt;
          const base64str = imgBlob.data;
          const imgExt = imgBlob.ext;
          console.log("img ext:", imgExt);
          const reqData = imgCompressor.base64ToImage(base64str, imgExt);
          if (!reqData.success) {
            return;
          }
          const file = reqData.data;
          // console.log("base64ToImage Res:", file);
          handleFileUpload({
            path: "images/aadhaar/",
            file,
            fileName,
            imgFor: imgFor,
            base64str: base64str,
            imgExt: imgExt,
          });
        })
        .catch((ex) => {
          console.log("CompressImage Error:", ex);
        });
    }
  }
  const handleFileUpload = ({
    path,
    file,
    fileName,
    imgFor,
    base64str,
    imgExt,
  }) => {
    // console.log("path:", path, " file:", file);
    fileName = fileName.replace(/[()]/g, "");
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
        if (imgFor === "front") {
          setIsUploadingFront(false);
        } else if (imgFor === "back") {
          setIsUploadingBack(false);
        } else if (imgFor === "self") {
          setIsUploadingSelf(false);
        }
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized": // User doesn't have permission to access the object
            console.log("Upload Error: unauthorized access");
            alert("Upload Error: unauthorized access");
            break;
          case "storage/canceled": // User canceled the upload
            console.log("Upload Error: Upload is canceled");
            alert("Upload Error: Upload is canceled");
            break;
          case "storage/unknown": // Unknown error occurred, inspect error.serverResponse
            console.log("Upload Error:Unknown error occurred");
            alert("Upload Error:Unknown error occurred");
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
            const imgObject = {
              base64: base64str,
              type: imgExt,
              url: downloadURL,
            };
            if (imgFor === "front") {
              setIsUploadingFront(false);
              setMemberForm({
                ...memberForm,
                aadhaar_photo_front: imgObject,
              });
            } else if (imgFor === "back") {
              setIsUploadingBack(false);
              setMemberForm({
                ...memberForm,
                aadhaar_photo_back: imgObject,
              });
            } else if (imgFor === "self") {
              setIsUploadingSelf(false);
              setMemberForm({
                ...memberForm,
                latest_photo: imgObject,
              });
            }
          })
          .catch((ex) => {
            if (imgFor === "front") {
              setIsUploadingFront(false);
            } else if (imgFor === "back") {
              setIsUploadingBack(false);
            } else if (imgFor === "self") {
              setIsUploadingSelf(false);
            }
            alert("Error while getting image url");
          });
      }
    );
  };
  // const handleDeleteFile = (index, fileName) => {
  //   console.log("delete file:", index, " name:", fileName);
  //   const tempImageData = [...imageData];
  //   tempImageData.splice(index, 1);
  //   setImageData(tempImageData);
  //   const fileRef = ref(storage, `images/categories/${fileName}`);
  //   // Delete the file
  //   deleteObject(fileRef)
  //     .then(() => {
  //       // File deleted successfully
  //       console.log("deleted successfully");
  //       // const updatedURLs = categoryContext.state.images.filter(
  //       //   (state) => state.name !== fileName
  //       // );
  //       // categoryContext.setState({
  //       //   ...categoryContext.state,
  //       //   images: updatedURLs,
  //       // });
  //     })
  //     .catch((err) => {
  //       // Uh-oh, an error occurred!
  //       console.log("delete err:", err.message);
  //     });
  // };
  const submitForm = () => {
    if ((otpSent && otpTimer !== 0) || window.buttonClicked) {
      return;
    }
    if (validate()) {
      setLoading(true);
      window.buttonClicked = true;
      setButtonText("पुष्टि कोड भेजा जा रहा है...");
      submitBtnRef.current.disabled = true;
      setSubmitButtonClicked(true);

      // get total no. of members
      membersAPI
        .getMembers()
        .then((rcv_data) => {
          const maxChars = 7;
          let latestSerialNo = 0;
          const allMembers = rcv_data.data;
          let totMembers = allMembers.length;
          console.log("rcv_data:", allMembers);
          if (totMembers > 0) {
            // check if member mobile no. already exists
            const memberExists = allMembers.some(function (member) {
              return member.contact_no === memberForm.contact_no;
            });
            if (memberExists) {
              window.buttonClicked = false;
              setSubmitButtonClicked(false);
              const alertOptions = {
                type: "warning",
                title:
                  "इस व्हाट्सप्प मोबाइल नंबर से कोई और सदस्य पहले ही पंजीकृत हो चुका है| \nकृप्या किसी अन्य मोबाइल नंबर से प्रयास करें| ",
                show: true,
              };
              setAlertMsg({ ...alertOptions });
              console.log("Member Already Exists!");
              setLoading(false);

              setButtonText("पुष्टि कोड भेजें");

              return;
            }
            latestSerialNo = Number(
              allMembers[0].unique_code.split("-")[1].replace(/X/g, "")
            );
          }

          console.log("latest serial no.:", latestSerialNo);

          // generate serial no.
          let serialNo = (latestSerialNo + 1).toString();

          console.log("serial No :", serialNo);
          let uniqueCode = "";
          if (memberForm.rtocode.length === 4) {
            uniqueCode =
              memberForm.rtocode
                .toUpperCase()
                .trim()
                .replace(/[&\\#, +()$~%.'":*?<>{}-]/g, "") + "-";
          } else if (memberForm.pincode.length === 6) {
            uniqueCode =
              memberForm.pincode
                .toUpperCase()
                .trim()
                .replace(/[&\\#, +()$~%.'":*?<>{}-]/g, "") + "-";
          }

          // uniqueCode will have 7 characters having last characters as serial number and all other characters marked as X. please generate code for this
          for (let i = 0; i < maxChars - serialNo.length; i++) {
            uniqueCode += "X";
          }
          uniqueCode += serialNo;
          console.log("unique Code here:", uniqueCode);
          const codeExists = rcv_data.data.some(function (member) {
            return member.unique_code === uniqueCode;
          });
          if (codeExists) {
            setLoading(false);
            console.log("Code Already Exists!");
            window.buttonClicked = false;
            setSubmitButtonClicked(false);
            const alertOptions = {
              type: "danger",
              title: "Registration failed (Code Already Exists)",
              show: true,
            };
            setAlertMsg({ ...alertOptions });
            setButtonText("पुष्टि कोड भेजें");
            return;
          }
          console.log("1. set unique code:", uniqueCode);
          setMemberUniqueCode(uniqueCode);
          setMemberForm({ ...memberForm, unique_code: uniqueCode });
          // Enter form data in firebase
          // पुष्टि कोड भेजें
          onSendOTP();
        })
        .catch((err) => {
          setLoading(false);

          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          console.log("error while getMembers() API");
          const alertOptions = {
            type: "danger",
            title: "Registration failed ERROR:getMemebersAPI",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          setButtonText("पुष्टि कोड भेजें");
        });
    } else {
      setLoading(false);

      console.log("incorrect input");
      setButtonText("पुष्टि कोड भेजें");
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
    }
  };
  const updateForm = () => {
    if ((otpSent && otpTimer !== 0) || window.buttonClicked) {
      return;
    }
    if (validate()) {
      window.buttonClicked = true;
      setSubmitButtonClicked(true);
      setButtonText("पुष्टि कोड भेजा जा रहा है...");
      onSendOTP();
    } else {
      console.log("incorrect input");
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
      setButtonText("पुष्टि कोड भेजें");
    }
  };
  const formValuesIntoDB = (user = null) => {
    if (memberData !== null) {
      // Update values from Admin Panel
      const dataToSendForUpdation = {
        payload: { ...memberForm },
        id:
          memberData.uid !== undefined
            ? memberData.uid
            : memberData.unique_code,
      };
      membersAPI
        .setMember(dataToSendForUpdation, true)
        .then((res) => {
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setVerifyButtonClicked(false);
          if (res.success) {
            clearForm();
            setFormChecked(false);

            // Success
            const alertOptions = {
              type: "success",
              title: "पंजीकरण सफलतापूर्वक हो गया है|",
              show: true,
            };
            formCheckRef.current.checked = false;
            setAlertMsg({ ...alertOptions });
            handleClick();
            // alert("registered with id: " + uniqueCode);
          } else {
            // Failure
            const alertOptions = {
              type: "danger",
              title: "Updation failed: ErrorResponseFalse",
              show: true,
            };
            setAlertMsg({ ...alertOptions });
          }
        })
        .catch((err) => {
          // Error
          // Failure
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setVerifyButtonClicked(false);
          const alertOptions = {
            type: "warning",
            title: "Updation failed: Exception " + err,
            show: true,
          };
          setAlertMsg({ ...alertOptions });
        });
    } else {
      // Insert Values from Home page
      const dataToSend = {
        payload: {
          ...memberForm,
          unique_code: memberUniqueCode,
          uid: user !== null ? user.uid : memberUniqueCode,
          role: ["Member"],
        },
        id: user !== null ? user.uid : memberUniqueCode,
      };
      console.log("data to send here:", dataToSend);
      membersAPI
        .setMember(dataToSend)
        .then((res) => {
          console.log("res:", res);
          window.buttonClicked = false;
          //setSubmitButtonClicked(false);
          //setVerifyButtonClicked(false);
          if (res.success) {
            //clearForm();
            setOtpSent(false);
            setRegDone(true);
            // Success
            //सफलतापूर्वक
            const alertOptions = {
              type: "success",
              title:
                "आपकी जानकारी सुरक्षित कर ली गयी है |\n कृप्या अपना सदस्य कोड " +
                memberUniqueCode +
                " नोट कर लें एवं ट्रस्ट की सदस्यता ग्रहण करने के लिए कृप्या दान राशि का भुकतान करें|",
              show: true,
            };
            setAlertMsg({ ...alertOptions });
            // alert("registered with id: " + memberUniqueCode);
          } else {
            // Failure
            console.log("Error while setMember() API ResponseFailed");
            window.buttonClicked = false;
            setSubmitButtonClicked(false);
            setVerifyButtonClicked(false);
            const alertOptions = {
              type: "danger",
              title: "Registration failed",
              show: true,
            };
            setAlertMsg({ ...alertOptions });
          }
        })
        .catch((err) => {
          // Error
          // Failure
          console.log("Exception while setMember() API:", err);
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setVerifyButtonClicked(false);
          const alertOptions = {
            type: "danger",
            title: "Registration failed",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
        });
    }
  };
  async function handleSignIn() {
    try {
      setLoading(false);

      const WindowOtpSent = window.otpSent;
      const WindowOtpTimer = window.otpTimer;
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+91" + memberForm.contact_no;
      console.log(
        "Handle Sign in with OTP with verifier:",
        appVerifier,
        " WindowOtpSent:",
        WindowOtpSent,
        " WindowOtpTimer:",
        WindowOtpTimer
      );
      if (WindowOtpSent && WindowOtpTimer !== 0) {
        return;
      }

      const auth = getAuth();
      // const confirmationResult = await signInWithPhoneNumber(
      //   auth,
      //   phoneNumber,
      //   appVerifier
      // );
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setOtpSent(true);
          setOtpTimer(60);
          window.otpSent = true;
          window.otpTimer = 60;
          // ...
        })
        .catch((error) => {
          setLoading(false);

          // Error; SMS not sent
          // window.recaptchaVerifier.render().then(function (widgetId) {
          //   grecaptcha.reset(widgetId);
          // });
          const alertOptions = {
            type: "danger",
            title: "कुछ समय पश्चात प्रयास करें ",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          setOtpSent(false);
          window.otpSent = false;
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setButtonText("पुष्टि कोड भेजें");
          // ...
        });
      console.log("confirmationResult:", window.confirmationResult);

      // setOtpSent(true);
      // setOtpTimer(60);
    } catch (error) {
      setLoading(false);

      console.error("Error sending OTP:", error);
      const alertOptions = {
        type: "danger",
        title: "कुछ समय पश्चात प्रयास करें",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setOtpSent(false);
      window.otpSent = false;
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
      setButtonText("पुष्टि कोड भेजें");
    }
  }
  const onSendOTP = async () => {
    try {
      console.log("OTP भेजें");
      submitBtnRef.current.disabled = true;
      // const appVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      //   size: "invisible",
      //   callback: (response) => {
      //     console.log("response:", response);
      //     handleSignIn(appVerifier);
      //   },
      // });
      // appVerifier.verify();
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          setLoading(false);

          submitBtnRef.current.disabled = true;
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("response:", response);
          if (window.otpSent && window.otpTimer !== 0) {
            return;
          }
          handleSignIn();
        },
      });
      window.recaptchaVerifier.verify();
    } catch (err) {
      setLoading(false);

      console.log("err:", err);
      const alertOptions = {
        type: "warning",
        title: "पुष्टि कोड भेजने में विफल",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setOtpSent(false);
      window.otpSent = false;
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
      setOtpTimer(0);
      setButtonText("पुष्टि कोड भेजें");
    }
  };
  const verifyOTP = async () => {
    try {
      setLoading(true);

      setVerifyButtonClicked(true);
      console.log("पुष्टि करें");

      window.confirmationResult
        .confirm(otpRef.current.value)
        .then((result) => {
          setLoading(false);

          // User signed in successfully.
          const user = result.user;
          console.log("userCredential for new member:", user);
          setRegUserId(user.uid);
          setMemberForm({ ...memberForm, uid: user.uid });
          setOtpSent(false);
          window.otpSent = false;
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setOtpTimer(0);
          // Submit Form Details
          formValuesIntoDB(user);
          // ...
        })
        .catch((error) => {
          setLoading(false);

          // User couldn't sign in (bad verification code?)
          console.log("Invalid OTP:", error);
          const alertOptions = {
            type: "warning",
            title: "पुष्टि कोड अमान्य है",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          setVerifyButtonClicked(false);
          // ...
        });

      //Clear form values
    } catch (err) {
      setLoading(false);

      console.log("err:", err);
      const alertOptions = {
        type: "warning",
        title: "पुष्टि कोड अमान्य है",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setVerifyButtonClicked(false);
      // Invalid OTP
    }
  };
  const handleCreateOrder = (props) => {
    console.log("handleCreateOrder:", props);
    const { success, subscription } = props;
    if (!success) {
      console.log("Failed to create order:", props);
      setLoading(false);
      return;
    }
    setCurrentPayment(subscription);
    console.log("subscriptionData:", subscription);
  };
  const handlePaymentUpdate = (props) => {
    setLoading(true);
    console.log(
      "handlePaymentUpdate props:",
      props,
      "__currentPayment:",
      currentPayment,
      "__member:",
      memberForm
    );
    //return;
    const { success, response } = props;
    if (success) {
      // sendMail();
      // Payment Completed
      const payment_id = response.razorpay_payment_id;
      const subscription_id = response.razorpay_subscription_id;
      const dataForDonationReceivedTable = {
        payload: {
          uid: regUserId,
          member_unique_code: memberUniqueCode,
          name: memberForm.name,
          contact_no: memberForm.contact_no,
          method: "online",
          status: "Completed",
          payment_id: payment_id,
          plan_id: currentPayment.plan_id,
          subscription_id: subscription_id,
          amount: currentPayment.amount,
        },
        id: payment_id,
      };
      const donationsReceivedAPI = new DonationsReceivedAPI();
      donationsReceivedAPI
        .setDonation(dataForDonationReceivedTable)
        .then((resPayment) => {
          console.log("RES resPayment:", resPayment);

          const dataForMembersTable = {
            id: regUserId !== null ? regUserId : memberUniqueCode,
            payload: {
              payment: {
                ...currentPayment,
                plan_amount: memberForm.donate_amount,
                payment_id: payment_id,
                status: "Completed",
              },
            },
          };
          // console.log("dataForUsersTable:", dataForUsersTable);
          membersAPI
            .setMember(dataForMembersTable)
            .then((res) => {
              console.log("RES from user data update:", res);
              if (res.success) {
                //alert("Payment Successfull");
                // navigate to order placed page
                navigate("/thank-you");
                setLoading(false);
              } else {
                setLoading(false);
                setSubmitButtonClicked(false);
                setVerifyButtonClicked(false);
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log("err:", err);
            });
        });
    } else {
      // Payment failed
      console.log("Payment Failed");
      setLoading(false);
    }
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          console.log("Submit Form:");
          e.preventDefault();
          if (memberData !== null) {
            updateForm();
          } else {
            submitForm();
          }
        }}
      >
        <div className="row">
          <div className="col-sm-6 mb-2">
            <label htmlFor="name" className="form-label">
              नाम *
            </label>
            <input
              ref={nameRef}
              type="text"
              className="form-control"
              id="name"
              aria-describedby="name"
              required
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  name: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
          <div className="col-sm-6 mb-2">
            <label htmlFor="father_name" className="form-label">
              पिता का नाम *
            </label>
            <input
              ref={fathers_nameRef}
              type="text"
              className="form-control"
              id="father_name"
              aria-describedby="name"
              required
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  fathers_name: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-12 col-sm-6 mb-2">
            <label htmlFor="address" className="form-label">
              स्थायी पता व ग्राम *
            </label>
            <input
              ref={addressRef}
              type="text"
              className="form-control"
              id="address"
              aria-describedby="name"
              required
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  address: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
          <div className="col-12 col-sm-6 d-flex">
            <div className="col-5 mb-2">
              <label htmlFor="rtocode" className="form-label">
                RTO कोड
              </label>
              <input
                ref={rtocodeRef}
                type="text"
                className="form-control text-uppercase"
                id="rtocode"
                aria-describedby="rtocode"
                maxLength={4}
                onKeyDown={(e) => {
                  // allow only alphanumeric characters
                  if (!/^[a-zA-Z0-9]*$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setMemberForm({
                    ...memberForm,
                    rtocode: e.target.value,
                  });
                }}
                readOnly={submitButtonClicked}
              />
            </div>
            <div className="col-2 align-content-end mb-2 mb-3 text-center">
              <label>या</label>
            </div>
            <div className="col-5 mb-2">
              <label htmlFor="pincode" className="form-label">
                पिनकोड
              </label>
              <input
                ref={pincodeRef}
                type="text"
                className="form-control"
                id="pincode"
                aria-describedby="pincode"
                maxLength={6}
                onKeyDown={(e) => {
                  // allow only numeric characters, backspace, delete, arrow keys
                  if (
                    !/^[0-9]*$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setMemberForm({
                    ...memberForm,
                    pincode: e.target.value,
                  });
                }}
                readOnly={submitButtonClicked}
              />
            </div>
          </div>

          <div className="col-sm-6 mb-2">
            <label htmlFor="district" className="form-label">
              जिला *
            </label>
            <input
              ref={districtRef}
              type="text"
              className="form-control"
              id="district"
              aria-describedby="name"
              required
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  district: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
          <div className="col-sm-6 mb-2">
            <label htmlFor="state" className="form-label">
              राज्य *
            </label>

            <select
              id="state"
              ref={stateRef}
              className="form-select"
              aria-label="Select State"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  state: e.target.value,
                });
              }}
              defaultValue=""
              required
              readOnly={submitButtonClicked}
            >
              <option value="">अपना राज्य चुनें</option>
              {states.map((state, index) => {
                return (
                  <option key={index} value={state.code}>
                    {state.hindiName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-6 mb-2">
            <label htmlFor="mobile" className="form-label">
              व्हाट्सप्प मोबाइल नंबर
            </label>
            <input
              required
              ref={contact_noRef}
              type="text"
              className="form-control"
              id="mobile"
              aria-describedby="name"
              maxLength={10}
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  contact_no: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
          <div className="col-sm-6 mb-2">
            <label htmlFor="mobile2" className="form-label">
              अन्य मोबाइल नंबर
            </label>
            <input
              ref={alternate_contact_noRef}
              type="text"
              className="form-control"
              id="mobile2"
              aria-describedby="name"
              maxLength={10}
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  alternate_contact_no: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-6 mb-2">
            <label htmlFor="aadhaar_front" className="form-label">
              आधार कार्ड की फोटो (सामने) *
            </label>
            <input
              ref={aadhaar_photo_frontRef}
              className="form-control"
              type="file"
              accept="image/*"
              id="aadhaar_front"
              onChange={(e) => handleImageChange(e, "front")}
              readOnly={submitButtonClicked}
            />
          </div>

          <div className="col-sm-6 mb-2">
            <label htmlFor="aadhaar_back" className="form-label">
              आधार कार्ड की फोटो (पीछे) *
            </label>
            <input
              ref={aadhaar_photo_backRef}
              className="form-control"
              type="file"
              accept="image/*"
              id="aadhaar_back"
              onChange={(e) => handleImageChange(e, "back")}
              readOnly={submitButtonClicked}
            />
          </div>
        </div>
        <div className="row justify-content-around">
          {isUploadingFront && (
            <div className="col upload-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div
            className={`col uploaded-image-box ${
              memberForm.aadhaar_photo_front.url !== "" && !isUploadingFront
                ? "show"
                : ""
            }`}
            style={{
              backgroundImage: `url("${memberForm.aadhaar_photo_front.url}")`,
            }}
          ></div>
          {isUploadingBack && (
            <div className="col uploaded-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div
            className={`col uploaded-image-box ${
              memberForm.aadhaar_photo_back.url !== "" && !isUploadingBack
                ? "show"
                : ""
            }`}
            style={{
              backgroundImage: `url("${memberForm.aadhaar_photo_back.url}")`,
            }}
          ></div>
        </div>
        <div className="row mb-3">
          <div className="col-12 mb-2">
            <label htmlFor="latest_photo" className="form-label">
              अपनी नवीनतम फोटो
            </label>
            <input
              ref={latest_photoRef}
              className="form-control"
              type="file"
              id="latest_photo"
              onChange={(e) => handleImageChange(e, "self")}
              accept="image/*"
              readOnly={submitButtonClicked}
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-around">
          {isUploadingSelf && (
            <div className="col upload-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div
            className={`col uploaded-image-box ${
              memberForm.latest_photo.url !== "" && !isUploadingSelf
                ? "show"
                : ""
            }`}
            style={{ backgroundImage: `url("${memberForm.latest_photo.url}")` }}
          ></div>
        </div>
        <div className="row">
          <div className="col-12">
            <label className="form-label">कार्यक्षेत्र *</label>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-3 text-center">
            <input
              ref={thekedarRadioRef}
              type="radio"
              className="btn-check"
              id="thekedar"
              autoComplete="off"
              name="options"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  work_group: "Thekedar",
                  work_detail: "",
                });
              }}
              readOnly={submitButtonClicked}
            />
            <label
              className="btn btn-outline-primary p-3 btn-work"
              htmlFor="thekedar"
            >
              ठेकेदार
            </label>
          </div>
          <div className="col-3 text-center">
            <input
              ref={karigarRadioRef}
              type="radio"
              className="btn-check"
              id="karigar"
              autoComplete="off"
              name="options"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  work_group: "Karigar",
                  work_detail: "",
                });
              }}
              readOnly={submitButtonClicked}
            />
            <label
              className="btn btn-outline-primary p-3 btn-work"
              htmlFor="karigar"
            >
              कारीगर
            </label>
          </div>
          <div className="col-3 text-center">
            <input
              ref={helperRadioRef}
              type="radio"
              className="btn-check"
              id="helper"
              autoComplete="off"
              name="options"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  work_group: "Helper",
                  work_detail: "",
                });
              }}
              readOnly={submitButtonClicked}
            />
            <label
              className="btn btn-outline-primary p-3 btn-work"
              htmlFor="helper"
            >
              हेल्पर
            </label>
          </div>
          <div className="col-3 text-center">
            <input
              ref={othersRadioRef}
              type="radio"
              className="btn-check"
              id="other"
              autoComplete="off"
              name="options"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  work_group: "Others",
                });
              }}
              readOnly={submitButtonClicked}
            />
            <label
              className="btn btn-outline-primary p-3 btn-work"
              htmlFor="other"
            >
              अन्य
            </label>
          </div>
        </div>
        <div className="row mb-3">
          <div
            className={`col-12 mt-2 mb-2 input-container ${
              memberForm.work_group === "Others" ? "show" : ""
            }`}
          >
            <label htmlFor="other_work" className="form-label">
              कार्य की व्याख्या करें
            </label>
            <input
              ref={work_detailRef}
              type="text"
              className="form-control mb-2"
              id="other_work"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  work_detail: e.target.value,
                });
              }}
              readOnly={submitButtonClicked}
            />
          </div>
        </div>
        {memberData !== null && (
          <div className="col-sm-6 mb-3">
            <label htmlFor="name" className="form-label">
              पद का नाम
            </label>
            <input
              ref={postNameRef}
              type="text"
              className="form-control"
              id="post_name"
              aria-describedby="post_name"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  post_name: e.target.value,
                });
              }}
            />
          </div>
        )}
        <div className="mb-3 form-check">
          <input
            ref={formCheckRef}
            type="checkbox"
            className="form-check-input"
            id="checkbox"
            onChange={(e) => {
              setFormChecked(e.target.checked);
            }}
            readOnly={submitButtonClicked}
          />
          <label className="form-check-label" htmlFor="checkbox">
            मैं पुष्टि करता हूं कि उपरोक्त कथन सभी प्रकार से सत्य हैं
          </label>
        </div>
        {memberData === null && !regDone && (
          <>
            <button
              ref={submitBtnRef}
              type="submit"
              className="btn btn-success col-12 mx-auto"
              id="sign-in-button"
              disabled={
                !formChecked ||
                submitButtonClicked ||
                (formChecked && submitButtonClicked && !otpSent) ||
                (otpSent && otpTimer !== 0) ||
                window.buttonClicked
                  ? true
                  : false
              }
            >
              {buttonText}
            </button>
          </>
        )}

        {memberData !== null && (
          <button
            ref={submitBtnRef}
            type="submit"
            className="btn btn-primary col-12 mx-auto"
            id="sign-in-button"
            disabled={
              !formChecked ||
              submitButtonClicked ||
              (formChecked && submitButtonClicked && !otpSent) ||
              (otpSent && otpTimer !== 0) ||
              window.buttonClicked
                ? true
                : false
            }
          >
            {buttonText}
          </button>
        )}
        {otpSent && (
          <>
            <p className="small mb-2 mt-2 text-center">
              {"+91 " + memberForm.contact_no} नंबर पर पुष्टि कोड भेजा गया है{" "}
            </p>
            <input
              type="text"
              ref={otpRef}
              className="form-control mt-1 mb-1"
              maxLength={6}
              placeholder="पुष्टि कोड दर्ज करें"
            />
            <button
              type="button"
              className="btn btn-warning col-12 mx-auto"
              onClick={(e) => {
                e.preventDefault();
                setButtonText("सत्यापित किया जा रहा है...");
                verifyOTP();
              }}
              data-coreui-timeout="2000"
              data-coreui-toggle="loading-button"
              disabled={verifyButtonClicked}
            >
              पुष्टि कोड सत्यापित करें
            </button>
          </>
        )}
      </form>
      <div
        className={`mt-3 align-items-center justify-content-between alert alert-${
          alertMsg.type
        } alert-dissmissible fade ${alertMsg.show ? "d-flex show" : "d-none"}`}
        role="alert"
      >
        {alertMsg.title}
        <button
          type="button"
          className="btn btn-close"
          aria-label="Close"
          onClick={() => {
            setAlertMsg({ type: "", title: "", show: false });
          }}
        ></button>
      </div>
      {regDone && (
        <StartMembership
          memberDetails={memberForm}
          setMemberDetails={setMemberForm}
          setLoading={setLoading}
        />
      )}
      {/* <Slide direction="up" in={regDone} mountOnEnter unmountOnExit></Slide> */}
      {/* in={regDone} */}
      {/*  */}
      {/* <Slide direction="up" in={true} mountOnEnter unmountOnExit></Slide> */}
      {loading && <Loader fullHeight={false} />}
    </>
  );
};

export default NewMemberForm;
