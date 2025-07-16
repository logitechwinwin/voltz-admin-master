/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import { Add, Height, Padding } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { Voltz } from "@/assets";
import {
  BannerPicker,
  DeleteDialogBox,
  FilePicker,
  InputField,
  ModalWrapper,
  SecondaryButton,
  SelectBox,
  TableWrapper,
} from "@/component";
import BasicMenu from "@/component/Menu/Menu";
import { ApiManager } from "@/helpers";
import useQueryParams from "@/hooks/useQueryParams";
import { handleLoader, setToast } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "@/component/TableContainer/TableContainer";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const { queryParams, setQueryParams } = useQueryParams({ page: 0 });
  const [page, setPage] = useState(+queryParams?.page);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const matches = useMediaQuery("(max-width:430px)")
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  const getProducts = async () => {
    setLoading(true)
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `product?page=${page + 1}&perPage=${itemsPerPage}&userId=${user?.id}`,
      });
      setProducts(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false)
    }
  };
  const handlePagination = (_, count) => {
    setPage(count);
    setQueryParams("page", count);
  };
  const deleteProduct = async (product) => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "delete",
        path: `product/${product?.id}`,
      });
      console.log("data?.message", data);
      dispatch(setToast({ type: "success", message: data?.message }));
      getProducts();
      setOpenDelete(false);
      setDeleteId(null);
    } catch (error) {
      dispatch(
        setToast({ type: "error", message: error?.response?.data?.message })
      );
      console.log("error", error);
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData };
    const { id, createdAt, updatedAt, ...rest } = updatedFormData;
    if (imagePreview) {
      delete rest.image;
    }
    if (!formData?.image) {
      dispatch(setToast({ type: "error", message: "Select Product Image" }));
    } else {
      dispatch(handleLoader(true));

      try {
        let { data } = await ApiManager({
          method: editProduct ? "patch" : "post",
          path: editProduct ? `product/${editProduct?.id}` : `product`,
          params: editProduct ? { ...rest } : formData,
          header: {
            "Content-Type": "multipart/form-data",
          },
        });

        setOpen(false);
        getProducts();
        dispatch(setToast({ type: "success", message: data?.message }));
      } catch (error) {
        if (error?.response?.data?.statusCode === 422) {
          setFormErrors(error?.response?.data?.details);
        } else {
          dispatch(setToast({ type: "error", message: error?.message }));
        }
      } finally {
        dispatch(handleLoader(false));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "price") {
      // Allow only numbers and up to two decimal places
      formattedValue = value.match(/^\d*\.?\d{0,2}$/) ? value : formData[name];
    }
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const RenderRow = ({ product }) => {
    const [openMenu, setOpenMenu] = useState(false);
    return (
      <TableRow>
        <TableCell sx={{ maxWidth: "140px" }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: 0.5, sm: 1, md: 2 }}
          >
            <Avatar variant="rounded" src={product?.image} />
            <Typography fontWeight="Medium">
              {Utils.limitStringWithEllipsis(product?.name, 16)}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{`$${product?.price}`}</TableCell>
        <TableCell>{moment(product?.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>

        <TableCell>
          <BasicMenu setOpenMenu={setOpenMenu} openMenu={openMenu}>
            <MenuItem
              onClick={() => {
                setOpen(true);
                setEditProduct(product);
                setFormData(product);
                setImagePreview(product?.image);
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                setOpenDelete(true);
                setDeleteId(product);
              }}
            >
              Delete
            </MenuItem>
          </BasicMenu>
        </TableCell>
      </TableRow>
    );
  };

  useEffect(() => {
    getProducts();
  }, [page, itemsPerPage]);
  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        mb={"30px"}
        justifyContent="space-between"
      >
        <Typography variant="h4" fontWeight="SemiBold">
          Products
        </Typography>
        <Stack
          alignSelf="flex-end"
          width={{ xs: "100%", sm: "38%", md: "26%", lg: "18%" }}
        >
          <SecondaryButton
            onClick={() => {
              setOpen(true);
              setImagePreview(null);
              setEditProduct(null);
              setFormData(null);
            }}
            startIcon={<Add />}
            fullWidth
            size="large"
          >
            Create Product
          </SecondaryButton>
        </Stack>
      </Stack>
      <Stack sx={{ minHeight: "600px" }}>
        <UITable
          headings={["Name", "Price", "Created At", "Actions"]}
          spanTd={4}
          isContent={products?.items?.length}
          loading={loading}
          handlePageChange={handlePagination}
          handleRowsPerPageChange={handleRowsPerPageChange}
          itemsPerPage={itemsPerPage}
          count={products?.meta?.totalItems}
          page={page}
        >
          {products?.items?.map((product, i) => (
            <RenderRow
              key={i}
              open={open}
              setOpen={setOpen}
              product={product}
            />
          ))}
        </UITable>
      </Stack>
      <ModalWrapper
        open={open}
        handleClose={() => {
          setOpen(false);
          setFormData({});
          setFormErrors({});
        }}
      >
        <Stack
          py={3}
          gap={2}
          component="form"
          onSubmit={handleSubmit}
          overflow="auto"
        >
          <Typography variant="h5" fontWeight="bold">
            {editProduct ? "Update Product" : "Add Product"}
          </Typography>
          <InputField
            label="Name"
            name="name"
            value={formData?.name}
            onChange={handleInputChange}
            error={formErrors?.name}
          />
          <InputField
            type="number"
            InputProps={{
              startAdornment: <InputAdornment>$</InputAdornment>,
            }}
            label="Price"
            name="price"
            value={formData?.price}
            onChange={handleInputChange}
            error={formErrors?.price}
          />
          <InputField
            multiline
            minRows={3}
            label="Description"
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            error={formErrors?.description}
            maxRows={4}
          />
          <BannerPicker
            title="Upload Product Image"
            previewImage={imagePreview}
            onImageSelect={(img) => {
              const url = URL.createObjectURL(img[0]?.file);
              setFormData((prev) => ({ ...prev, image: img[0]?.file }));
              setImagePreview(null);
            }}
            error={formErrors?.image}
            value={formData?.image}
            showDelete={false}
          />
          {/* <FilePicker
            onImageSelect={(img) => {
              setFormData((prev) => ({
                ...prev,
                image: img[0]?.file,
              }));
              setImagePreview(null);
            }}
            error={formErrors?.image}
            previewImage={imagePreview}
          /> */}
          <Button variant="contained" type="submit">
            {editProduct ? "Update" : "Add"}
          </Button>
        </Stack>
      </ModalWrapper>
      <DeleteDialogBox
        name={deleteId?.name}
        title="Product"
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onClick={() => deleteProduct(deleteId)}
      />
    </Container>
  );
};

export default Deals;

const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
