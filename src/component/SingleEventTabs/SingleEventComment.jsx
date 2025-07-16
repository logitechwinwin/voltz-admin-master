import React from "react";
import { Box } from "@mui/material";
import { UserComments } from "@/component";

const SingleEventComment = ({ eventId }) => {
  return (
    <Box>
      <UserComments eventId={eventId} />
    </Box>
  );
};

export default SingleEventComment;
