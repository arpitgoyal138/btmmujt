import "./App.css";
import Homepage from "./pages/app/home";
import DrawerAppBar from "./components/app/navbar";
import AppFooter from "./components/app/footer";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import ContactUsPage from "./pages/app/contactUs";
import PageNotFound from "./pages/errors/PageNotFound";
import TermsAndConditions from "./pages/app/termsAndConditions";
import PrivacyPolicy from "./pages/app/privacy";
import AboutPage from "./pages/app/about";
import PrivateRoute from "./components/private-route/PrivateRoute";
import NetworkStatus from "./components/network-status/NetworkStatus";
import ObjectivesOfTrust from "./pages/app/objectivesOfTrust";
import { useEffect } from "react";
import Lightbox from "bs5-lightbox";
import SignIn from "./pages/admin/auth/sign-in";

import LeftResponsiveDrawer from "./components/admin/drawer";
import AdminDashboard from "./pages/admin/dashboard";
import AllMembers from "./pages/admin/members";
import AllManagers from "./pages/admin/managers";
import MemberDetail from "./pages/admin/memberDetail";
import AllDonationsGiven from "./pages/admin/donationsGiven";
import ThankYouForDonation from "./components/app/order-placed/ThankYouForDonation";
export default function App() {
  const options = {
    keyboard: true,
    ride: true,
    interval: 3000,
    constrain: false,
  };
  useEffect(() => {
    setTimeout(() => {
      // Initialize lightbox for all links with data-toggle="lightbox" attribute
      const elements = document.querySelectorAll("[data-toggle='lightbox']");
      elements.forEach((el) =>
        el.addEventListener("click", (e) => {
          e.preventDefault();
          const lightbox = new Lightbox(el, options);
          lightbox.show();
        })
      );
    }, 2000);
  }, []);
  const loader = document.getElementById("loader");
  const root = document.getElementById("root");
  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        //add class fadeout to loader
        loader.classList.add("fadeOutLoader");
      }, 200);
      setTimeout(() => {
        root.style.top = 0;
        loader.style.display = "none";
      }, 500);
    }
  }, []);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />} errorElement={<PageNotFound />}>
          <Route index element={<Homepage />} />
          <Route path="/objectives" element={<ObjectivesOfTrust />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/thank-you" element={<ThankYouForDonation />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute accessTo="Admin" Component={Root} layout="ADMIN" />
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route path="/admin/members" element={<AllMembers />}></Route>
          <Route path="/admin/managers" element={<AllManagers />}></Route>
          <Route
            path="/admin/member-detail/:memberId"
            element={<MemberDetail />}
          ></Route>
          <Route
            path="/admin/add-donation"
            element={<AllDonationsGiven />}
          ></Route>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

const Root = ({ layout = "" }) => {
  console.log("IN ROOT");
  //const theme = useTheme();
  //const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  if (layout === "ADMIN") {
    return (
      <>
        <NetworkStatus />
        <LeftResponsiveDrawer />
        {/* <AdminDrawer /> */}
      </>
    );
  } else if (layout === "") {
    return (
      <>
        <NetworkStatus />
        <DrawerAppBar />
        <Outlet />
        <AppFooter />
        <ScrollRestoration />
      </>
    );
  }
};
