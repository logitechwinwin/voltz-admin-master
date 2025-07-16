/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  BannerPicker,
  InputField,
  SelectBox,
  DatePicker,
  CheckBox,
  SecondaryButton,
  PrimaryButton,
  AutoComplete,
  Editor,
  SdgCard,
} from "@/component";
import { eventInputRefs } from "@/constant";
import { ApiManager, urlToFile } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const CreateEvent = ({ params }) => {
  const [sdgs, setSdgs] = useState([]);
  const [data, setData] = useState({
    topics: [],
    lifeStages: [],
  });
  const [campaignManagers, setCampaignManagers] = useState([]);
  const dispatch = useDispatch();
  let { eventId } = params;
  const [formData, setFormData] = useState({});
  const [selectedSdgs, setSelectedSdgs] = useState([]);
  let isUpdate = !!params?.eventId;
  const quillRef = useRef();

  const searchParams = useSearchParams();
  const duplicateEventId = searchParams.get("duplicate_id");

  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});

  const prevData = useRef(null);
  const { user } = useSelector((state) => state.appReducer);
  const refs = eventInputRefs.reduce((acc, refName) => {
    acc[refName] = useRef(null);
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleLoader(true));
    setFormErrors({});

    try {
      const {
        id,
        createdAt,
        userId,
        topics,
        lifeStages,
        sdg,
        registered,
        donationReceived,
        updatedAt,
        user,
        facebookUrl,
        twitterUrl,
        isArchived,
        linkedinUrl,
        youtubeUrl,
        imgPreview,
        type,
        voltzPerHour,
        volunteerRequired,
        bannerImage,
        sdgs,
        donationRequired,
        campaignManager,
        startDate,
        totalVolunteerRegistered,
        campaignManagerId,
        closed,
        activationStatus,
        ...rest
      } = formData;

      // Validate donationRequired is not less than donationReceived
      if (Number(donationRequired) < Number(donationReceived)) {
        setFormErrors({
          donationRequired:
            "Donation required cannot be less than donation received.",
        });
        dispatch(handleLoader(false));
        return;
      }

      // Create a copy of the rest object
      let modifiedRest = { ...rest };

      // Check if isUpdate is true
      if (isUpdate || duplicateEventId) {
        // Destructure donations and donationsCount out of modifiedRest, removing them if they exist
        const { donations, donationsCount, ...filteredRest } = modifiedRest;
        // Assign the filtered object back to modifiedRest
        modifiedRest = filteredRest;
      }

      let dataToSend = {
        ...modifiedRest,
        ...(!isUpdate ? { type: "charity" } : {}),
        ...(selectedSdgs?.length ? { sdgs: selectedSdgs } : { sdgs: [0] }),
        ...(formData?.topics?.length
          ? { topics: formData.topics.map((topic) => topic?.id) }
          : { topics: [0] }),
        ...(formData?.lifeStages?.length
          ? {
              lifeStages: formData.lifeStages.map((lifeStage) => lifeStage?.id),
            }
          : { lifeStages: [0] }),
        ...(formData?.youtubeUrl ? { youtubeUrl } : {}),
        ...(formData?.twitterUrl ? { twitterUrl } : {}),
        ...(formData?.facebookUrl ? { facebookUrl } : {}),
        ...(formData?.linkedinUrl ? { linkedinUrl } : {}),
        ...(Array.isArray(bannerImage)
          ? { bannerImage: bannerImage[0]?.file }
          : {}),
        ...(formData.donationRequired
          ? { donationRequired: formData.donationRequired }
          : { donationRequired: "null" }),
        ...(isUpdate
          ? prevData.current?.startDate !== formData?.startDate
            ? { startDate }
            : {}
          : { startDate }),
      };

      let { data } = await ApiManager({
        method: isUpdate ? "patch" : "post",
        path: isUpdate ? `events/${params?.eventId}` : "events",
        params: dataToSend,
        header: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setToast({ type: "success", message: data?.message }));
      router.push(`/ngo/campaigns/fundraising?page=1`);
      setSelectedSdgs([]);
    } catch (error) {
      if (error?.response?.status == 422) {
        setFormErrors(error?.response?.data?.details);
        // dispatch(setToast({ type: "error", message: error?.response?.data?.message }));
      } else {
        dispatch(
          setToast({ type: "error", message: error?.response?.data?.message })
        );
      }
      console.log("🚀 ~ handleSubmit ~ error", error);
    } finally {
      dispatch(handleLoader(false));
    }
  };
  const handleAutoCompleteChange = (val, name) => {
    if (val?.some((item) => item.id === "all")) {
      setFormData((prev) => ({ ...prev, [name]: data[name] })); // Select all
    } else {
      setFormData((prev) => ({ ...prev, [name]: val })); // Regular selection
    }
  };

  const fetchDependencies = async () => {
    dispatch(handleLoader(true));
    try {
      const [sdgsResponse, topicsResponse, lifeStagesResponse] =
        await Promise.all([
          ApiManager({ method: "get", path: "sdgs?perPage=100" }),
          ApiManager({ method: "get", path: "topics?perPage=99999" }),
          ApiManager({ method: "get", path: "life-stage?perPage=999999" }),
        ]);

      setSdgs(sdgsResponse.data?.response?.details);
      setData({
        topics: topicsResponse.data?.response?.details,
        lifeStages: lifeStagesResponse.data?.response?.details,
      });
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const getAllCampaignManagers = async () => {
    try {
      let { data } = await ApiManager({
        path: `campaign-manager?ngoId=${user?.id}`,
      });
      console.log("data?.message", data);
      setCampaignManagers(
        data?.response?.details?.map((item) => ({
          id: item?.id,
          name: item?.firstName + " " + item?.lastName,
        }))
      );
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const getSingleEvent = async (event_id) => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `events/${event_id}`,
      });
      const { bannerImage, sdg, ...rest } = data?.response?.details || {};
      const bannerImgFile =
        duplicateEventId && (await urlToFile(bannerImage, "image", "image/*"));
      let manager = data?.response?.details?.campaignManager;
      setFormData({
        ...data?.response?.details,
        campaignManagerId: {
          id: manager?.id,
          name: `${manager?.firstName} ${manager?.lastName}`,
        },
        imgPreview: bannerImage,
        ...(!!duplicateEventId && {
          bannerImage: [{ file: bannerImgFile, imageDataUrl: bannerImage }],
        }),
      });
      prevData.current = data?.response?.details;
      setSelectedSdgs(sdg?.map((e) => e?.id));
    } catch (error) {
      console.log("🚀 ~ getSingleEvent ~ error:", error);
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };

  useEffect(() => {
    getAllCampaignManagers();
  }, []);

  useEffect(() => {
    let event_id = eventId || duplicateEventId;
    if (event_id) {
      getSingleEvent(event_id);
    }
    fetchDependencies();
  }, []);

  const handleSdgChange = (sdg) => {
    if (selectedSdgs?.includes(sdg?.id)) {
      setSelectedSdgs((prev) => {
        return prev?.filter((item) => item !== sdg?.id);
      });
    } else {
      setSelectedSdgs((prev) => [...prev, sdg?.id]);
    }
  };

  const handleInputChange = (e, v) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => {
      let updatedFormData;

      if (type !== "checkbox") {
        updatedFormData = {
          ...prev,
          [name]: value,
        };
      }

      // Check if the eventType is being changed to 'charity'
      if (name === "eventType" && value === "charity") {
        const { voltzPerHour, ...rest } = updatedFormData;
        return rest;
      }

      return updatedFormData;
    });
  };

  const handleSelectAll = () => {
    setSelectedSdgs(
      selectedSdgs?.length === sdgs?.length ? [] : sdgs?.map((each) => each.id)
    );
  };

  useEffect(() => {
    const firstErrorField = Object.keys(formErrors)[0];
    const errorFields = Object.keys(formErrors);
    console.log("🚀 ~ useEffect ~ formErrors:", formErrors);

    if (errorFields?.includes("bannerImage")) {
      refs["bannerImage"].current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (firstErrorField == "sdgs") {
      refs["sdgs"].current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (firstErrorField && refs[firstErrorField]) {
      refs[firstErrorField].current?.focus();
    }
  }, [formErrors]);

  return (
    <Container maxWidth="lg">
      <Box component="form" onSubmit={handleSubmit}>
        {/* ----------------------------- START -----------------------------*/}

        <Typography variant="h4" fontWeight={"bold"}>
          {isUpdate ? "Update Fundraising" : "Create Fundraising"}
        </Typography>

        {/* ----------------------------- BANNER PICKER -----------------------------*/}

        <Box mt="41px" ref={refs["bannerImage"]}>
          <BannerPicker
            onImageSelect={(img) => {
              setFormData((prev) => ({ ...prev, bannerImage: img }));
            }}
            error={formErrors?.bannerImage}
            previewImage={
              Array.isArray(formData?.bannerImage)
                ? formData?.bannerImage[0]?.imageDataUrl
                : formData?.bannerImage
            }
          />
        </Box>

        {/* ----------------------------- BANNER PICKER -----------------------------*/}

        <Stack mt={"60px"} spacing={6}>
          {/* ----------------------------- ORGANIZATION DETAILS -----------------------------*/}
          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Organization Details
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["title"]}
                  label="Name"
                  onChange={handleInputChange}
                  name="title"
                  value={formData?.title}
                  error={formErrors?.title}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePicker
                  ref={refs["startDate"]}
                  type="datetime"
                  minDateTime={moment()}
                  label="Start Date and Time"
                  value={formData?.startDate && moment(formData?.startDate)}
                  onChange={handleInputChange}
                  name="startDate"
                  error={formErrors?.startDate}
                  minutesStep={5}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePicker
                  ref={refs["endDate"]}
                  minDateTime={moment(formData?.startDate)}
                  type="datetime"
                  label={`End Date and Time`}
                  value={formData?.endDate && moment(formData?.endDate)}
                  onChange={handleInputChange}
                  name="endDate"
                  error={formErrors?.endDate}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["state"]}
                  label="State"
                  onChange={handleInputChange}
                  name="state"
                  value={formData?.state}
                  error={formErrors?.state}
                  required
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["address"]}
                  label="Address"
                  onChange={handleInputChange}
                  name="address"
                  value={formData?.address}
                  error={formErrors?.address}
                  required
                />
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <InputField
                  ref={refs["city"]}
                  label="City"
                  onChange={handleInputChange}
                  name="city"
                  value={formData?.city}
                  error={formErrors?.city}
                  required
                />
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <InputField
                  ref={refs["country"]}
                  label="Country"
                  onChange={handleInputChange}
                  name="country"
                  value={formData?.country}
                  error={formErrors?.country}
                  required
                />
              </Grid>
              <Grid
                item
                md={formData?.type !== "campaign" ? 6 : 3}
                sm={6}
                xs={12}
              >
                <InputField
                  ref={refs["donationRequired"]}
                  label={`Donation Required`}
                  onChange={handleInputChange}
                  name="donationRequired"
                  value={formData?.donationRequired}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  error={formErrors?.donationRequired}
                  required={formData?.type === "campaign"}
                  min={formData?.type === "charity" ? 1 : 0}
                />
              </Grid>

              <Grid
                item
                sm={6}
                // md={formData?.type === "campaign" ? 4 : 6}
                xs={12}
              >
                <AutoComplete
                  name="topics"
                  label="Topics"
                  ref={refs["topics"]}
                  options={[
                    formData?.topics?.length !== data?.topics?.length
                      ? { id: "all", label: "Select All" }
                      : {},
                    ...data?.topics,
                  ]}
                  multiple
                  value={formData?.topics || []} // Ensure value comes from state
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(e, val) => handleAutoCompleteChange(val, "topics")}
                />
              </Grid>

              <Grid
                item
                sm={6}
                // md={formData?.type === "campaign" ? 4 : 6}
                xs={12}
              >
                <AutoComplete
                  name="lifeStages"
                  label="Life Stages"
                  ref={refs["lifeStages"]}
                  options={[
                    formData?.lifeStages?.length !== data?.lifeStages?.length
                      ? { id: "all", label: "Select All" }
                      : {},
                    ...data?.lifeStages,
                  ]}
                  multiple
                  value={formData?.lifeStages || []} // Ensure value comes from state
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(e, val) =>
                    handleAutoCompleteChange(val, "lifeStages")
                  }
                />
              </Grid>

              <Grid item xs={12}>
                {/* <Editor
                value={formData?.description}
                onChange={handleInputChange}
                labelTop="Description"
                name="description"
                error={formErrors?.description}
              /> */}

                <InputField
                  ref={refs["description"]}
                  multiline
                  required
                  rows={4}
                  label="Description"
                  onChange={handleInputChange}
                  name="description"
                  value={formData?.description}
                  error={formErrors?.description}
                />
              </Grid>
            </Grid>
          </Box>
          {/* ----------------------------- ORGANIZATION DETAILS -----------------------------*/}

          {/* ----------------------------- SDGs -----------------------------*/}

          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              SDGs{" "}
              <Button onClick={handleSelectAll}>
                {selectedSdgs?.length === sdgs?.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </Typography>
            <Grid container mt={"20px"}>
              <Stack
                direction={"row"}
                gap={2}
                ref={refs["sdgs"]}
                flexWrap={"wrap"}
              >
                {sdgs?.map((each, i) => {
                  return (
                    <SdgCard
                      sdg={each}
                      key={i}
                      checked={selectedSdgs?.includes(each?.id)}
                      onClick={() => handleSdgChange(each)}
                    />
                  );
                })}
              </Stack>
              <FormHelperText error>{formErrors?.sdgs}</FormHelperText>
            </Grid>
          </Box>

          {/* ----------------------------- SDGs -----------------------------*/}

          {/* ----------------------------- SOCIALS LINKS -----------------------------*/}

          <Box>
            <Typography variant="h5" color="text.hint" fontWeight="bold">
              Social Links
            </Typography>
            <Grid container spacing={2} mt={"20px"}>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["facebookUrl"]}
                  label="Facebook Url"
                  onChange={handleInputChange}
                  value={formData?.facebookUrl}
                  name="facebookUrl"
                  error={formErrors?.facebookUrl}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["twitterUrl"]}
                  label="Twitter Url"
                  onChange={handleInputChange}
                  value={formData?.twitterUrl}
                  name="twitterUrl"
                  error={formErrors?.twitterUrl}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["linkedinUrl"]}
                  label="LinkedIn Url"
                  onChange={handleInputChange}
                  value={formData?.linkedinUrl}
                  name="linkedinUrl"
                  error={formErrors?.linkedinUrl}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputField
                  ref={refs["youtubeUrl"]}
                  label="Youtube Url"
                  onChange={handleInputChange}
                  value={formData?.youtubeUrl}
                  name="youtubeUrl"
                  error={formErrors?.youtubeUrl}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ----------------------------- SOCIALS LINKS -----------------------------*/}

          {/* <Box>
          <Typography variant="h5" color="text.hint" fontWeight="bold">
            Volunteer Details
          </Typography>
          <Grid container spacing={2} mt={"20px"}>
            <Grid item sm={6} xs={12}>
              <InputField label="Number Of Volunteers" />
            </Grid>
            <Grid item sm={6} xs={12}>
              <InputField label="Number Of Voltz" />
            </Grid>
          </Grid>
        </Box> */}

          {/* ----------------------------- END -----------------------------*/}

          <Box>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <SecondaryButton onClick={() => router.back()}>
                  Cancel
                </SecondaryButton>
              </Grid>
              <Grid item sm={6} xs={12}>
                <PrimaryButton type="submit">
                  {isUpdate ? "Update" : "Submit"}
                </PrimaryButton>
              </Grid>
            </Grid>
          </Box>

          {/* ----------------------------- END -----------------------------*/}
        </Stack>
      </Box>
    </Container>
  );
};

export default CreateEvent;
