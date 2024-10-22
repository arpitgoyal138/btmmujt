import React, { useState, useEffect } from "react";
import useRazorpay from "react-razorpay";
import CustomButton from "../Button/CustomButton";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Loader from "../../loader/Loader";

const CheckoutButton = ({
  styles,
  member,
  amount,
  onCreateOrder,
  currentPlanId,
  currentPayment,
  onPayment,
}) => {
  console.log(
    "member:",
    member,
    "_amount from index:",
    amount,
    "__currentPlanId:",
    currentPlanId
  );
  const [Razorpay] = useRazorpay();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const createOrder = async () => {
    console.log("Create Order with amount:", amount);
    setLoading(true);
    // const url = "https://razorpayapi-ryltdekpdq-uc.a.run.app/createOrder";
    // try {
    //   await fetch(url, {
    //     method: "POST",
    //     body: JSON.stringify(order),
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log("Resp: createOrder -> data from razorpay API:", data);
    //       setOrderData(data);
    //     });
    // } catch (error) {
    //   setLoading(false);
    //   console.log("Server Error:", error);
    // }
    if (
      currentPlanId === null ||
      currentPlanId === undefined ||
      currentPlanId === ""
    ) {
      // Create Plan
      createPlan();
    } else {
      // Create Subscription
      createSubscription(currentPlanId);
    }
  };
  const createPlan = async () => {
    const url = "https://razorpayapi-ryltdekpdq-uc.a.run.app/createPlan";
    const options = {
      amount: amount * 100,
      currency: "INR",
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resp: createPlan -> data from razorpay API:", data);
          createSubscription(data.id);
        });
    } catch (error) {
      setLoading(false);
      console.log("Server Error:", error);
    }
  };
  const createSubscription = async (planId) => {
    const url =
      "https://razorpayapi-ryltdekpdq-uc.a.run.app/createSubscription";
    const options = {
      amount: amount * 100,
      planId: planId,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "Resp: createSubscription -> data from razorpay API:",
            data
          );
          setOrderData(data);
        });
    } catch (error) {
      setLoading(false);
      console.log("Server Error:", error);
    }
  };
  function handlePayment() {
    //console.log("now handlePayment=> currentPayment:", currentPayment);
    // const options = {
    //   key:
    //     process.env.REACT_APP_PAYMENT_METHOD === "TEST"
    //       ? process.env.REACT_APP_RAZORPAY_KEY_TEST
    //       : process.env.REACT_APP_RAZORPAY_KEY_LIVE,
    //   amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //   currency: "INR",
    //   name: "B.T.M.M Jankalyan Trust", //your business name
    //   description: "For Order " + (orderData !== null ? orderData.id : ""),
    //   // image: "https://myecommerce-a647b.web.app/favicon.ico",
    //   order_id: orderData !== null ? orderData.id : "", //This is the `id` obtained in the response of Step 1
    //   handler: (response) => {
    //     //console.log("Response:", response);
    //     onPayment({ success: true, response });
    //     setOrderData(null);
    //   },
    //   prefill: {
    //     //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
    //     name: member.name, //your customer's name
    //     contact: member.contact_no, //Provide the customer's phone number for better conversion rates
    //   },
    //   notes: {
    //     address:
    //       "B.T.M.M Jankalyan Trust, Shekhpura Kadeem, Saharanpur, UP, INDIA",
    //   },
    //   theme: {
    //     color: process.env.REACT_APP_BG_COLOR,
    //   },
    // };
    const subscription_options = {
      key:
        process.env.REACT_APP_PAYMENT_METHOD === "TEST"
          ? process.env.REACT_APP_RAZORPAY_KEY_TEST
          : process.env.REACT_APP_RAZORPAY_KEY_LIVE,
      subscription_id: currentPayment.id,
      name: "B.T.M.M Jankalyan Trust",
      description: "Monthly Donation",
      // image: "/your_logo.jpg",
      handler: (response) => {
        //console.log("Subscription Payment Response:", response);
        onPayment({ success: true, response });
        setOrderData(null);
      },
      prefill: {
        name: member.name,
        contact: member.contact_no,
        email: "nadeem0786rana@gmail.com",
      },
    };
    //console.log("subscription_options:", subscription_options);
    const rzp1 = new Razorpay(subscription_options);

    rzp1.on("payment.failed", function (response) {
      console.log("payment.failed:", response);
      setLoading(false);
      onPayment({ success: false, response });
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    rzp1.open();
  }
  useEffect(() => {
    //console.log("orderData CHANGED:", orderData);
    if (orderData !== null && orderData !== undefined) {
      setLoading(false);
      onCreateOrder({ success: true, subscription: orderData });
    }
  }, [orderData]);
  useEffect(() => {
    //console.log("currentPayment CHANGED:", currentPayment);
    if (currentPayment !== null && currentPayment !== undefined) {
      handlePayment();
    }
  }, [currentPayment]);

  return (
    <>
      <CustomButton
        sx={styles}
        variant="contained"
        fullWidth
        // startIcon={<ShoppingCartCheckoutIcon />}
        size="large"
        onClick={(e) => {
          createOrder();
        }}
        disabled={amount === undefined || amount < 60}
      >
        {Number(amount) < 60 ? "न्यूनतम ₹60 दर्ज करें " : "सदस्यता शुरू करें"}
      </CustomButton>
      {loading && <Loader fullHeight={false} />}
    </>
  );
};

export default CheckoutButton;
