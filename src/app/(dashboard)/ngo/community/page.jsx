/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
  BannerPicker,
  EventCard,
  InputField,
  ModalWrapper,
  NotFoundData,
  PrimaryButton,
  SecondaryButton,
  UsePagination,
} from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const NgoEvents = () => {
  const [communityData, setCommunityData] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [eventId, setEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useSelector((state) => state.appReducer);

  const dispatch = useDispatch();

  const getAllCommunities = async () => {
    // dispatch(handleLoader(true));
    setLoading(true);
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `community?page=${page}&perPage=6&myCommunities=true&userId=${user?.id}`,
      });
      setCommunityData(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
      // dispatch(handleLoader(false));
    }
  };

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(handleLoader(true));
    if (formData?.bannerImage) {
      const {
        bannerImage,
        id,
        createdAt,
        topMembers,
        updatedAt,
        createdBy,
        totalMembers,
        isJoined,
        ...rest
      } = formData;
      try {
        let { data } = await ApiManager({
          method: eventId ? "patch" : "post",
          path: eventId
            ? `community/${eventId?.id}?activationStatus=active`
            : "community?activationStatus=active",
          params: {
            ...rest,
            ...(typeof formData?.bannerImage === "string"
              ? {}
              : { bannerImage: formData?.bannerImage || "" }),
          },
          header: {
            "Content-Type": "multipart/form-data",
          },
        });
        getAllCommunities();
        setOpen(false);
        setImagePreview(null);
        dispatch(setToast({ type: "success", message: data?.message }));
      } catch (error) {
        dispatch(handleLoader(false));
        if (error?.response?.data?.statusCode === 422) {
          setFormErrors(error?.response?.data?.details);
        } else {
          dispatch(setToast({ type: "error", message: error?.message }));
        }
      } finally {
        dispatch(handleLoader(false));
      }
    } else {
      dispatch(handleLoader(false));
      dispatch(setToast({ type: "error", message: "Select Banner Image" }));
    }
  };

  useEffect(() => {
    if (user?.id) {
      getAllCommunities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  const handlePagination = (e, v) => {
    setPage(v);
    // Your code here
  };

  return (
    <div>
      <Stack direction={"row"} justifyContent="space-between">
        <Typography variant="h4" fontWeight={"bold"}>
          Communities
        </Typography>
        <SecondaryButton
          onClick={() => {
            setOpen(true);
            setEventId(null);
            setFormData({});
            setImagePreview(null);
          }}
          fullWidth={false}
          startIcon={<Add />}
        >
          Create a Community
        </SecondaryButton>
      </Stack>
      <Box mt={"20px"}>
        <Grid container spacing={2}>
          {loading ? (
            Array(6)
              .fill()
              .map((_, index) => {
                return (
                  <Grid item key={index} md={6} sm={12} xs={12}>
                    <Link href={`/ngo/community/${event?.id}`}>
                      <EventCard
                        event={event}
                        community={true}
                        loading={loading}
                      />
                    </Link>
                  </Grid>
                );
              })
          ) : !communityData?.details?.length ? (
            <NotFoundData title="No community found" />
          ) : (
            communityData?.details?.map((event, index) => {
              return (
                <Grid item key={index} md={6} sm={12} xs={12}>
                  <Link href={`/ngo/community/${event?.id}`}>
                    <EventCard
                      event={event}
                      community={true}
                      setOpen={setOpen}
                      setEventId={setEventId}
                      setImagePreview={setImagePreview}
                      setFormData={setFormData}
                    />
                  </Link>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
      {communityData?.totalPages > 1 && (
        <Stack mt={"20px"} justifyContent="center" alignItems="center">
          <UsePagination
            total={communityData?.totalItems}
            page={page}
            perPage={6}
            onChangePage={handlePagination}
          />
        </Stack>
      )}
      <ModalWrapper open={open} handleClose={() => setOpen(false)}>
        <Stack sx={{ p: 3 }} gap={2} component="form" onSubmit={handleSubmit}>
          <BannerPicker
            onImageSelect={(img) => {
              setFormData((prev) => ({
                ...prev,
                bannerImage: img[0]?.file,
              }));
              // setEventId((prev) => ({
              //   ...prev,
              //   bannerImage: null,
              // }));
              setImagePreview(null);
            }}
            previewImage={imagePreview}
          />
          <InputField
            required
            label="Title"
            name="title"
            onChange={handleInputChange}
            value={formData?.title}
          />
          <InputField
            required
            label="Description"
            name="description"
            multiline
            minRows={2}
            onChange={handleInputChange}
            value={formData?.description}
          />
          <Button sx={{ mt: 2 }} variant="contained" type="submit">
            {eventId ? "Update Community" : "Create Community"}
          </Button>
        </Stack>
      </ModalWrapper>
    </div>
  );
};

export default NgoEvents;
