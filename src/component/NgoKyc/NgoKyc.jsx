/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";

import { Autocomplete, Box, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import { City, Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { BannerPicker, DatePicker, FilePicker, InputField, KycDialogBox, PrimaryButton, ProfilePicker, SecondaryButton } from "@/component";
import { ROLES } from "@/constant";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";
import Utils from "@/Utils";

const Kyc = ({ type = "ngo" }) => {
  const [modalText, setModalText] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    role: type == ROLES.NGO ? ROLES.NGO : ROLES.COMPANY,
  });
  const [addressForm, setAddressForm] = useState({});

  // Hooks for router navigation and dispatching actions
  const router = useRouter();
  const dispatch = useDispatch();

  // Function to display toast messages
  const showMessage = (type, msg) => dispatch(setToast({ type: type, message: msg }));

  // Handle input change and update form data state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Updated Form Data
    const newFD = {
      ...formData,
      ...(formData?.dateOfReg && {
        dateOfReg: formData.dateOfReg.toISOString(),
      }),
      country: addressForm?.country?.name,
      state: addressForm?.state?.name,
      city: addressForm?.city?.name,
    };

    setFormErrors({});
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "post",
        path: `auth/${type == ROLES.NGO ? ROLES.NGO : ROLES.COMPANY}-kyc`,
        params: newFD,
        header: { "Content-Type": "multipart/form-data" },
      });
      setModalText(data?.message);
      setFormData({ role: type == ROLES.NGO ? ROLES.NGO : ROLES.COMPANY });
      console.log("🚀 ~ handleSubmit ~ data:", data);
    } catch (error) {
      console.log("error", error);

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
  };

  // Countries State Cities selector.
  const countries = Country.getAllCountries();
  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    ...country,
  }));
  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));

  const updatedCities = (countryId, stateId) =>
    City.getCitiesOfState(countryId, stateId).map((city) => ({
      label: city.name,
      value: city.label,
      ...city,
    }));

  return (
    <Container>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Typography variant="h4" fontWeight={"bold"}>
          {type == ROLES.NGO ? ROLES.NGO.toUpperCase() : ROLES.COMPANY.toUpperCase()} KYC Form
        </Typography>
        <Box mt="41px" sx={{ position: "relative" }}>
          <BannerPicker
            onImageSelect={(img) => {
              setFormData((prev) => ({ ...prev, bannerImage: img?.file }));
            }}
            formError={formErrors?.bannerImage}
          />
          <Box sx={{ position: "absolute", top: 160, left: 50, zIndex: 2 }}>
            <ProfilePicker
              onImageSelect={(img) => {
                setFormData((prev) => ({ ...prev, profileImage: img?.file }));
              }}
              formError={formErrors?.profileImage}
            />
          </Box>
        </Box>

        <Stack mt={"120px"} spacing={6}>
          {/* ----------------------------- Organization Details (START) -----------------------------*/}
          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Organization Details
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  label={`${type == ROLES.NGO ? Utils.capitalize(ROLES.NGO) : Utils.capitalize(ROLES.COMPANY)} Name`}
                  name="name"
                  value={formData?.name}
                  error={formErrors?.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
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
                  label="Date of Incorporation"
                  name="dateOfReg"
                  value={formData?.dateOfReg}
                  error={formErrors?.dateOfReg}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  label="Tax Identification Number"
                  name="taxIdentificationNumber"
                  value={formData?.taxIdentificationNumber}
                  error={formErrors?.taxIdentificationNumber}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- Organization Details (END) -----------------------------*/}

          {/* ----------------------------- Address (Start) -----------------------------*/}
          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Address
            </Typography>
            <Stack mt={"20px"} spacing={3}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputField
                      label="Street Address"
                      name="streetAddress"
                      value={formData?.streetAddress}
                      error={formErrors?.streetAddress}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    {renderAutocomplete(
                      "country",
                      "Country",
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
                    )}
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    {renderAutocomplete(
                      "state",
                      "State/Province",
                      updatedStates(addressForm?.country ? addressForm?.country?.value : null),
                      formData?.address?.state,
                      (value) =>
                        setAddressForm((prevData) => ({
                          ...prevData,
                          state: value,
                          city: null,
                        })),
                      formErrors?.state
                    )}
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    {renderAutocomplete(
                      "city",
                      "City",
                      updatedCities(
                        addressForm?.state ? addressForm?.state.countryCode : null,
                        addressForm?.state ? addressForm?.state.isoCode : null
                      ),
                      formData?.city,
                      (value) =>
                        setAddressForm((prevData) => ({
                          ...prevData,
                          city: value,
                        })),
                      formErrors?.city
                    )}
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <InputField
                      label="Postal Code"
                      name="postalCode"
                      value={formData?.postalCode}
                      error={formErrors?.postalCode}
                      onChange={handleInputChange}
                      max={"10"}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Box>
          {/* ----------------------------- Address (End) -----------------------------*/}

          {/* ----------------------------- Key Personnel (Start) -----------------------------*/}
          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Key Personnel
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData?.firstName}
                  error={formErrors?.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField label="Last Name" name="lastName" value={formData?.lastName} error={formErrors?.lastName} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12}>
                <InputField label="Email" name="email" value={formData?.email} error={formErrors?.email} onChange={handleInputChange} />
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- Key Personnel (End) -----------------------------*/}

          {/* ----------------------------- Documents (Start) -----------------------------*/}
          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Documents
            </Typography>
            <Stack spacing={3} mt={"20px"}>
              <Box>
                <Typography variant="h6" color="text.hint" fontWeight="400" gutterBottom>
                  Certificate of Registration
                </Typography>
                <FilePicker
                  onImageSelect={(img) => {
                    setFormData((prev) => ({
                      ...prev,
                      certificateOfReg: img?.file,
                    }));
                  }}
                  formError={formErrors?.certificateOfReg}
                />
              </Box>
              {type == ROLES.COMPANY && (
                <Box>
                  <Typography variant="h6" color="text.hint" fontWeight="400" gutterBottom>
                    CSR Policy Document
                  </Typography>
                  <FilePicker
                    onImageSelect={(img) => {
                      setFormData((prev) => ({
                        ...prev,
                        csrPolicyDoc: img?.file,
                      }));
                    }}
                    formError={formErrors?.csrPolicyDoc}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* ----------------------------- Documents (END) -----------------------------*/}

          {/* ----------------------------- END -----------------------------*/}
          <Box>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <SecondaryButton>Cancel</SecondaryButton>
              </Grid>
              <Grid item sm={6} xs={12}>
                <PrimaryButton type="submit">Submit</PrimaryButton>
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- END -----------------------------*/}
        </Stack>
      </Box>
      <KycDialogBox message={modalText} handleClose={() => setModalText("")} />
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
      renderInput={(params) => <TextField {...params} error={!!error} label={label} variant="outlined" fullWidth helperText={error} />}
    />
  );
};
