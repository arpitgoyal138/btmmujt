import React, {useState, useRef, useEffect} from "react";
import "./styles.css";
import {states} from "./IndianStates";
import MembersAPI from "./../../../../api/firebase/MembersAPI";
//Firebase
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {storage} from "../../../../firebase";
// Image Libraries
import CompressAPI from "./../../../../api/compressImage/CompressAPI";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const NewMemberForm = ({memberData = null}) => {
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
    aadhaar_photo_front: "",
    aadhaar_photo_back: "",
    latest_photo: "",
    work_group: "",
    work_detail: "",
    unique_code: "",
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
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // console.log("memberForm: ", memberForm);
  const membersAPI = new MembersAPI();
  useEffect(() => {
    if (memberData !== null) {
      setMemberForm({...memberData});
      populateFormValues(memberData);
    }
  }, [memberData]);

  const clearForm = () => {
    thekedarRadioRef.current.checked = false;
    karigarRadioRef.current.checked = false;
    helperRadioRef.current.checked = false;
    othersRadioRef.current.checked = false;
    formCheckRef.current.checked = false;
    setFormChecked(false);
    setMemberForm({...initMemberForm});
    setImageData([]);
    setProgress(0);
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
    setImageData([]);
    setProgress(0);
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
  };
  const validate = () => {
    // validate form
    if (memberForm.name.length < 3) {
      alert("नाम न्यूनतम ३ अक्षरों का होना अनिवार्य है ");
      nameRef.current.focus();
      return false;
    } else if (memberForm.fathers_name.length < 3) {
      alert("पिता का नाम न्यूनतम ३ अक्षरों का होना अनिवार्य है ");
      fathers_nameRef.current.focus();
      return false;
    } else if (memberForm.address.length < 3) {
      alert("स्थायी पता न्यूनतम ३ अक्षरों का होना अनिवार्य है ");
      addressRef.current.focus();
      return false;
    } else if (memberForm.rtocode.length > 0 && memberForm.rtocode.length < 3) {
      alert("R.T.O. कोड 4 अक्षरों का होना अनिवार्य है ");
      rtocodeRef.current.focus();
      return false;
    } else if (memberForm.pincode.length > 0 && memberForm.pincode.length < 6) {
      alert("पिनकोड 6 अक्षरों का होना अनिवार्य है ");
      pincodeRef.current.focus();
      return false;
    } else if (memberForm.aadhaar_photo_front === "") {
      alert("आधार कार्ड की सामने व पीछे की फोटो संलग्न करना अनिवार्य है ");
      aadhaar_photo_frontRef.current.focus();
      return false;
    } else if (memberForm.aadhaar_photo_back === "") {
      alert("आधार कार्ड की सामने व पीछे की फोटो संलग्न करना अनिवार्य है ");
      aadhaar_photo_backRef.current.focus();
      return false;
    } else if (memberForm.latest_photo === "") {
      alert("कृप्या अपनी हाल ही की फोटो संलग्न करें");
      latest_photoRef.current.focus();
      return false;
    } else if (memberForm.work_group === "") {
      alert("कृप्या अपने कार्यक्षेत्र का चयन करें");
      return false;
    } else if (
      memberForm.work_group === "Others" &&
      memberForm.work_detail.length < 3
    ) {
      alert("कृप्या अपने कार्य के विषय में जानकारी दें ");
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
          });
        })
        .catch((ex) => {
          console.log("CompressImage Error:", ex);
        });
    }
  }
  const handleFileUpload = ({path, file, fileName, imgFor}) => {
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
            if (imgFor === "front") {
              setIsUploadingFront(false);
              setMemberForm({...memberForm, aadhaar_photo_front: downloadURL});
            } else if (imgFor === "back") {
              setIsUploadingBack(false);
              setMemberForm({...memberForm, aadhaar_photo_back: downloadURL});
            } else if (imgFor === "self") {
              setIsUploadingSelf(false);
              setMemberForm({...memberForm, latest_photo: downloadURL});
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
  const handleDeleteFile = (index, fileName) => {
    console.log("delete file:", index, " name:", fileName);
    const tempImageData = [...imageData];
    tempImageData.splice(index, 1);
    setImageData(tempImageData);
    const fileRef = ref(storage, `images/categories/${fileName}`);
    // Delete the file
    deleteObject(fileRef)
      .then(() => {
        // File deleted successfully
        console.log("deleted successfully");
        // const updatedURLs = categoryContext.state.images.filter(
        //   (state) => state.name !== fileName
        // );
        // categoryContext.setState({
        //   ...categoryContext.state,
        //   images: updatedURLs,
        // });
      })
      .catch((err) => {
        // Uh-oh, an error occurred!
        console.log("delete err:", err.message);
      });
  };
  const submitForm = () => {
    if (validate()) {
      // get total no. of members
      membersAPI
        .getMembers()
        .then((rcv_data) => {
          console.log("rcv_data:", rcv_data);
          // check if member mobile no. already exists
          const memberExists = rcv_data.data.some(function (member) {
            return member.contact_no === memberForm.contact_no;
          });
          if (memberExists) {
            console.log("Member Already Exists!");
            alert(
              "इस व्हाट्सप्प मोबाइल नंबर से कोई और सदस्य पहले ही पंजीकृत हो चुका है| \nकृप्या किसी अन्य मोबाइल नंबर से प्रयास करें| "
            );
            return;
          }
          let totMembers = rcv_data.data.length;
          const maxChars = 7;
          // generate serail no.
          let serialNo = (totMembers + 1).toString();

          console.log("serial No :", serialNo);
          let uniqueCode = "";
          if (memberForm.rtocode.length === 4) {
            uniqueCode =
              memberForm.rtocode
                .toUpperCase()
                .trim()
                .replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "") + "-";
          } else if (memberForm.pincode.length === 6) {
            uniqueCode =
              memberForm.pincode
                .toUpperCase()
                .trim()
                .replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "") + "-";
          }

          // uniqueCode will have 7 characters having last characters as serial number and all other characters marked as X. please generate code for this
          for (let i = 0; i < maxChars - serialNo.length; i++) {
            uniqueCode += "X";
          }
          uniqueCode += serialNo;
          console.log("unique Code :", uniqueCode);
          const dataToSend = {
            payload: {...memberForm, unique_code: uniqueCode},
            id: uniqueCode,
          };
          membersAPI
            .setMember(dataToSend)
            .then((res) => {
              if (res.success) {
                clearForm();
                // Success
                //सफलतापूर्वक
                const alertOptions = {
                  type: "success",
                  title:
                    "आपका पंजीकरण सफलतापूर्वक हो गया है|\r\n कृप्या अपना कोड " +
                    uniqueCode +
                    " सुरक्षित कर लें ",
                  show: true,
                };
                setAlertMsg({...alertOptions});
                // alert("registered with id: " + uniqueCode);
              } else {
                // Failure
                const alertOptions = {
                  type: "daanger",
                  title: "Registration failed",
                  show: true,
                };
                setAlertMsg({...alertOptions});
              }
            })
            .catch((err) => {
              // Error
              // Failure
              const alertOptions = {
                type: "warning",
                title: "Registration failed",
                show: true,
              };
              setAlertMsg({...alertOptions});
            });
        })
        .catch((err) => {
          console.log("error while getMembers() API");
          const alertOptions = {
            type: "warning",
            title: "Registration failed",
            show: true,
          };
          setAlertMsg({...alertOptions});
        });
    } else {
      console.log("incorrect input");
    }
  };
  const updateForm = () => {
    if (validate()) {
      const dataToSend = {
        payload: {...memberForm},
        id: memberData.unique_code,
      };
      membersAPI
        .setMember(dataToSend)
        .then((res) => {
          if (res.success) {
            //clearForm();
            setFormChecked(false);
            // Success
            //सफलतापूर्वक
            const alertOptions = {
              type: "success",
              title: "पंजीकरण सफलतापूर्वक हो गया है|",
              show: true,
            };
            formCheckRef.current.checked = false;
            setAlertMsg({...alertOptions});
            handleClick();
            // alert("registered with id: " + uniqueCode);
          } else {
            // Failure
            const alertOptions = {
              type: "danger",
              title: "Updation failed",
              show: true,
            };
            setAlertMsg({...alertOptions});
          }
        })
        .catch((err) => {
          // Error
          // Failure
          const alertOptions = {
            type: "warning",
            title: "Updation failed",
            show: true,
          };
          setAlertMsg({...alertOptions});
        });
    } else {
      console.log("incorrect input");
    }
  };
  return (
    <>
      {/* create a form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
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
                onChange={(e) => {
                  setMemberForm({
                    ...memberForm,
                    rtocode: e.target.value,
                  });
                }}
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
                onChange={(e) => {
                  if (isNaN(e.target.value)) {
                    pincodeRef.current.value = memberForm.pincode;
                    return false;
                  }
                  setMemberForm({
                    ...memberForm,
                    pincode: e.target.value,
                  });
                }}
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
            />
          </div>
          <div className="col-sm-6 mb-2">
            <label htmlFor="state" className="form-label">
              राज्य *
            </label>

            <select
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
              ref={contact_noRef}
              type="text"
              className="form-control"
              id="mobile"
              aria-describedby="name"
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  contact_no: e.target.value,
                });
              }}
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
              onChange={(e) => {
                setMemberForm({
                  ...memberForm,
                  alternate_contact_no: e.target.value,
                });
              }}
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
              accept="image/png, image/jpeg, image/jpg, image/webp"
              id="aadhaar_front"
              onChange={(e) => handleImageChange(e, "front")}
              required
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
              accept="image/png, image/jpeg, image/jpg, image/webp"
              id="aadhaar_back"
              onChange={(e) => handleImageChange(e, "back")}
              required
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-around">
          {isUploadingFront && (
            <div className="col-sm-6 mt-2 mb-2 upload-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div
            className={`col-sm-6 mt-2 mb-2 uploaded-image-box ${
              memberForm.aadhaar_photo_front !== "" && !isUploadingFront
                ? "show"
                : ""
            }`}
            style={{
              backgroundImage: `url("${memberForm.aadhaar_photo_front}")`,
            }}
          ></div>
          {isUploadingBack && (
            <div className="col-sm-6 mt-2 mb-2 uploaded-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div
            className={`col-sm-6 mt-2 mb-2 uploaded-image-box ${
              memberForm.aadhaar_photo_back !== "" && !isUploadingBack
                ? "show"
                : ""
            }`}
            style={{backgroundImage: `url("${memberForm.aadhaar_photo_back}")`}}
          ></div>
        </div>
        <div className="row mb-3">
          <div className="col-12 mb-2">
            <label htmlFor="latest_photo" className="form-label">
              अपनी नवीनतम फोटो *
            </label>
            <input
              ref={latest_photoRef}
              className="form-control"
              type="file"
              id="latest_photo"
              onChange={(e) => handleImageChange(e, "self")}
              accept="image/png, image/jpeg, image/jpg, image/webp"
            />
          </div>
        </div>
        <div className="row mb-3 justify-content-around">
          {isUploadingSelf && (
            <div className="col-sm-6 mt-2 mb-2 upload-image-box show align-content-center text-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div
            className={`col-sm-6 mt-2 mb-2 uploaded-image-box ${
              memberForm.latest_photo !== "" && !isUploadingSelf ? "show" : ""
            }`}
            style={{backgroundImage: `url("${memberForm.latest_photo}")`}}
          ></div>
        </div>
        <div className="row">
          <div className="col-12">
            <label htmlFor="name" className="form-label">
              कार्यक्षेत्र *
            </label>
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
                });
              }}
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
                });
              }}
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
                });
              }}
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
            />
          </div>
        </div>
        <div className="mb-3 form-check">
          <input
            ref={formCheckRef}
            type="checkbox"
            className="form-check-input"
            id="checkbox"
            onChange={(e) => {
              setFormChecked(e.target.checked);
            }}
          />
          <label className="form-check-label" htmlFor="checkbox">
            मैं पुष्टि करता हूं कि उपरोक्त कथन सभी प्रकार से सत्य हैं
          </label>
        </div>
        {memberData === null && (
          <button
            type="submit"
            className="btn btn-success col-12 mx-auto"
            disabled={formChecked ? false : "disabled"}
          >
            जमा करें
          </button>
        )}
        {memberData !== null && (
          <button
            type="button"
            className="btn btn-success col-12 mx-auto"
            disabled={formChecked ? false : "disabled"}
            onClick={updateForm}
          >
            Update
          </button>
        )}
      </form>
      <div
        className={`mt-3 alert alert-${alertMsg.type} alert-dismissible fade ${
          alertMsg.show ? "d-block show" : "d-none"
        } $`}
        role="alert"
      >
        {alertMsg.title}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={() => {
            setAlertMsg({...alertMsg, show: false});
          }}
        ></button>
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertMsg.type}
          variant="filled"
          sx={{width: "100%"}}
        >
          {alertMsg.title}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewMemberForm;
