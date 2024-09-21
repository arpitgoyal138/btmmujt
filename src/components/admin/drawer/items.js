import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WebIcon from "@mui/icons-material/Web";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
export const drawerItems = [
  {
    id: 0,
    icon: <WebIcon />,
    label: "वेबसाइट पर जाएं",
    route: "/",
  },
  {
    id: 1,
    icon: <DashboardIcon />,
    label: "Dashboard",
    route: "/admin/dashboard",
  },
  {
    id: 2,
    icon: <PeopleIcon />,
    label: "सभी सदस्य",
    route: "/admin/members",
  },
  {
    id: 3,
    icon: <ManageAccountsIcon />,
    label: "सभी प्रबंधक",
    route: "/admin/managers",
  },
  {
    id: 4,
    icon: <RemoveIcon />,
    label: "सभी दिए गए दान",
    route: "/admin/add-donation",
  },
  {
    id: 5,
    icon: <AddIcon />,
    label: "सभी प्राप्त हुए दान",
    route: "/admin/donations-received",
  },
  // {
  //   id: 5,
  //   icon: <AccountBalanceIcon />,
  //   label: "Account Balance",
  //   route: "/admin/orders",
  // },
];
