import { ApiManager } from "@/helpers";
import {
  Avatar,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Stack,
  Tooltip,
  TablePagination,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Autocomplete,
  Grid,
} from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive';
import { useEffect, useState } from "react";
import { ArchiveModal, AutoComplete, SecondaryButton, StatusChangeModal } from "@/component";
import { setToast } from "@/store/reducer";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon, VisibilityIcon } from "@/assets";
import { useRouter } from "next/navigation";
import moment from "moment";
import debounce from "lodash/debounce";
import Link from "next/link";
import { Add } from "@mui/icons-material";

const NgoEvents = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [managers, setManagers] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ngoSearchQuery, setNgoSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [filterArchive, setFilterArchive] = useState("all");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reason, setReason] = useState("");
  const [openModal, setOpenModal] = useState(false)
  const [event, setEvent] = useState(null)
  const [campaignManagerId, setCampaignManagerId] = useState(null)
  const { user } = useSelector(state => state.appReducer)
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      let path = `events?type=campaign&page=${page + 1}&perPage=${itemsPerPage}&ngoId=${user?.campaignManagerCreatedBy?.id}&campaignManagerId=${user?.id}`;
      if (searchQuery) path += `&search=${searchQuery}`;
      if (filterStatus !== "all") path += `&activationStatus=${filterStatus}`;
      if (filterState !== "all") {
        path += `&${filterState}=true`;
      }
      if (filterArchive !== "all") {
        path += `&${filterArchive}=true`;
      }

      const { data } = await ApiManager({
        method: "get",
        path,
      });
      setCampaigns(data?.response?.details);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async () => {
    if (!reason.trim()) {
      return;
    }
    const newStatus =
      selectedCompany?.activationStatus === "active" ? "inactive" : "active";
    setLoading(true);
    try {
      const { data } = await ApiManager({
        method: "patch",
        path: `events/${selectedCompany?.id}/change-activation-status`,
        params: { reason, status: newStatus },
      });
      handleCloseStatusModal(false);
      dispatch(setToast({ type: "success", message: data.message }));

      setCampaigns((prevCompanies) => ({
        items: prevCompanies?.items.map((company) =>
          company.id === selectedCompany?.id
            ? { ...company, activationStatus: newStatus }
            : company
        ),
        meta: prevCompanies?.meta,
      }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (company) => {
    setSelectedCompany(company);
    setOpenStatusModal(true);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedCompany(null);
    setReason("");
  };

  const getDealStatus = (campaign) => {
    const currentDate = new Date();
    const isExpired = new Date(campaign?.endDate) < currentDate;
    const isUpcoming = new Date(campaign?.startDate) > currentDate;

    return isExpired
      ? { label: "Expired", color: "#f4433633" }
      : isUpcoming
        ? { label: "Upcoming", color: "#2196f333" }
        : { label: "Ongoing", color: "#4caf5033" };
  };

  useEffect(() => {
    const handler = setTimeout(fetchCampaign, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [
    page,
    itemsPerPage,
    searchQuery,
    filterStatus,
    filterState,
    filterArchive,
  ]);


  return (
    <Box
      component={Paper}
      p={2}
      sx={{
        height: "calc(100vh - 118px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant="h4" fontWeight="SemiBold" gutterBottom>
          Campaigns
        </Typography>
      </Stack>

      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search Campaign"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={selectedNgo ? 4 : 2}>
          <FormControl fullWidth variant="outlined" >
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={selectedNgo ? 4 : 2}>
          <FormControl fullWidth variant="outlined" >
            <InputLabel>State</InputLabel>
            <Select
              label="State"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="onGoingOnly">Ongoing</MenuItem>
              <MenuItem value="upcomingOnly">Upcoming</MenuItem>
              <MenuItem value="expiredOnly">Expired</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={selectedNgo ? 4 : 2}>
          <FormControl fullWidth variant="outlined" >
            <InputLabel>Arhive Status</InputLabel>
            <Select
              label="Arhive Status"
              value={filterArchive}
              onChange={(e) => setFilterArchive(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="archivedOnly">Archived</MenuItem>
              <MenuItem value="notArchivedOnly">Not Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer
        sx={{
          flex: 1,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Table Section */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Table>
            <TableHead
              sx={{
                bgcolor: "primary.main",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Campaign
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  State
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Archive Status
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  End Date
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Volunteer Required
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Donation Required
                </TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : campaigns?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No campaigns found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                campaigns?.items?.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={campaign.bannerImage}
                          alt={campaign.dealName}
                        />
                        <Typography whiteSpace="nowrap" variant="body2">
                          {campaign.title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getDealStatus(campaign).label}
                        sx={{ backgroundColor: getDealStatus(campaign).color }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Chip
                        label={
                          campaign?.closed === null ? "Not Archive" : "Archive"
                        }
                        sx={{
                          backgroundColor:
                            campaign?.closed === null
                              ? "#4caf5033"
                              : "#f4433633",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(campaign?.startDate).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(campaign?.endDate).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", textAlign: "center" }}
                    >
                      {campaign?.volunteerRequired}
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", textAlign: "center" }}
                    >
                      {campaign?.donationRequired}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          campaign?.activationStatus === "active"
                            ? "Active"
                            : "Inactive by admin"
                        }
                        arrow
                      >
                        <Typography sx={{ textTransform: "capitalize" }}
                          color={campaign?.activationStatus === 'active' ? '#5CB85C' : 'error'}
                        >{campaign?.activationStatus}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                      >
                        <Link href={`campaign/${campaign?.id}`}>
                          <Tooltip title="View" arrow>
                            <IconButton>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        {/* Pagination Section */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={campaigns?.meta?.totalItems || 0}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>

      {/* Status Modal */}
      {selectedCompany && (
        <StatusChangeModal
          open={openStatusModal}
          handleClose={handleCloseStatusModal}
          company={selectedCompany}
          reason={reason}
          setReason={setReason}
          updateStatus={updateCompanyStatus}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default NgoEvents;

const statusData = [
  { label: "Ongoing", value: "onGoing" },
  { label: "Upcoming", value: "upComing" },
  { label: "Expired", value: "expired" },
];
const typeData = [
  { label: "Charity", value: "charity" },
  { label: "Campaign", value: "campaign" },
];
const archiveStatusData = [
  { label: "Archived", value: true },
  { label: "Not Archived", value: false },
];
