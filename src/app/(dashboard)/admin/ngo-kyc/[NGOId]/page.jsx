/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { City, Country, State } from "country-state-city";
import moment from "moment";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

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
import Utils from "@/Utils";

const Kyc = ({ type = "ngo", params }) => {
  const [modalText, setModalText] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [formData, setFormData] = useState({
    role: type == ROLES.NGO ? ROLES.NGO : ROLES.COMPANY,
  });

  const { NGOId } = params;
  const queryParams = useSearchParams();
  const redirectUrl = queryParams?.get('redirectUrl')

  //   const [addressForm, setAddressForm] = useState({
  //     country: "",
  //     state: "",
  //     city: "",
  //   });

  // Hooks for router navigation and dispatching actions
  const router = useRouter();
  const dispatch = useDispatch();

  // Function to display toast messages
  const showMessage = (type, msg) =>
    dispatch(setToast({ type: type, message: msg }));

  const { user } = useSelector((state) => state.appReducer);
  const prevData = useRef({});
  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setCheckEmail(true);
    }
    let formattedValue = value;
    if (name === "regNumber") {
      formattedValue = value?.length <= 20 ? value : formData[name];
    }
    if (name === "postalCode") {
      formattedValue = value?.length <= 10 ? value : formData[name];
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    const {
      email,
      registrationStatus,
      profileImage,
      bannerImage,
      role,
      id,
      status,
      createdAt,
      updatedAt,
      otpResendAttempts,
      _v,
      followerCount,
      certificateOfReg,
      followed,
      resetPasswordLinkUsed,
      isOnline,
      lastOnline,
      activationStatus,
      csrPolicyDoc,
      ...rest
    } = formData;
    e.preventDefault();
    // Updated Form Data
    const newFD = {
      ...rest,
      ...(formData?.dateOfReg && {
        dateOfReg: formData.dateOfReg,
        ...(email != prevData?.current?.email && {
          email: email.toLowerCase(),
        }),
        ...(typeof profileImage === "string" ? {} : { profileImage }),
        ...(typeof bannerImage === "string" ? {} : { bannerImage }),
        ...(typeof certificateOfReg === "string" ? {} : { certificateOfReg }),
      }),
      // country: addressForm?.country?.name,
      // state: addressForm?.state?.name,
      // city: addressForm?.city?.name,
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
    } else {
      try {
        dispatch(handleLoader(true));
        let { data } = await ApiManager({
          method: "patch",
          path: `ngo/${NGOId}`,
          params: newFD,
          header: { "Content-Type": "multipart/form-data" },
        });
        showMessage("success", data?.message);
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push("/admin/ngos");
        }
      } catch (error) {
        if (error?.code == "ERR_NETWORK") {
          showMessage("error", error?.message);
        } else if (error?.response?.status == 422) {
          setFormErrors(error?.response?.data?.details);
          showMessage("error", error?.response?.data?.message);
        } else {
          showMessage("error", error?.response?.data?.message);
        }
      } finally {
        dispatch(handleLoader(false));
      }
    }
  };

  const getSingleNgo = async () => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({ path: `ngo/${NGOId}` });
      setFormData(data?.response?.details);
      prevData.current = data?.response?.details;
      setImagePreview({
        bannerImage: data?.response?.details?.bannerImage,
        profileImage: data?.response?.details?.profileImage,
        certificateOfReg: data?.response?.details?.certificateOfReg,
      });
      //   dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  // Countries State Cities selector.
  // const countries = Country.getAllCountries();
  // const updatedCountries = countries.map((country) => ({
  //   label: country.name,
  //   value: country.isoCode,
  //   ...country,
  // }));
  // const updatedStates = (countryId) =>
  //   State.getStatesOfCountry(countryId).map((state) => ({
  //     label: state.name,
  //     value: state.isoCode,
  //     ...state,
  //   }));

  // const updatedCities = (countryId, stateId) =>
  //   City.getCitiesOfState(countryId, stateId).map((city) => ({
  //     label: city.name,
  //     value: city.label,
  //     ...city,
  //   }));

  const refs = inputRef.reduce((acc, refName) => {
    acc[refName] = useRef(null);
    return acc;
  }, {});

  useEffect(() => {
    getSingleNgo();
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
          Update NGO KYC Form
        </Typography>
        <Box mt="41px" sx={{ position: "relative" }}>
          <BannerPicker
            ref={refs["bannerImage"]}
            onImageSelect={(img) => {
              setFormData((prev) => ({ ...prev, bannerImage: img[0]?.file }));
              setImagePreview((prev) => ({
                ...prev,
                bannerImage: null,
              }));
            }}
            previewImage={imagePreview?.bannerImage}
            error={formErrors?.bannerImage}
            value={formData?.bannerImage}
            showDelete={false}
          />
          <Box sx={{ position: "absolute", top: 100, left: 50, zIndex: 3 }}>
            <ProfilePicker
              ref={refs["profileImage"]}
              onImageSelect={(img) => {
                setFormData((prev) => ({
                  ...prev,
                  profileImage: img[0]?.file,
                }));
                setImagePreview((prev) => ({
                  ...prev,
                  profileImage: null,
                }));
              }}
              previewImage={imagePreview?.profileImage}
              error={formErrors?.profileImage}
              value={formData?.profileImage}
            />
          </Box>
        </Box>

        <Stack mt={"120px"} spacing={6}>
          {/* ----------------------------- Organization Details (START) -----------------------------*/}
          <Box>
            <Typography variant="h6" color="text.hint" fontWeight="bold">
              Organization Details
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["name"]}
                  required
                  label={`${type == ROLES.NGO ? Utils.capitalize(ROLES.NGO) : Utils.capitalize(ROLES.COMPANY)} Name`}
                  name="name"
                  value={formData?.name}
                  error={formErrors?.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  ref={refs["regNumber"]}
                  label="Registration Number"
                  type="number"
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
                  ref={refs["taxIdentificationNumber"]}
                  label="Tax Identification Number"
                  name="taxIdentificationNumber"
                  value={formData?.taxIdentificationNumber}
                  error={formErrors?.taxIdentificationNumber}
                  onChange={handleInputChange}
                />
                {/* <FormattedInputs
                  ref={refs["taxIdentificationNumber"]}
                  label="Tax Identification Number"
                  name="taxIdentificationNumber"
                  value={formData?.taxIdentificationNumber}
                  // value={formData?.taxIdentificationNumber}
                  error={formErrors?.taxIdentificationNumber}
                  handleInput={handleInputChange}
                  textMask="00-0000000"
                /> */}
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- Organization Details (END) -----------------------------*/}

          {/* ----------------------------- Address (Start) -----------------------------*/}
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
                      ref={refs["country"]}
                      required
                      label="Country"
                      name="country"
                      value={formData?.country}
                      error={formErrors?.country}
                      onChange={handleInputChange}
                    />
                    {/* <Autocomplete
                        name="country"
                        fullWidth
                        options={updatedCountries}
                        value={addressForm?.country}
                        onChange={(event, value) =>
                          setAddressForm((prevData) => ({
                            ...prevData,
                            country: value,
                            state: "",
                            city: "",
                          }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!formErrors?.state}
                            label={"Country*"}
                            value={addressForm?.country}
                            variant="outlined"
                            fullWidth
                            helperText={formErrors?.state}
                          />
                        )}
                      /> */}
                    {/* {renderAutocomplete(
                      "country",
                      "Country*",
                      updatedCountries,
                      addressForm?.country,
                      (value) =>
                        setAddressForm((prevData) => ({
                          ...prevData,
                          country: value,
                          state: null,
                          city: null,
                          })),
                          formErrors?.country
                          )} */}
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
                    {/* <Autocomplete
                        name="state"
                        fullWidth
                        value={addressForm?.state}
                        options={updatedStates(addressForm?.country?.value)}
                        onChange={(event, value) =>
                          setAddressForm((prevData) => ({
                            ...prevData,
                            state: value,
                            city: "",
                          }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!formErrors?.state}
                            label={"State/Province*"}
                            value={addressForm?.state}
                            variant="outlined"
                            fullWidth
                            helperText={formErrors?.state}
                          />
                        )}
                      /> */}
                    {/* {renderAutocomplete(
                      "state",
                      "State/Province*",
                      updatedStates(addressForm?.country ? addressForm?.country?.value : null),
                      formData?.address?.state,
                      (value) =>
                        setAddressForm((prevData) => ({
                          ...prevData,
                          state: value,
                          city: null,
                        })),
                      formErrors?.state
                    )} */}
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
                    {/* {renderAutocomplete(
                        "city",
                        "City*",
                        updatedCities(
                          addressForm?.state ? addressForm?.state.countryCode : null,
                          addressForm?.state ? addressForm?.state.isoCode : null
                        ),
                        addressForm?.city,
                        (value) =>
                          setAddressForm((prevData) => ({
                            ...prevData,
                            city: value,
                          })),
                        formErrors?.city
                      )} */}
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      required
                      ref={refs["postalCode"]}
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
                  ref={refs["lastName"]}
                  required
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
                {/* <BannerPicker
                    title="Upload Image"
                    onImageSelect={(img) => {
                      setFormData((prev) => ({ ...prev, certificateOfReg: img[0]?.file }));
                    }}
                    value={formData?.certificateOfReg}
                    formError={formErrors?.certificateOfReg}
                  /> */}
              </Box>
            </Stack>
          </Box>

          {/* ----------------------------- Documents (END) -----------------------------*/}

          {/* ----------------------------- END -----------------------------*/}
          <Box>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <SecondaryButton onClick={() => router.back()}>
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

// Countries State Cities autocomplete selector.
const renderAutocomplete = (id, label, options, value, onChange, error) => {
  return (
    <Autocomplete
      id={id}
      name={id}
      fullWidth
      options={options}
      value={value}
      onChange={(event, value) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          value={value}
          error={!!error}
          label={label}
          variant="outlined"
          fullWidth
          helperText={error}
        />
      )}
    />
  );
};
