import React, { useEffect, useState } from "react";

import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import TableWrapper from "../TableWrapper/TableWrapper";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const SingleEventsRegisteredVolunteers = ({ eventId }) => {
  const [volPage, setVolPage] = useState(1);
  const [registeredVolunteers, setRegisteredVolunteers] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getRegisteredVolunteers = async () => {
    setLoading(false);

    try {
      let { data } = await ApiManager({
        method: "get",
        path: `events/${eventId}/registered-volunteer?page=${volPage}&perPage=6`,
      });
      setRegisteredVolunteers(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegisteredVolunteers();
  }, [volPage]);

  return (
    <>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom fontWeight="SemiBold">
          Registered Volunteers
        </Typography>
        <TableWrapper
          isContent={registeredVolunteers?.totalItems}
          onChangePage={(_, v) => setVolPage(v)}
          thContent={volunteerThLabels}
          total={registeredVolunteers?.totalItems}
          page={volPage}
          spanTd={volunteerThLabels?.length}
          perPage={6}
          // rowsPerPage={5}
          showPagination={registeredVolunteers?.totalPages > 1}
          isLoading={loading}
        >
          {registeredVolunteers?.details?.map((volunteer, i) => (
            <TableRow key={i}>
              <TableCell>{volunteer?.firstName || "-" + " " + (volunteer?.lastName || "-")}</TableCell>
              <TableCell>{volunteer?.phoneNumber || "-"}</TableCell>
              <TableCell>{volunteer?.state || "-" + " " + (volunteer?.city || "-")}</TableCell>
              <TableCell>{volunteer?.postalCode || "-"}</TableCell>
            </TableRow>
          ))}
        </TableWrapper>
      </Box>
    </>
  );
};

export default SingleEventsRegisteredVolunteers;

const volunteerThLabels = ["Name", "Phone Number", "City", "Postal Code"];
