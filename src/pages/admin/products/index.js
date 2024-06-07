/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useContext, useEffect} from "react";
import AddProduct from "../../../components/admin/add-product/AddProduct";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CustomButton from "../../../components/common/Button/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import ProductsAPI from "../../../api/firebase/ProductsAPI";
import AddProductContext from "../../../context/addProduct/AddProductContext";
import {Avatar, Snackbar, Typography} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AllProductsContext from "../../../context/allProducts/AllProductsContext";
import {styles} from "./styles";
import CustomDataGrid from "../../../components/common/DataGrid/CustomDataGrid";
import DataGridActions from "../../../components/admin/datagrid-actions/DataGridActions";
import ImageIcon from "@mui/icons-material/Image";
import AllCategoriesContext from "../../../context/allCategories/AllCategoriesContext";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductsListAdmin = () => {
  const productAPI = new ProductsAPI();
  const allProductsContext = useContext(AllProductsContext);
  const allCategoriesContext = useContext(AllCategoriesContext);

  // console.log("all Products :", allProductsContext.state);
  const initState = {
    categories: [],
    parentCategory: {id: "NONE", name: "None"},
    id: "",
    title: "",
    searchTerms: "",
    description: "",
    maxPrice: "",
    listPrice: "",
    unitsInStock: "",
    netQuantity: "",
    unitType: "",
    images: [],
    visible: true,
    createdAt: null,
  };

  // Fetch all products
  useEffect(() => {
    const productAPI = new ProductsAPI();
    const resProducts = productAPI.getProducts();
    resProducts.then((resData) => {
      console.log("Done fetching all products: ", resData);
      allProductsContext.setState(resData.data);
    });
    const resCategories = productAPI.getCategories();
    resCategories.then((resData) => {
      // console.log("received:", resData);
      if (!resData) {
        return;
      }
      // console.log("Done fetching all categories: ", resData);
      allCategoriesContext.setState(resData.data);
    });
  }, []);
  ////////////////////////////////////

  const productContext = useContext(AddProductContext);

  // For Add Product Modal
  const [openProductModal, setOpenProductModal] = useState(false);
  const showAddProductModal = (action) => {
    if (action === "ADD" && editProductModal) {
      setEditProductModal(false);
      productContext.setState(initState);
    }
    setOpenProductModal(true);
  };
  const hideAddProductModal = () => {
    console.log("close modal");
    setOpenProductModal(false);
  };

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

  //// set edit product
  const [editProductModal, setEditProductModal] = useState(false);

  const setEditProduct = (prod) => {
    console.log("setEditProduct:", prod);
    setEditProductModal(true);
    productContext.setState(prod);
    showAddProductModal("EDIT");
  };
  // Delete product from firebase and update allProductsContext state
  const handleDeleteProduct = (prod_id) => {
    const res = productAPI.deleteProduct(prod_id);
    res
      .then((resData) => {
        if (resData.success) {
          setMessage({
            text: "Product deleted successfully !",
            type: "success",
          });
          showSnackbar();
          const productIndex = allProductsContext.state.findIndex(
            (obj) => obj.id === prod_id
          );
          const products_ = [...allProductsContext.state];
          products_.splice(productIndex, 1);
          allProductsContext.setState(products_);
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

  const generateRandomString = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  /// Add/Update product into firebase
  const handleSetProduct = (
    action = "ADD",
    prod_id = null,
    data = productContext.state
  ) => {
    console.log("action: ", action, " prod_id: ", prod_id, " data:", data);

    if (prod_id === null || prod_id === "") {
      prod_id = data.title.trim().toUpperCase();
      prod_id = prod_id.substring(0, 10);
      prod_id = prod_id.replace(/ /g, "_");
      // Generate a random string to make sure the id is unique
      let randomStr = generateRandomString(10);
      prod_id = prod_id + randomStr;
    } else {
      prod_id = prod_id.trim();
      prod_id = prod_id.replace(/ /g, "_");
    }
    console.log(" prod_id now: ", prod_id);

    // API to add product data to firestore
    const res = productAPI.setProduct({
      id: prod_id,
      payload: {...data, id: prod_id},
    });
    res
      .then((resData) => {
        if (resData.success) {
          let action_msg = action === "ADD" ? "added" : "updated";
          setMessage({
            text: "Product " + action_msg + " successfully !",
            type: "success",
          });
          showSnackbar();

          if (action === "ADD") {
            productContext.setState({
              ...data,
              id: prod_id,
              createdAt: {seconds: Date.now() / 1000},
            });

            allProductsContext.setState([
              {
                ...data,
                id: prod_id,
                createdAt: {seconds: Date.now() / 1000},
              },
              ...allProductsContext.state,
            ]);
          } else {
            const productIndex = allProductsContext.state.findIndex(
              (obj) => obj.id === prod_id
            );
            const products_ = [...allProductsContext.state];
            products_[productIndex] = {...products_[productIndex], ...data};
            allProductsContext.setState(products_);
          }
          productContext.setState(initState);
          hideAddProductModal();
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
  //// Columns for Products DataGrid
  const columns = [
    {
      field: "images",
      headerName: "Image",
      width: 60,
      renderCell: (params) => {
        if (params.row.images.length > 0) {
          return <Avatar src={params.row.images[0].url} />;
        }
        return (
          <Avatar>
            <ImageIcon />
          </Avatar>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: "id",
      headerName: "Product Id (SKU)",
      width: 120,
    },
    {field: "title", headerName: "Title", width: 250},
    {
      field: "categories",
      headerName: "Categories",
      width: 150,
      cellClass: "multiline",
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {params.row.categories.join(", ").replace(/_/g, " ")}
          </div>
        );
      },
    },
    {
      field: "parentCategory",
      headerName: "Parent Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {params.row.parentCategory ? params.row.parentCategory.name : "-"}
          </div>
        );
      },
    },
    {field: "netQuantity", headerName: "Net Quantity", width: 80},
    {field: "unitType", headerName: "Unit type", width: 80},
    {field: "maxPrice", headerName: "MRP", width: 80},
    {field: "listPrice", headerName: "List Price", width: 80},
    {field: "unitsInStock", headerName: "Units", width: 60},
    {
      field: "visible",
      headerName: "Visibility",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {params.row.visible ? "Visible" : "Hidden"}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created at",
      width: 170,
      renderCell: (params) => {
        const t = new Date(
          params.row.createdAt.seconds * 1000
        ).toLocaleString();
        return <div className="rowitem">{t}</div>;
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 130,
      renderCell: (params) => (
        <DataGridActions
          {...{params}}
          onEdit={setEditProduct}
          onDelete={handleDeleteProduct}
          onVisibilityChange={handleSetProduct}
        />
      ),
    },
  ];
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
          Products
        </Typography>
      </Box>
      <Grid2 container spacing={2}>
        <Grid2>
          <CustomButton
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => showAddProductModal("ADD")}
          >
            Add Product
          </CustomButton>
        </Grid2>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openProductModal}
          onClose={hideAddProductModal}
          closeAfterTransition
        >
          <Fade in={openProductModal}>
            <Box sx={styles.boxStyle}>
              <AddProduct
                action={editProductModal ? "EDIT" : "ADD"}
                handleSetProduct={handleSetProduct}
                hideModal={hideAddProductModal}
              />
            </Box>
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

        <Grid2 xs={12} mt={2}>
          <CustomDataGrid
            rows={allProductsContext.state}
            columns={columns}
            styles={{height: "540px"}}
            initialState={{
              sorting: {
                sortModel: [{field: "createdAt", sort: "desc"}],
              },
            }}
            pageSizes={[10, 25, 50]}
          />
        </Grid2>
      </Grid2>
    </>
  );
};

export default ProductsListAdmin;
