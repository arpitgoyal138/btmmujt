import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {auth} from "../../firebase";

export default function PrivateRoute({accessTo = "", Component, ...rest}) {
  const [isLoading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  console.log("Current User in private route check: ", currentUser);
  useEffect(() => {
    console.log("CHECK PRIVATE_____ currentUser:", currentUser);
    if (currentUser === null) {
      console.log("Sending to login page");
      return navigate("/login");
    } else if (!currentUser.role === accessTo) {
      // Not authorized to access this route
      console.log("No access for this user");
    }
    setLoading(false);
  }, [currentUser]);
  return !isLoading && <Component {...rest} />;
}
