import {
  Paper,
  Stack,
  Typography,
  Tooltip,
  Chip,
  Skeleton,
} from "@mui/material";

const AdminDashboardCardSkeleton = () => (
  <Paper
    sx={{
      borderRadius: "12px",
      p: 3,
      boxShadow: "0px 4.65px 7.74px rgba(0, 0, 0, 0.2)",
      height: 1,
    }}
  >
    <Stack
      gap={2}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack>
        <Skeleton variant="text" width={100} height={30} />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="text" width={50} height={40} />
        </Stack>
      </Stack>
      <Stack spacing={0.5}>
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Stack>
    </Stack>
  </Paper>
);

const AdminDashboardCard = ({ title, value, icon, statuses, loading }) => {
  if (loading) return <AdminDashboardCardSkeleton />;

  return (
    <Paper
      sx={{
        borderRadius: "12px",
        p: 3,
        boxShadow: "0px 4.65px 7.74px rgba(0, 0, 0, 0.2)",
        height: 1,
      }}
    >
      <Stack
        gap={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Title & Icon */}
        <Stack>
          <Typography variant="h5" color="text.secondary" fontWeight="bold">
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {icon}
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Stack>
        </Stack>

        {/* Statuses as Chips */}
        <Stack spacing={0.5}>
          {title === "Deal" ? (
            <>
              {statuses?.upcoming !== undefined && (
                <Chip
                  label={`Upcoming: ${statuses?.upcoming}`}
                  size="small"
                  sx={{
                    backgroundColor: "#F7B400",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
              {statuses?.running !== undefined && (
                <Chip
                  label={`Running: ${statuses?.running}`}
                  size="small"
                  sx={{
                    backgroundColor: "#81c784",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}

              {statuses?.expired !== undefined && (
                <Chip
                  label={`Expired: ${statuses?.expired}`}
                  size="small"
                  sx={{
                    backgroundColor: "#e57373",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
            </>
          ) : title === "Volunteer" ? (
            <>
              {statuses?.active !== undefined && (
                <Chip
                  label={`Active: ${statuses?.active}`}
                  size="small"
                  sx={{
                    backgroundColor: "#81c784",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
              {statuses?.inactive !== undefined && (
                <Chip
                  label={`Inactive: ${statuses?.inactive}`}
                  size="small"
                  sx={{
                    backgroundColor: "#e57373",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
            </>
          ) : (
            <>
              {statuses?.pending !== undefined && (
                <Chip
                  label={`Pending: ${statuses?.pending}`}
                  size="small"
                  sx={{
                    backgroundColor: "#F7B400",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
              {statuses?.active !== undefined && (
                <Tooltip
                  title={
                    <Stack>
                      <Typography variant="body2" color="inherit">
                        Active: {statuses?.active}
                      </Typography>
                      <Typography variant="body2" color="inherit">
                        Inactive: {statuses?.inactive}
                      </Typography>
                    </Stack>
                  }
                  arrow
                  placement="top"
                >
                  <Chip
                    label={`Approved: ${+statuses.active + +statuses.inactive}`}
                    size="small"
                    sx={{
                      backgroundColor: "#81c784",
                      color: "#fff",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              )}
              {statuses?.rejected !== undefined && (
                <Chip
                  label={`Rejected: ${statuses?.rejected}`}
                  size="small"
                  sx={{
                    backgroundColor: "#e57373",
                    color: "#fff",
                    fontWeight: "500",
                  }}
                />
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AdminDashboardCard;

// Skeleton
