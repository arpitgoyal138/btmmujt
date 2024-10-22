import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";

import WebIcon from "@mui/icons-material/Web";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
export const drawerItems = [
  {
    id: 1,
    icon: <AccountBalanceIcon />,
    label: "मेरी सदस्यता",
    route: "/member/my-subscription",
  },
  {
    id: 2,
    icon: <PersonIcon />,
    label: "मेरी जानकारी",
    route: "/member/my-profile",
  },
];
