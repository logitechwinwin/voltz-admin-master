"use client";
import React, { useEffect, useState } from "react";

import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { ModalWrapper, EditBanner, InputField } from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const CommunityModal = ({ open, data: communityData, setOpen, callback }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, SetImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isUpdating = !!communityData;
  useEffect(() => {
    if (communityData) {
      setFormData(communityData);
      SetImagePreview(communityData?.bannerImage);
    }
  }, [communityData]);

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      SetImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // dispatch(handleLoader(true));
    let updatedFormData = {};
    if (communityData) {
      const { title, bannerImage, description } = formData;
      updatedFormData = typeof bannerImage !== "string" ? { title, bannerImage, description } : { title, description };
    }
    try {
      let { data } = await ApiManager({
        method: isUpdating ? "patch" : "post",
        path: isUpdating ? `community/${communityData?.id}` : "community",
        params: isUpdating ? updatedFormData : formData,
        header: { "Content-Type": "multipart/form-data" },
      });
      callback();
      setOpen(false);
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      if (error?.status === 422) {
        setFormErrors(error?.response?.data?.details);
      } else {
        console.log("🚀 ~ handleSubmit ~ error:", error);
      }
      // dispatch(setToast({type: 'error' , message : error?.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      handleClose={() => {
        setOpen(false);
        if (!isUpdating) {
          setFormData({});
          SetImagePreview(null);
        }
        setFormErrors({});
      }}
    >
      <Stack sx={{ p: 3 }} gap={2} component="form" onSubmit={handleSubmit}>
        <Stack>
          <Typography variant="h5" fontWeight="bold">
            {isUpdating ? "Update Community" : "Create Community"}
          </Typography>
          <EditBanner bannerError={formErrors?.bannerImage} bannerImage={imagePreview} handleBannerChange={handleBannerChange} showProfile={false} />
        </Stack>
        <InputField error={formErrors?.title} required label="Title" name="title" value={formData?.title} onChange={handleInputChange} />
        <InputField
          error={formErrors?.description}
          required
          label="Description"
          name="description"
          multiline
          minRows={2}
          onChange={handleInputChange}
          value={formData?.description}
        />

        <Button sx={{ mt: 2 }} disabled={loading} variant="contained" type="submit">
          {loading ? <CircularProgress size={25} /> : isUpdating ? "Update Community" : "Create Community"}
        </Button>
      </Stack>
    </ModalWrapper>
  );
};

export default CommunityModal;
