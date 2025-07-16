"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const TimeAgo = ({ createdAt, align, justNow = true }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = moment();
      const postTime = moment(createdAt);
      const diffInMinutes = now.diff(postTime, "minutes");

      if (justNow && diffInMinutes < 1) {
        setTimeAgo("Just Now");
      } else if (!justNow || diffInMinutes < 60) {
        setTimeAgo(`${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`);
      } else {
        setTimeAgo(postTime.fromNow());
      }
    };

    updateRelativeTime();

    const intervalId = setInterval(updateRelativeTime, 60000);

    return () => clearInterval(intervalId);
  }, [createdAt]);

  return (
    <Typography component="span" variant="body2" color="#9D9D9D" textAlign={align ? "right" : "left"}>
      {timeAgo}
    </Typography>
  );
};

export default TimeAgo;
