import { Button, Typography } from "@mui/material";
import React from "react";

const CustomButton = ({
  children,
  variant,
  size,
  sx,
  color,
  disabled,
  fullWidth,
  startIcon,
  endIcon,
  onClick,
  type,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      sx={sx}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      type={type}
    >
      <Typography variant="body1">{children}</Typography>
    </Button>
  );
};

export default CustomButton;
