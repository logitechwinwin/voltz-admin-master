"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { UpComingEventCard, UsePagination, NotFoundData } from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const UpcomingEvents = () => {
  const [loading, setLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to fetch upcoming events
  const getUpcomingEvents = async (pageNumber) => {
    setLoading(true);
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `events?type=campaign&page=${pageNumber}&userId=${user?.id}&perPage=${perPage}&upcomingOnly=true`,
      });

      const newEvents = data?.response?.details?.items || [];
      setUpcomingEvents(newEvents); // Replace existing events with new ones
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle page changes via query parameter
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page")) || 1; // Get 'page' from query parameters or default to 1
    setPage(currentPage);
    getUpcomingEvents(currentPage); // Fetch events for the current page
  }, [searchParams]);

  // Handle page change for pagination component
  const handlePagination = (e, newPage) => {
    setPage(newPage);
    router.push(`?page=${newPage}`); // Update the URL with the new page number
  };

  return (
    <>
      <Typography variant="h5" fontWeight="SemiBold" sx={{ mb: 2 }}>
        Upcoming Events
      </Typography>

      <Stack sx={{ minHeight: 1 }}>
        {loading ? (
          // Show skeletons while loading
          <Grid container mt={"20px"} spacing={2}>
            {Array(8) // Adjust the number based on how many skeletons you want to display
              .fill()
              .map((_, index) => (
                <Grid item sm={6} xs={12} md={4} lg={3} key={index}>
                  <UpComingEventCard loading={true} />
                </Grid>
              ))}
          </Grid>
        ) : upcomingEvents?.length > 0 ? (
          <>
            <Grid container mt={"20px"} spacing={2}>
              {upcomingEvents.map((e) => (
                <Grid item sm={6} xs={12} md={4} lg={3} key={e.id}>
                  <UpComingEventCard cardData={e} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ width: "fit-content", mx: "auto", mt: 5 }}>
              <UsePagination
                total={upcomingEvents?.meta?.totalItems}
                page={page}
                perPage={perPage}
                onChangePage={handlePagination}
              />
            </Box>
          </>
        ) : (
          // Show "No events found" message if not loading and no events
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <NotFoundData />
            There are no events yet
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default UpcomingEvents;
