"use client";

import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBackIosIcon } from "@/assets";
import {
  BannerPicker,
  InputField,
  KycDialogBox,
  PrimaryButton,
  ProfilePicker,
  SecondaryButton,
} from "@/component";
import { ROLES } from "@/constant";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast, setUser } from "@/store/reducer";

const EditProfile = ({ type = "ngo" }) => {
  const [modalText, setModalText] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({});
  const [sdgs, setSdgs] = useState([]);
  const [checkEmail, setCheckEmail] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useSelector((state) => state.appReducer);

  // Hooks for router navigation and dispatching actions
  const router = useRouter();
  const dispatch = useDispatch();

  // Refs for focusing fields with errors
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const aboutRef = useRef(null);
  const bannerPickerRef = useRef(null);

  const showMessage = (type, msg) =>
    dispatch(setToast({ type: type, message: msg }));

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (name === "email") {
      setCheckEmail(true);
    }
    setFormData((prev) => {
      let updatedFormData;

      if (type === "checkbox") {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const newSdgs = checked
          ? [...prev?.sdgs, +name]
          : prev.sdgs.filter((id) => id != name);
        updatedFormData = {
          ...prev,
          sdgs: newSdgs,
        };
      } else {
        updatedFormData = {
          ...prev,
          [name]: value,
        };
      }
      return updatedFormData;
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const getSdgs = async () => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "get",
        path: "sdgs?page=1&perPage=999",
      });
      setSdgs(data?.response?.details);
      console.log("sdgs", data?.response?.details);
    } catch (error) {
      console.log(error);

      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const focusFirstErrorField = (errorDetails) => {
    const fieldsMap = {
      profileImage: bannerPickerRef,
      bannerImage: bannerPickerRef,
      firstName: firstNameRef,
      lastName: lastNameRef,
      email: emailRef,
      about: aboutRef,
    };
    for (const key in fieldsMap) {
      if (errorDetails?.[key]) {
        if (key == "bannerImage" || "profileImage") {
          fieldsMap[key].current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          break;
        } else {
          fieldsMap[key].current.focus();
          break;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Updated Form Data
    setFormErrors({});
    const { email, profileImage, bannerImage, ...rest } = formData;

    try {
      dispatch(handleLoader(true));
      let { data } = await ApiManager({
        method: "patch",
        path: `company`,
        params: {
          ...rest,
          ...(checkEmail ? { email: formData?.email } : {}),
          ...(typeof formData?.profileImage === "string"
            ? {}
            : { profileImage: formData?.profileImage }),
          ...(typeof formData?.bannerImage === "string"
            ? {}
            : { bannerImage: formData?.bannerImage }),
        },
        header: { "Content-Type": "multipart/form-data" },
      });
      showMessage("success", data?.message);
      dispatch(setUser(data?.response?.details));
      console.log("API Response:", data?.response?.details);
      console.log("Form payload:", rest);
      router.back();
    } catch (error) {
      if (error?.code == "ERR_NETWORK") {
        showMessage("error", error?.message);
      } else if (error?.response?.status == 422) {
        const errorDetails = error?.response?.data?.details;
        setFormErrors(errorDetails);
        focusFirstErrorField(errorDetails);
      } else {
        showMessage("error", error?.response?.data?.message);
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  useEffect(() => {
    // getSdgs();
    setFormData({
      about: user?.about,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      sdgs: user?.sdgs?.map((sdg) => sdg?.id),
      profileImage: user?.profileImage,
      bannerImage: user?.bannerImage,
    });
    setImagePreview({
      profileImage: user?.profileImage,
      bannerImage: user?.bannerImage,
    });
  }, []);

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
          Update Profile
        </Typography>

        <Box mt="41px" sx={{ position: "relative" }} ref={bannerPickerRef}>
          <BannerPicker
            onImageSelect={(img) => {
              setFormData((prev) => ({ ...prev, bannerImage: img[0]?.file }));
              setImagePreview((prev) => ({
                ...prev,
                bannerImage: null,
              }));
            }}
            error={formErrors?.bannerImage}
            previewImage={imagePreview?.bannerImage}
            value={formData?.bannerImage}
          />
          <Box sx={{ position: "absolute", top: 130, left: 50, zIndex: 3 }}>
            <ProfilePicker
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
              error={formErrors?.profileImage}
              previewImage={imagePreview?.profileImage}
              value={formData?.profileImage}
            />
          </Box>
        </Box>

        <Stack mt={"120px"} spacing={6}>
          <Box>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="First Name"
                  name="firstName"
                  value={formData?.firstName}
                  error={formErrors?.firstName}
                  onChange={handleInputChange}
                  inputRef={firstNameRef}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData?.lastName}
                  error={formErrors?.lastName}
                  onChange={handleInputChange}
                  inputRef={lastNameRef}
                />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  required
                  label="Email"
                  name="email"
                  value={formData?.email}
                  error={formErrors?.email}
                  onChange={handleInputChange}
                  disabled
                  inputRef={emailRef}
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  multiline
                  minRows={4}
                  required
                  label="About"
                  name="about"
                  value={formData?.about}
                  error={formErrors?.about}
                  onChange={handleInputChange}
                  inputRef={aboutRef}
                />
              </Grid>
            </Grid>
          </Box>

          {/* <Box>
            <Typography variant="h5" fontWeight="bold">
              SDGS
            </Typography>
            <FormGroup>
              {sdgs?.map((Sdg, i) => (
                <FormControlLabel
                  key={i}
                  sx={{ my: 1 }}
                  control={
                    // <Checkbox checked={formData?.sdgs?.includes(Sdg?.id)} sx={{ py: 0, alignSelf: "flex-start" }} onChange={handleInputChange} />
                    <Checkbox
                      checked={formData?.sdgs?.includes(Sdg?.id)}
                      name={Sdg?.id}
                      sx={{ py: 0, alignSelf: "flex-start" }}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ userSelect: "none" }}>
                      {Sdg?.label}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box> */}

          <Box>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <SecondaryButton onClick={() => router.back()}>
                  Cancel
                </SecondaryButton>
              </Grid>
              <Grid item sm={6} xs={12}>
                <PrimaryButton type="submit">Submit</PrimaryButton>
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

export default EditProfile;
