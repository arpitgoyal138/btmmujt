/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useMemo, useEffect} from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Fade,
  Grid,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CustomDataGrid from "../../../components/common/DataGrid/CustomDataGrid";
import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";
import OrdersAPI from "../../../api/firebase/OrdersAPI";
import ViewOrder from "../../../components/admin/view-order/ViewOrder";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const styles = {
  boxStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {md: "50%", sm: "75%", xs: "90%"},
    bgcolor: "background.paper",
    borderRadius: "5px",
    boxShadow: 10,
    p: 2, //padding
    maxHeight: "95%",
    overflow: "scroll",
  },
};
const AllOrders = () => {
  const [ordersArr, setOrdersArr] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [openViewOrderModal, setOpenViewOrderModal] = useState(false);
  const ordersAPI = new OrdersAPI();
  // For snackbar
  const [snackbarState, setSnackbarState] = useState(false);
  const [message, setMessage] = useState({text: "", type: ""});
  const showSnackbar = () => {
    setSnackbarState(true);
  };
  const hideSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState(false);
  };
  useEffect(() => {
    if (selectedOrder.id !== undefined) {
      setOpenViewOrderModal(true);
    }
  }, [selectedOrder]);

  // Fetch all orders
  useEffect(() => {
    const resOrders = ordersAPI.getOrders();
    resOrders.then((resData) => {
      console.log("received all orders:", resData);
      if (!resData) {
        return;
      }
      setOrdersArr(resData.data);
    });
  }, []);
  useEffect(() => {
    console.log("Done fetching all orders: ", ordersArr);
  }, [ordersArr]);
  useEffect(() => {
    if (message.type === "success") {
      setTimeout(() => {
        setOpenViewOrderModal(false);
      }, 500);
    }
  }, [message]);

  //// Columns for Orders DataGrid
  const columns = useMemo(
    () => [
      {
        field: "image",
        headerName: "Image",
        width: 120,
        renderCell: (params) => {
          if (params.row.items[0].images[0].url !== undefined) {
            return (
              <AvatarGroup max={2} variant="rounded">
                {params.row.items.map((item, id) => (
                  <Avatar key={id} alt={item.id} src={item.images[0].url} />
                ))}
              </AvatarGroup>
            );
          } else {
            return <Avatar src="/static/images/avatar/1.jpg" />;
          }
        },
        sortable: false,
        filterable: false,
      },
      {field: "id", headerName: "Order Id", width: 200},

      {
        field: "items",
        headerName: "Products",
        width: 500,
        renderCell: (params) => {
          if (params.row.items.length > 1) {
            return (
              <div className="rowitem" style={{height: "52px"}}>
                {params.row.items.map((item, index) => {
                  return (
                    <p
                      key={index}
                      style={{marginTop: "0.25rem", marginBottom: "0.25rem"}}
                    >
                      {item.title} (Qty. {item.quantity})
                    </p>
                  );
                })}
              </div>
            );
          } else {
            return (
              <p>
                {params.row.items[0].title} Qty. {params.row.items[0].quantity}
              </p>
            );
          }
        },
      },
      {field: "amount", headerName: "Amount (₹)", width: 90},
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params) => {
          return <div className="rowitem">{params.row.status}</div>;
        },
      },

      {
        field: "modifiedAt",
        headerName: "Modified at",
        width: 180,
        renderCell: (params) => {
          const t = new Date(
            params.row.modifiedAt.seconds * 1000
          ).toLocaleString();
          return <div className="rowitem">{t}</div>;
        },
      },
    ],
    [rowId]
  );

  const sendOrderShippedMail = async (data) => {
    console.log("data in sendMail: ", data);
    const shippingAmount = 0;
    const url = "https://payments.inproveda.com/public/api/order_shipped";
    const customerName = data.user.name;
    const customerEmail = data.user.email;
    const orderId = data.id;
    const tableHeader =
      "<table style='width: 100%;'>" +
      "<tr>" +
      "<th style='text-align:left'></th>" +
      "<th style='text-align:left'>Product</th>" +
      "<th style='text-align:left'>List Price</th>" +
      "<th style='text-align:left'>Total</th>" +
      "</tr>";
    let tableBody = "";
    data.items.map((item, index) => {
      tableBody +=
        "<tr><td style='vertical-align: top;'>" +
        (index + 1) +
        ".</td><td style='padding-right:16px'>" +
        item.title +
        "  x " +
        item.quantity +
        " </td> <td>₹" +
        item.listPrice +
        "</td><td>₹" +
        item.listPrice * item.quantity +
        "</td></tr>";
    });
    // Calculate final amount based on listPrice and quantity of item
    const totalAmount = data.items.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.listPrice * currentValue.quantity;
    }, 0);
    const tableFinalAmount =
      "<tr><td></td><td></td><td>Shipping</td><td>₹" +
      shippingAmount +
      "</td></tr>" +
      "<tr><td></td><td></td><td>Final Amount</td><td>₹" +
      (totalAmount + shippingAmount) +
      "</td></tr>";
    const orderSummaryTable =
      tableHeader + tableBody + tableFinalAmount + "</table>";
    const nameTrimmed = data.address.name.replace(/[^a-zA-Z0-9,()-+ ]/g, "");
    const addressTrimmed = data.address.address.replace(
      /[^a-zA-Z0-9,()-+ ]/g,
      ""
    );
    const cityTrimmed = data.address.city.replace(/[^a-zA-Z0-9,()-+ ]/g, "");
    const pincodeTrimmed = data.address.pincode.replace(
      /[^a-zA-Z0-9,()-+ ]/g,
      ""
    );
    const landmarkTrimmed = data.address.landmark.replace(
      /[^a-zA-Z0-9,() ]/g,
      ""
    );
    const shippingAddressData =
      "<div><p>" +
      nameTrimmed +
      "</p>" +
      "<p>" +
      data.address.mobile +
      "," +
      data.address.alternateMobile +
      "</p><p>Address: " +
      addressTrimmed +
      "</p><p>City: " +
      cityTrimmed +
      "</p><p>State: " +
      data.address.state +
      "</p><p>Pincode: " +
      pincodeTrimmed +
      "</p><p>Landmark: " +
      landmarkTrimmed +
      "</p></div>";
    const shipmentProvider = data.courierDetails.partner;
    const trackingURL = data.courierDetails.trackingUrl;
    const trackingID = data.courierDetails.trackingId;
    console.log("orderSummaryTable:", orderSummaryTable);
    console.log("shippingAddress:", shippingAddressData);
    const options = JSON.stringify({
      cust_name: customerName,
      cust_email: customerEmail,
      from_name: "Inproveda Orders",
      from_email: "orders@inproveda.com",
      bcc_name: "Arpit Goyal",
      bcc_email: "arpitgoyal138@gmail.com",
      order_id: orderId,
      order_summary: orderSummaryTable,
      shipping_address: shippingAddressData,
      shipment_provider: shipmentProvider,
      tracking_url: trackingURL,
      tracking_id: trackingID,
    });
    try {
      await fetch(url, {
        method: "POST",
        body: options,
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log("data:", data);
        });
    } catch (error) {
      console.log("Server Error:", error);
    }
  };
  const sendOrderCancelledOrDeliveredMail = async (data) => {
    console.log("data in sendMail: ", data);
    let url = "";
    if (data.status === "Delivered") {
      url = "https://payments.inproveda.com/public/api/order_delivered";
    } else {
      url = "https://payments.inproveda.com/public/api/order_cancelled";
    }
    const shippingAmount = 0;
    const customerName = data.user.name;
    const customerEmail = data.user.email;
    const orderId = data.id;
    const tableHeader =
      "<table style='width: 100%;'>" +
      "<tr>" +
      "<th style='text-align:left'></th>" +
      "<th style='text-align:left'>Product</th>" +
      "<th style='text-align:left'>List Price</th>" +
      "<th style='text-align:left'>Total</th>" +
      "</tr>";
    let tableBody = "";
    data.items.map((item, index) => {
      tableBody +=
        "<tr><td style='vertical-align: top;'>" +
        (index + 1) +
        ".</td><td style='padding-right:16px'>" +
        item.title +
        "  x " +
        item.quantity +
        " </td> <td>₹" +
        item.listPrice +
        "</td><td>₹" +
        item.listPrice * item.quantity +
        "</td></tr>";
    });
    // Calculate final amount based on listPrice and quantity of item
    const totalAmount = data.items.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.listPrice * currentValue.quantity;
    }, 0);
    const tableFinalAmount =
      "<tr><td></td><td></td><td>Shipping</td><td>₹" +
      shippingAmount +
      "</td></tr>" +
      "<tr><td></td><td></td><td>Final Amount</td><td>₹" +
      (totalAmount + shippingAmount) +
      "</td></tr>";
    const orderSummaryTable =
      tableHeader + tableBody + tableFinalAmount + "</table>";
    console.log("orderSummaryTable:", orderSummaryTable);
    const options = JSON.stringify({
      cust_name: customerName,
      cust_email: customerEmail,
      from_name: "Inproveda Orders",
      from_email: "orders@inproveda.com",
      bcc_name: "Arpit Goyal",
      bcc_email: "arpitgoyal138@gmail.com",
      order_id: orderId,
      order_summary: orderSummaryTable,
    });
    console.log("options:", options);
    try {
      await fetch(url, {
        method: "POST",
        body: options,
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log("data:", data);
        });
    } catch (error) {
      console.log("Server Error:", error);
    }
  };

  /// Add Category to firebase
  const handleSetOrder = (dataToUpdate) => {
    console.log("dataToUpdate:", dataToUpdate);

    const dataToSend = {
      id: dataToUpdate.id,
      payload: {
        ...dataToUpdate,
      },
    };
    console.log("dataToSend:", dataToSend);

    // API to add product data to firestore
    const res = ordersAPI.setOrder(dataToSend);
    res
      .then((resData) => {
        if (resData.success) {
          // Send Mail
          if (dataToUpdate.status === "Shipped") {
            sendOrderShippedMail(dataToUpdate);
          } else if (
            dataToUpdate.status === "Cancelled by buyer" ||
            dataToUpdate.status === "Cancelled by seller" ||
            dataToUpdate.status === "Delivered"
          ) {
            sendOrderCancelledOrDeliveredMail(dataToUpdate);
          }
          const orderIndexInArr = ordersArr.findIndex(
            (obj) => obj.id === dataToUpdate.id
          );

          const orders_ = [...ordersArr];
          orders_[orderIndexInArr] = {
            ...dataToUpdate,
          };
          setOrdersArr([...orders_]);

          setMessage({
            text: "Order updated successfully !",
            type: "success",
          });
          showSnackbar();
        } else {
          setMessage({
            text: "Some error occured. Please try again !!",
            type: "error",
          });
          console.log(resData.message);
        }
      })
      .catch((ex) => {
        setMessage({
          text: "Some error occured. Please try again !!",
          type: "error",
        });
        console.log(ex);
      });
  };
  return (
    <>
      <Box component="div" sx={{display: {xs: "none", sm: "block"}}}>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          Orders
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openViewOrderModal}
          onClose={() => setOpenViewOrderModal(false)}
          closeAfterTransition
        >
          <Fade in={openViewOrderModal}>
            <Grid item sx={styles.boxStyle}>
              <ViewOrder
                detailedOrder={selectedOrder}
                onSetOrder={handleSetOrder}
                hideModal={() => setOpenViewOrderModal(false)}
              />
            </Grid>
          </Fade>
        </Modal>

        <Snackbar
          open={snackbarState}
          autoHideDuration={3000}
          onClose={hideSnackbar}
        >
          <Alert
            onClose={hideSnackbar}
            severity={message.type}
            sx={{width: "100%"}}
          >
            {message.text}
          </Alert>
        </Snackbar>

        <Grid xs={12} mt={2}>
          <CustomDataGrid
            rows={ordersArr}
            columns={columns}
            styles={{height: "560px"}}
            pageSizes={[25, 50, 100]}
            onCellEditCommit={(params) => setRowId(params.id)}
            onRowClickHandle={(params) => setSelectedOrder({...params.row})}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AllOrders;
