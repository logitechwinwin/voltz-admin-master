"use client";
import { ArrowBackIosIcon, Voltz } from "@/assets";
import {
  BannerPicker,
  DatePicker,
  InputField,
  PrimaryButton,
  SecondaryButton,
  SelectBox,
} from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreateDeal = ({ params }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useSelector((state) => state.appReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  const { dealId } = params;

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;
    if (name === "dealAmount") {
      const formattedValue = parseFloat(value).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(formattedValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log("🚀 ~ handleSubmit ~ rest:");
    e.preventDefault();
    dispatch(handleLoader(true));
    setFormErrors({});
    const {
      products,
      bannerImage,
      id,
      createdAt,
      updatedAt,
      user: newUser,
      category,
      availCount,
      isSaved,
      dealAmountAfterDiscount,
      activationStatus,
      ...rest
    } = formData;

    if (dealId && new Date(formData.from) < new Date()) {
      delete rest.from;
    }
    if (formData.about === "") {
      delete rest.about;
    }
    if (products?.length < 1) {
      setFormErrors((prev) => ({
        ...prev,
        products: "Select at least one product",
      }));
      dispatch(handleLoader(false));
      return;
    }
    if (category?.length < 1) {
      setFormErrors((prev) => ({
        ...prev,
        category: "Select at least one category",
      }));
      dispatch(handleLoader(false));
      return;
    }

    try {
      let { data } = await ApiManager({
        method: dealId ? "patch" : "post",
        path: dealId ? `deal/${dealId}` : `deal`,
        params: {
          ...rest,
          products: formData?.products?.length
            ? formData?.products?.map((product) => product?.id)
            : [],
          category: formData?.category?.map((category) => category?.id),
          ...(typeof formData?.bannerImage === "string"
            ? {}
            : { bannerImage: formData?.bannerImage }),
        },
        header: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setToast({ type: "success", message: data?.message }));
      router.push("/company/deals");
      console.log("data", data);
    } catch (error) {
      if (error?.response?.data?.statusCode === 422) {
        console.log(error?.response?.data);
        setFormErrors(error?.response?.data?.details);
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const getSingleDeal = async () => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({ path: `deal/${dealId}` });
      setFormData(data?.response?.details);
      setImagePreview(data?.response?.details?.bannerImage);
      // dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const fetchDependencies = async () => {
    dispatch(handleLoader(true));
    try {
      const [getProducts, getCategories] = await Promise.all([
        ApiManager({ path: `product?page=1&perPage=99999&userId=${user?.id}` }),
        ApiManager({ path: `category?page=1&perPage=99999` }),
      ]);
      const filteredProduct = getProducts?.data?.response?.details?.items?.map(
        (product) => ({
          id: product?.id,
          name: product?.name,
        })
      );

      const filteredCategory = getCategories?.data?.response?.details?.map(
        (category) => ({
          id: category?.id,
          label: category?.label,
        })
      );
      setProducts(filteredProduct);
      setCategories(filteredCategory);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  useEffect(() => {
    fetchDependencies();
    if (dealId) {
      getSingleDeal();
    }
  }, []);

  return (
    <Stack gap={4} py={5} component="form" onSubmit={handleSubmit}>
      <Button
        startIcon={<ArrowBackIosIcon />}
        sx={{ alignSelf: "start" }}
        onClick={() => router.back()}
      >
        Back
      </Button>
      <Typography variant="h4" fontWeight={"bold"}>
        {dealId ? "Update Deal" : "Create Deal"}
      </Typography>
      <BannerPicker
        title="Upload Deal Image"
        onImageSelect={(img) => {
          setFormData((prev) => ({ ...prev, bannerImage: img[0]?.file }));
          setImagePreview(null);
        }}
        error={formErrors?.bannerImage}
        previewImage={imagePreview}
      />
      <Stack gap={3}>
        <Typography variant="h6" color="text.hint" fontWeight="bold">
          Deal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <InputField
              required
              error={formErrors?.dealName}
              label="Deal Name"
              name="dealName"
              value={formData?.dealName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <InputField
              required
              name="dealAmount"
              error={formErrors?.dealAmount}
              value={formData?.dealAmount}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ mr: 0.5 }}> {"$"}</InputAdornment>
                ),
              }}
              label="Product Price"
              type="number"
            />
          </Grid>
        </Grid>
      </Stack>
      <Stack gap={3}>
        <Typography variant="h6" color="text.hint" fontWeight="bold">
          Discount Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <SelectBox
              required
              name="discountType"
              label="Select Discount Type"
              optionRenderKeys={{
                name: "name",
                value: "value",
              }}
              items={[
                { name: "Percentage", value: "percentage" },
                { name: "Fixed", value: "fixed" },
              ]}
              value={formData?.discountType}
              error={formErrors?.discountType}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <InputField
              required
              type="number"
              label="Discount"
              value={formData?.discountAmount}
              error={formErrors?.discountAmount}
              name="discountAmount"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ mr: 0.5 }}>
                    {formData?.discountType === "fixed" ? "$" : "%"}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Typography
          variant="h6"
          color="text.hint"
          fontWeight="bold"
          gutterBottom
        >
          Deal Validity
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <DatePicker
              type="datetime"
              required
              name="from"
              error={formErrors?.from && "Start date cannot be in the past"}
              minDateTime={moment()}
              value={moment(formData?.from)}
              onChange={handleInputChange}
              label="From"
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <DatePicker
              type="datetime"
              required
              name="to"
              error={formErrors?.to && "End date must be after Start date"}
              minDateTime={moment(formData?.from)}
              value={moment(formData?.to)}
              onChange={handleInputChange}
              label="To"
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </Stack>
      <Stack gap={2}>
        <Typography
          variant="h6"
          color="text.hint"
          fontWeight="bold"
          gutterBottom
        >
          Requirements & Eligibility
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <InputField
              required
              name="voltzRequired"
              error={formErrors?.voltzRequired}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Image src={Voltz} alt="logo" />
                  </InputAdornment>
                ),
              }}
              label="Voltz"
              value={formData?.voltzRequired}
              type="number"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={products}
              getOptionLabel={(option) => option?.name}
              // getOptionSelected={(option, value) => option.id === value.id}

              renderInput={(params) => (
                <TextField
                  name="products"
                  {...params}
                  label="Products"
                  placeholder="Select Products"
                  error={formErrors?.products}
                  helperText={formErrors?.products}
                />
              )}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              error={formErrors?.products}
              value={
                formData?.products?.length
                  ? formData?.products?.map((product) => ({
                      id: product?.id,
                      name: product?.name,
                    }))
                  : []
              }
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, products: val }));
              }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={categories}
              getOptionLabel={(option) => option?.label}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              getOptionSelected={(option, value) => option.id === value.id}
              value={
                formData?.category?.length
                  ? formData?.category?.map((category) => ({
                      id: category.id,
                      label: category?.label,
                    }))
                  : []
              }
              renderInput={(params) => (
                <TextField
                  name="category"
                  {...params}
                  label="Categories"
                  placeholder="Select Categories"
                  error={formErrors?.category}
                  helperText={formErrors?.category}
                />
              )}
              error={formErrors?.category}
              onChange={(e, val) =>
                setFormData((prev) => ({ ...prev, category: val }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <InputField
              label="About"
              error={formErrors?.about}
              name="about"
              value={formData?.about}
              onChange={handleInputChange}
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </Stack>
      {/* <Stack mt={"20px"}>
        <Typography variant="h6" color="text.hint" fontWeight="400" gutterBottom>
          Redemption
        </Typography>

        <CheckBox label="Public" />
        <CheckBox label="Restricted" />
      </Stack> */}
      <Box width={{ xs: "100%", sm: "56%", lg: "46%" }} mx="auto">
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <SecondaryButton onClick={() => router.back()}>
              Cancel
            </SecondaryButton>
          </Grid>
          <Grid item sm={6} xs={12}>
            <PrimaryButton type="submit">
              {dealId ? "Update" : "Submit"}
            </PrimaryButton>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default CreateDeal;
