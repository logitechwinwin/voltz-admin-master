/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { ArrowBackIosIcon } from "@/assets";
import {
  BannerPicker,
  DatePicker,
  FilePicker,
  FormattedInputs,
  InputField,
  KycDialogBox,
  PrimaryButton,
  ProfilePicker,
  SecondaryButton,
} from "@/component";
import { inputRef, ROLES } from "@/constant";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const Kyc = ({ type = "ngo", params }) => {
  const { CompanyId } = params;
  const [modalText, setModalText] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    role: type == ROLES.NGO ? ROLES.NGO : ROLES.COMPANY,
  });

  const queryParams = useSearchParams();
  const redirectUrl = queryParams?.get('redirectUrl')
  // Hooks for router navigation and dispatching actions
  const router = useRouter();
  const dispatch = useDispatch();
  const prevData = useRef({});

  // Function to display toast messages
  const showMessage = (type, msg) =>
    dispatch(setToast({ type: type, message: msg }));
  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "regNumber") {
      formattedValue = value?.length <= 20 ? value : formData[name];
    }
    if (name === "postalCode") {
      formattedValue = value?.length <= 10 ? value : formData[name];
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  useEffect(() => {
    console.log('formData', formData);

  }, [formData])


  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      resetPasswordLinkUsed,
      email,
      registrationStatus,
      role,
      status,
      createdAt,
      updatedAt,
      otpResendAttempts,
      _v,
      profileImage,
      bannerImage,
      certificateOfReg,
      csrPolicyDoc,
      id,
      isFollowed,
      isOnline,
      lastOnline,
      activationStatus,
      ...rest
    } = formData;
    console.log("rest", rest);
    // Updated Form Data
    let newFD = {
      ...rest,
      ...(formData?.dateOfReg && {
        dateOfReg: formData.dateOfReg,
      }),
      ...(email != prevData?.current?.email && { email: email.toLowerCase() }),
      ...(typeof profileImage === "string" ? {} : { profileImage }),
      ...(typeof bannerImage === "string" ? {} : { bannerImage }),
      ...(typeof certificateOfReg === "string" ? {} : { certificateOfReg }),
      ...(typeof csrPolicyDoc === "string" ? {} : { csrPolicyDoc }),
    };
    setFormErrors({});
    if (!formData?.profileImage) {
      setFormErrors((prev) => ({
        ...prev,
        profileImage: "Please upload a profile image",
      }));
    } else if (!formData?.bannerImage) {
      setFormErrors((prev) => ({
        ...prev,
        bannerImage: "Please upload a Banner image",
      }));
    } else if (!formData?.certificateOfReg) {
      setFormErrors((prev) => ({
        ...prev,
        certificateOfReg: "Please upload a Certificate of registration ",
      }));
    } else if (!formData?.csrPolicyDoc) {
      setFormErrors((prev) => ({
        ...prev,
        csrPolicyDoc: "Please upload a CSR document ",
      }));
    } else {
      try {
        dispatch(handleLoader(true));
        let { data } = await ApiManager({
          method: "patch",
          path: `company/${CompanyId}`,
          params: newFD,
          header: { "Content-Type": "multipart/form-data" },
        });
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push("/admin/companies");
        }
        showMessage("success", data?.message);
      } catch (error) {
        if (error?.code == "ERR_NETWORK") {
          showMessage("error", error?.message);
        } else if (error?.response?.status == 422) {
          setFormErrors(error?.response?.data?.details);
        } else {
          showMessage("error", error?.response?.data?.message);
        }
      } finally {
        dispatch(handleLoader(false));
      }
    }
  };

  const getSingleCompany = async () => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({ path: `company/${CompanyId}` });
      console.log("data?.message", data);
      setFormData(data?.response?.details);
      prevData.current = data?.response?.details;
      setImagePreview({
        profileImage: data?.response?.details?.profileImage,
        bannerImage: data?.response?.details?.bannerImage,
        certificateOfReg: data?.response?.details?.certificateOfReg,
        csrPolicyDoc: data?.response?.details?.csrPolicyDoc,
      });
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const refs = inputRef.reduce((acc, refName) => {
    acc[refName] = useRef(null);
    return acc;
  }, {});

  useEffect(() => {
    getSingleCompany();
  }, []);

  useEffect(() => {
    const firstErrorField = Object.keys(formErrors)[0];
    const errorFields = Object.keys(formErrors);

    if (
      errorFields?.includes("profileImage") ||
      errorFields?.includes("bannerImage")
    ) {
      refs["name"].current?.focus();
    }
    if (firstErrorField && refs[firstErrorField]) {
      refs[firstErrorField].current?.focus();
    }
  }, [formErrors]);

  return (
    <Container py={6}>
      <Box component={"form"} onSubmit={handleSubmit} py={7}>
        <Button
          startIcon={<ArrowBackIosIcon />}
          sx={{ mb: 4 }}
          onClick={() => router.back()}
        >
          Back
        </Button>

        <Typography variant="h4" fontWeight={"bold"}>
          Company KYC Form
        </Typography>
        <Box mt="41px" sx={{ position: "relative" }}>
          <BannerPicker
            previewImage={imagePreview?.bannerImage}
            onImageSelect={(img) => {
              const url = URL.createObjectURL(img[0]?.file);
              setFormData((prev) => ({ ...prev, bannerImage: img[0]?.file }));
              setImagePreview((prev) => ({
                ...prev,
                bannerImage: url,
              }));
            }}
            error={formErrors?.bannerImage}
            value={formData?.bannerImage}
            showDelete={false}
          />
          <Box sx={{ position: "absolute", top: 100, left: 50, zIndex: 3 }}>
            <ProfilePicker
              previewImage={imagePreview?.profileImage}
              ref={refs["profileImage"]}
              onImageSelect={(img) => {
                setFormData((prev) => ({
                  ...prev,
                  profileImage: img[0]?.file,
                }));
              }}
              error={formErrors?.profileImage}
              value={formData?.profileImage}
            />
          </Box>
        </Box>

        <Stack mt={"120px"} spacing={6}>
          {/* ----------------------------- Organization Details (START) -----------------------------*/}
          <Box>
            <Typography variant="h6" color="text.hint" fontWeight="bold">
              Company Details
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  ref={refs["name"]}
                  label={`Company Name`}
                  name="name"
                  value={formData?.name}
                  error={formErrors?.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="Registration Number"
                  type="number"
                  ref={refs["regNumber"]}
                  name="regNumber"
                  value={formData?.regNumber}
                  error={formErrors?.regNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePicker
                  maxDate={moment()}
                  ref={refs["dateOfReg"]}
                  label="Date of Incorporation*"
                  name="dateOfReg"
                  value={moment(formData?.dateOfReg)}
                  error={formErrors?.dateOfReg}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="Tax Identification Number"
                  ref={refs["taxIdentificationNumber"]}
                  name="taxIdentificationNumber"
                  value={formData?.taxIdentificationNumber}
                  error={formErrors?.taxIdentificationNumber}
                  onChange={handleInputChange}
                />
                {/* <FormattedInputs
                  label="Tax Identification Number"
                  ref={refs["taxIdentificationNumber"]}
                  name="taxIdentificationNumber"
                  value={formData?.taxIdentificationNumber}
                  error={formErrors?.taxIdentificationNumber}
                  handleInput={handleInputChange}
                  textMask="00-0000000"
                /> */}
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="h6" color="text.hint" fontWeight="bold">
              Address
            </Typography>
            <Stack mt={"20px"} spacing={3}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputField
                      ref={refs["streetAddress"]}
                      required
                      label="Street Address"
                      name="streetAddress"
                      value={formData?.streetAddress}
                      error={formErrors?.streetAddress}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      required
                      ref={refs["country"]}
                      label="Country"
                      name="country"
                      value={formData?.country}
                      error={formErrors?.country}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      ref={refs["state"]}
                      required
                      label="State"
                      name="state"
                      value={formData?.state}
                      error={formErrors?.state}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      ref={refs["city"]}
                      required
                      label="City"
                      name="city"
                      value={formData?.city}
                      error={formErrors?.city}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      ref={refs["postalCode"]}
                      required
                      label="Postal Code"
                      name="postalCode"
                      value={formData?.postalCode}
                      error={formErrors?.postalCode}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Box>
          {/* ----------------------------- Address (End) -----------------------------*/}

          {/* ----------------------------- Key Personnel (Start) -----------------------------*/}
          <Box>
            <Typography variant="h6" color="text.hint" fontWeight="bold">
              Key Personnel
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["firstName"]}
                  required
                  label="First Name"
                  name="firstName"
                  value={formData?.firstName}
                  error={formErrors?.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  ref={refs["lastName"]}
                  label="Last Name"
                  name="lastName"
                  value={formData?.lastName}
                  error={formErrors?.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  ref={refs["email"]}
                  required
                  label="Email"
                  name="email"
                  value={formData?.email}
                  error={formErrors?.email}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- Key Personnel (End) -----------------------------*/}

          {/* ----------------------------- Documents (Start) -----------------------------*/}
          <Box>
            <Typography variant="h6" color="text.hint" fontWeight="bold">
              Documents
            </Typography>
            <Stack spacing={3} mt={"20px"}>
              <Box>
                <Typography
                  variant="h6"
                  color="text.hint"
                  fontWeight="400"
                  gutterBottom
                >
                  Certificate of Registration
                </Typography>
                <FilePicker
                  previewImage={imagePreview?.certificateOfReg}
                  onImageSelect={(img) => {
                    const url = URL.createObjectURL(img[0]?.file);
                    setFormData((prev) => ({
                      ...prev,
                      certificateOfReg: img[0]?.file,
                    }));
                    setImagePreview((prev) => ({
                      ...prev,
                      certificateOfReg: url,
                    }));
                  }}
                  error={formErrors?.certificateOfReg}
                  showDelete={false}
                />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  color="text.hint"
                  fontWeight="400"
                  gutterBottom
                >
                  CSR Policy Document
                </Typography>
                <FilePicker
                  previewImage={imagePreview?.csrPolicyDoc}
                  onImageSelect={(img) => {
                    const url = URL.createObjectURL(img[0]?.file);
                    setFormData((prev) => ({
                      ...prev,
                      csrPolicyDoc: img[0]?.file,
                    }));
                    setImagePreview((prev) => ({
                      ...prev,
                      csrPolicyDoc: url,
                    }));
                  }}
                  error={formErrors?.csrPolicyDoc}
                  showDelete={false}
                />
              </Box>
            </Stack>
          </Box>

          {/* ----------------------------- Documents (END) -----------------------------*/}

          {/* ----------------------------- END -----------------------------*/}
          <Box>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <SecondaryButton
                  onClick={() => {
                    router.back();
                  }}
                >
                  Cancel
                </SecondaryButton>
              </Grid>
              <Grid item sm={6} xs={12}>
                <PrimaryButton type="submit">Update</PrimaryButton>
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- END -----------------------------*/}
        </Stack>
      </Box>
      <KycDialogBox
        message={modalText}
        handleClose={() => {
          setModalText("");
          router.push("/login");
        }}
      />
    </Container>
  );
};

export default Kyc;
