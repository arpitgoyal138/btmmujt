import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CustomButton from "../Button/CustomButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  handleOnClose = () => {},
  handleOnAgree = () => {},
  title = "",
  description = "",
  isOpen = false,
  agreeButtonText = "Remove",
  cancelButtonText = "Cancel",
}) {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleOnClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={handleOnClose} variant="outlined">
          {cancelButtonText}
        </CustomButton>
        <CustomButton onClick={handleOnAgree} variant="contained">
          {agreeButtonText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}