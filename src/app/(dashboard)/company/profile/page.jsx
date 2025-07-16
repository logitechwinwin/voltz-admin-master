// /* eslint-disable no-unused-vars */
// "use client";

// import { useEffect, useState } from "react";

// import {
//   Autocomplete,
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControlLabel,
//   FormGroup,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";

// import { ArrowBackIosIcon } from "@/assets";
// import {
//   BannerPicker,
//   InputField,
//   KycDialogBox,
//   PrimaryButton,
//   ProfilePicker,
//   SecondaryButton,
// } from "@/component";
// import { ROLES } from "@/constant";
// import { ApiManager } from "@/helpers";
// import { handleLoader, setToast, setUser } from "@/store/reducer";

// const EditProfile = ({ type = "ngo" }) => {
//   const [modalText, setModalText] = useState("");
//   const [formErrors, setFormErrors] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [sdgs, setSdgs] = useState([]);
//   const [checkEmail, setCheckEmail] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const { user } = useSelector((state) => state.appReducer);

//   // Hooks for router navigation and dispatching actions
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const showMessage = (type, msg) =>
//     dispatch(setToast({ type: type, message: msg }));

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Updated Form Data
//     console.log("formdata", formData);
//     setFormErrors({});
//     if (!formData?.profileImage) {
//       dispatch(setToast({ type: "error", message: "Select Profile Image" }));
//     } else if (!formData?.bannerImage) {
//       dispatch(setToast({ type: "error", message: "Select Banner Image" }));
//     } else {
//       const { email, profileImage, bannerImage, ...rest } = formData;
//       try {
//         dispatch(handleLoader(true));
//         let { data } = await ApiManager({
//           method: "patch",
//           path: `company`,
//           params: {
//             ...rest,
//             ...(checkEmail ? { email: formData?.email } : {}),
//             ...(typeof formData?.profileImage === "string"
//               ? {}
//               : { profileImage: formData?.profileImage }),
//             ...(typeof formData?.bannerImage === "string"
//               ? {}
//               : { bannerImage: formData?.bannerImage }),
//           },
//           header: { "Content-Type": "multipart/form-data" },
//         });
//         console.log("new", data);
//         showMessage("success", data?.message);
//         dispatch(setUser(data?.response?.details));
//       } catch (error) {
//         if (error?.code == "ERR_NETWORK") {
//           showMessage("error", error?.message);
//         } else if (error?.response?.status == 422) {
//           showMessage("error", error?.response?.data?.message);
//           setFormErrors(error?.response?.data?.details);
//         } else {
//           showMessage("error", error?.response?.data?.message);
//         }
//       } finally {
//         dispatch(handleLoader(false));
//       }
//     }
//   };

//   useEffect(() => {
//     setFormData({
//       about: user?.about,
//       firstName: user?.firstName,
//       lastName: user?.lastName,
//       email: user?.email,
//       profileImage: user?.profileImage,
//       bannerImage: user?.bannerImage,
//     });
//     setImagePreview({
//       profileImage: user?.profileImage,
//       bannerImage: user?.bannerImage,
//     });
//   }, []);

//   return (
//     <Container py={6}>
//       <Box component={"form"} onSubmit={handleSubmit} py={7}>
//         <Button
//           startIcon={<ArrowBackIosIcon />}
//           sx={{ mb: 4 }}
//           onClick={() => router.back()}
//         >
//           Back
//         </Button>

//         <Typography variant="h4" fontWeight={"bold"}>
//           Update Profile
//         </Typography>
//         <Box mt="41px" sx={{ position: "relative" }}>
//           <BannerPicker
//             onImageSelect={(img) => {
//               setFormData((prev) => ({ ...prev, bannerImage: img[0]?.file }));
//               setImagePreview((prev) => ({
//                 ...prev,
//                 bannerImage: null,
//               }));
//             }}
//             formError={formErrors?.bannerImage}
//             previewImage={imagePreview?.bannerImage}
//           />
//           <Box sx={{ position: "absolute", top: 130, left: 50, zIndex: 3 }}>
//             <ProfilePicker
//               onImageSelect={(img) => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   profileImage: img[0]?.file,
//                 }));
//                 setImagePreview((prev) => ({
//                   ...prev,
//                   profileImage: null,
//                 }));
//               }}
//               formError={formErrors?.profileImage}
//               previewImage={imagePreview?.profileImage}
//             />
//           </Box>
//         </Box>

//         <Stack mt={"120px"} spacing={6}>
//           {/* ----------------------------- Key Personnel (Start) -----------------------------*/}
//           <Box>
//             {/* <Typography variant="h5" color="text.hint" fontWeight="bold">
//                 Key Personnel
//               </Typography> */}
//             <Grid container spacing={2} mt={"20px"}>
//               <Grid item sm={6} xs={12}>
//                 <InputField
//                   required
//                   label="First Name"
//                   name="firstName"
//                   value={formData?.firstName}
//                   error={formErrors?.firstName}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item sm={6} xs={12}>
//                 <InputField
//                   required
//                   label="Last Name"
//                   name="lastName"
//                   value={formData?.lastName}
//                   error={formErrors?.lastName}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <InputField
//                   required
//                   label="Email"
//                   name="email"
//                   value={formData?.email}
//                   error={formErrors?.email}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <InputField
//                   multiline
//                   minRows={4}
//                   required
//                   label="About"
//                   name="about"
//                   value={formData?.about}
//                   error={formErrors?.about}
//                   onChange={handleInputChange}
//                 />
//               </Grid>
//             </Grid>
//           </Box>

//           <Box>
//             <Grid container spacing={2}>
//               <Grid item sm={6} xs={12}>
//                 <SecondaryButton onClick={() => router.back()}>
//                   Cancel
//                 </SecondaryButton>
//               </Grid>
//               <Grid item sm={6} xs={12}>
//                 <PrimaryButton type="submit">Update</PrimaryButton>
//               </Grid>
//             </Grid>
//           </Box>
//           {/* ----------------------------- END -----------------------------*/}
//         </Stack>
//       </Box>
//       <KycDialogBox
//         message={modalText}
//         handleClose={() => {
//           setModalText("");
//           router.push("/login");
//         }}
//       />
//     </Container>
//   );
// };

// export default EditProfile;

// // Countries State Cities autocomplete selector.
// const renderAutocomplete = (id, label, options, value, onChange, error) => {
//   return (
//     <Autocomplete
//       id={id}
//       name={id}
//       fullWidth
//       options={options}
//       value={value}
//       onChange={(event, value) => onChange(value)}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           value={value}
//           error={!!error}
//           label={label}
//           variant="outlined"
//           fullWidth
//           helperText={error}
//         />
//       )}
//     />
//   );
// };

"use client";

import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ModalWrapper } from "@/component";

import {
  Profile as ProfileImg,
  LocationOnOutlinedIcon,
  VoltzIcon,
  HandHeartIcon,
  UserThreeIcon,
  SDGIcon,
  CalendarIcon,
  CommentIcon,
  HeartOutlineIcon,
  FacebookSharpIcon,
  TwitterIcon,
  LinkedInIcon,
  YoutubeIcon,
  ContentCopyIcon,
} from "@/assets";
import { ProfileBanner, SecondaryButton } from "@/component";
import { ApiManager } from "@/helpers";

const Profile = () => {
  const isSmallScreen = useMediaQuery("(max-width:918px)");
  const { user } = useSelector((state) => state.appReducer);
  const [profileData, setProfileData] = useState({});

  const fetchGoalsAchieved = async () => {
    try {
      const { data } = await ApiManager({
        path: `users/${user.id}/goals-achieved`,
      });
      setProfileData(data?.response?.details);
      console.log("fetchGoalsAchieved", data);
    } catch (error) {
      console.error("Error fetching goals achieved:", error);
    }
  };

  useEffect(() => {
    fetchGoalsAchieved();
  }, []);

  return (
    <Container maxWidth="lg">
      <Stack gap={4} pb={3}>
        {/* --- --- ( Profile Banner Section ) --- --- */}
        <ProfileBanner
          bannerImage={user?.bannerImage}
          profileImage={user?.profileImage}
          coverContain
        />

        {/* --- --- ( Profile Title and Social Links Section ) --- --- */}

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "end" }}
        >
          <Stack gap={2}>
            <Stack
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              width={1}
              direction={{ xs: "column", sm: "row" }}
            >
              <Typography variant="h4" fontWeight="bold">
                {user?.name}
              </Typography>
              <Stack direction="row" gap={1}>
                {user?.facebookUrl && (
                  <Link href={user?.facebookUrl || "#"}>
                    <IconButton>
                      <FacebookSharpIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}

                {user?.youtubeUrl && (
                  <Link href={user?.youtubeUrl || "#"}>
                    <IconButton>
                      <YoutubeIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
                {user?.TwitterIcon && (
                  <Link href={user?.TwitterIcon || "#"}>
                    <IconButton>
                      <TwitterIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
                {user?.linkedinUrl && (
                  <Link href={user?.linkedinUrl || "#"}>
                    <IconButton>
                      <LinkedInIcon sx={{ color: "secondary.main" }} />
                    </IconButton>
                  </Link>
                )}
              </Stack>
            </Stack>
            <Stack gap={0.5}>
              <Stack direction="row" gap={2}>
                <LocationOnOutlinedIcon color="text.heading" />
                <Typography color="text.heading">{`${user?.city},${user?.country}`}</Typography>
              </Stack>
              {/* <Stack direction="row" gap={2}>
                <LanguageIcon color="text.heading" />
                <Typography color="text.heading">https://rmhc-curacao.org/</Typography>
              </Stack> */}
            </Stack>
          </Stack>
          <Stack direction="row" gap={1}>
            {user?.certificateOfReg && (
              <Button
                variant="contained"
                LinkComponent={"a"}
                href={user?.certificateOfReg}
                sx={{
                  borderRadius: 3,
                  textTransform: "capitalize",
                  mt: 2.5,
                }}
                size="large"
                target="_blank"
              >
                View Certificate of Registration
              </Button>
            )}
            {user?.csrPolicyDoc && (
              <Button
                variant="contained"
                LinkComponent={"a"}
                href={user?.certificateOfReg}
                sx={{
                  borderRadius: 3,
                  textTransform: "capitalize",
                  mt: 2.5,
                }}
                size="large"
                target="_blank"
              >
                View CSR Policy Document
              </Button>
            )}
          </Stack>
        </Stack>

        {/* --- --- ( Profile Points Section ) --- --- */}

        <Stack
          direction={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          gap={3}
        >
          <Stack gap={3} direction="row" flexWrap="wrap">
            <Stack direction="row" alignItems="center" gap={1}>
              <Image src={VoltzIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.voltzEarned || 0}
              </Typography>
            </Stack>
            {/* <Stack direction="row" alignItems="center" gap={1}>
              <Image src={CalendarIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.totalEventsParticipated || 0}
              </Typography>
            </Stack> */}
            {/* <Stack direction="row" alignItems="center" gap={1}>
              <Image src={HandHeartIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.donatedAmount}
              </Typography>
            </Stack> */}
            <Stack direction="row" alignItems="center" gap={1}>
              <Image src={UserThreeIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.followersCount || 0}
              </Typography>
            </Stack>
            {/* <Stack direction="row" alignItems="center" gap={1}>
              <Image src={SDGIcon} alt="" />
              <Typography
                variant="h6"
                fontWeight="regular"
                color="text.heading"
              >
                {profileData.sdgs?.length || 0}
              </Typography>
            </Stack> */}
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            width={{ xs: "auto" }}
            gap={3}
            alignItems="center"
          >
            {/* --- --- ( Edit Profile Button ) --- --- */}

            <Stack sx={{ flex: 1, width: "100%" }}>
              <SecondaryButton
                LinkComponent={Link}
                href="/company/edit-profile"
              >
                Edit Profile
              </SecondaryButton>
            </Stack>

            {/* --- --- ( Share, Like and Comment Icons Section ) --- --- */}

            <Stack flexDirection="row" alignItems="flex-start" gap={3}>
              {/* <IconButton size="small" onClick={() => setOpen(true)}>
                <Image src={ShareIcon} alt="" />
              </IconButton> */}
              {/* <Stack>
                <Image src={CommentIcon} alt="" />
                <Typography
                  variant="subTitle1"
                  textAlign="center"
                  color="#C6C6C6"
                >
                  12
                </Typography>
              </Stack> */}
              {/* <Stack>
                <Image src={HeartOutlineIcon} alt="" />
                <Typography
                  variant="subTitle1"
                  fontWeight="ExtraBold"
                  textAlign="center"
                  color="primary.main"
                >
                  21
                </Typography>
              </Stack> */}
            </Stack>
          </Stack>
        </Stack>

        {/* --- --- ( About Section ) --- ---  */}

        <Stack gap={1}>
          <Typography variant="h6" fontWeight="bold" color="text.heading">
            About
          </Typography>
          <Typography
            variant="h6"
            component="p"
            fontWeight="normal"
            color="text.heading"
            dangerouslySetInnerHTML={{
              __html: user?.about?.replace(/\n/g, "<br />"),
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Profile;
