"use client";

import React, { useEffect, useState } from "react";

import { Box, TableCell, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { useDispatch } from "react-redux";

import TableWrapper from "../TableWrapper/TableWrapper";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const SingleEventDonation = ({ eventId }) => {
  const [donationPage, setDonationPage] = useState(1);
  const [donations, setDonations] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getDonations = async () => {
    setLoading(true);

    try {
      let { data } = await ApiManager({
        method: "get",
        path: `donation?page=${donationPage}&perPage=6&eventId=${eventId}`,
      });
      setDonations(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonations();
  }, [donationPage]);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom fontWeight="SemiBold">
        Donations
      </Typography>
      <TableWrapper
        isContent={donations?.details?.meta?.totalItems}
        onChangePage={(_, v) => setDonationPage(v)}
        thContent={donationThLabels}
        total={donations?.details?.meta?.totalItems}
        page={donationPage}
        spanTd={donationThLabels?.length}
        perPage={6}
        // rowsPerPage={5}
        showPagination={donations?.details?.meta?.totalPages > 1}
        isLoading={loading}
      >
        {donations?.details?.items?.map((donation, i) => (
          <TableRow key={i}>
            <TableCell>
              {donation?.user?.firstName + " " + donation?.user?.lastName}
            </TableCell>
            <TableCell>{donation?.amount}</TableCell>
            <TableCell>
              {moment(donation?.donatedAt).format("DD-MM-YY, hh:mm:ss A")}
            </TableCell>
          </TableRow>
        ))}
      </TableWrapper>
    </Box>
  );
};

export default SingleEventDonation;

const donationThLabels = ["Donor Name", "Amount", "Donation Date"];
