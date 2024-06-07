import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WebIcon from "@mui/icons-material/Web";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

export const drawerItems = [
  {
    id: 0,
    icon: <WebIcon />,
    label: "Go to Website",
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
    label: "All Members",
    route: "/admin/members",
  },
  {
    id: 3,
    icon: <VolunteerActivismIcon />,
    label: "Add Donation",
    route: "/admin/categories",
  },
  {
    id: 4,
    icon: <AccountBalanceIcon />,
    label: "Account Balance",
    route: "/admin/orders",
  },
];
