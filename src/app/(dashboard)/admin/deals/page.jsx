"use client";
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { StatusChangeModal } from "@/component";
import { setToast } from "@/store/reducer";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Voltz } from "@/assets";
import Image from "next/image";
import debounce from "lodash/debounce";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();

  const fetchDeals = async (companyId = null) => {
    setLoading(true);
    try {
      let path = `deal?page=${page + 1}&perPage=${itemsPerPage}`;
      if (searchQuery) path += `&search=${searchQuery}`;
      if (filterStatus !== "all") path += `&activationStatus=${filterStatus}`;
      if (filterState !== "all") {
        path += `&${filterState}=true`;
      }
      if (companyId) {
        path += `&companyId=${companyId}`;
      }

      const { data } = await ApiManager({
        method: "get",
        path,
      });
      setDeals(data?.response?.details);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async (search) => {
    setDropdownLoading(true);
    try {
      let path = `company?page=${page + 1}&perPage=20&search=${companySearchQuery}`;

      const { data } = await ApiManager({
        method: "get",
        path,
      });
      setCompanies(data?.response?.details?.items);
    } catch (error) {
      console.log(error);
    } finally {
      setDropdownLoading(false);
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
        path: `deal/${selectedCompany?.id}/change-activation-status`,
        params: { reason, status: newStatus },
      });
      handleCloseStatusModal(false);
      dispatch(setToast({ type: "success", message: data.message }));

      setDeals((prevCompanies) => ({
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

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    if (newValue) {
      fetchDeals(newValue.id);
    } else {
      fetchDeals();
    }
  };

  const handleCompanySearchChange = debounce((event, value) => {
    setCompanySearchQuery(value);
    if (value) {
      fetchCompanies(value);
    }
  }, 500);

  const currentDate = new Date();
  const getDealStatus = (deal) => {
    if (new Date(deal?.to) < currentDate) {
      return { label: "Expired", color: "#f4433633" };
    }
    if (new Date(deal?.from) > currentDate) {
      return { label: "Upcoming", color: "#2196f333" };
    }
    return { label: "Ongoing", color: "#4caf5033" };
  };

  useEffect(() => {
    const handler = setTimeout(fetchDeals, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [page, itemsPerPage, searchQuery, filterStatus, filterState]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <Box
      component={Paper}
      p={2}
      sx={{
        height: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" fontWeight="SemiBold" gutterBottom>
        Deals
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} gap={2} marginBottom={2}>
        <TextField
          label="Search Deal"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />

        <Autocomplete
          placeholder="Search Company"
          fullWidth
          options={companies}
          getOptionLabel={(option) => option.name}
          onInputChange={handleCompanySearchChange}
          onChange={handleCompanyChange}
          loading={dropdownLoading}
          loadingText={<CircularProgress size={20} />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Company"
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {dropdownLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />

        <FormControl fullWidth variant="outlined">
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

        <FormControl fullWidth variant="outlined">
          <InputLabel>State</InputLabel>
          <Select
            label="State"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="onGoing">Ongoing</MenuItem>
            <MenuItem value="upComing">Upcoming</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </Select>
        </FormControl>
      </Stack>

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
                  Deal Name
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Company Name
                </TableCell>
                <TableCell sx={{ color: "white" }}>State</TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Deal Amount
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Discounted Amount
                </TableCell>
                <TableCell sx={{ color: "white" }}>Voltz</TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  End Date
                </TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : deals?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No Deals found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                deals?.items?.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={deal.bannerImage} alt={deal.dealName} />
                        <Typography whiteSpace="nowrap" variant="body2">
                          {deal.dealName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={deal.user.profileImage}
                          alt={deal.user.name}
                        />
                        <Typography whiteSpace="nowrap" variant="body2">
                          {deal.user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getDealStatus(deal).label}
                        sx={{ backgroundColor: getDealStatus(deal).color }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography display="inline">{`$${parseFloat(Number(deal?.dealAmount).toFixed(2))}`}</Typography>
                      <Typography
                        display="inline"
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 0.5 }}
                      >
                        {deal?.discountType === "fixed"
                          ? ` ($${deal?.discountAmount} Off)`
                          : ` (${deal?.discountAmount}% Off)`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>${deal?.dealAmountAfterDiscount}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        bgcolor="#FAFAFA"
                        gap={0.5}
                        alignSelf="center"
                        sx={{
                          px: 1,
                          borderRadius: 10,
                          maxWidth: "fit-content",
                        }}
                      >
                        <Typography
                          color="secondary.main"
                          variant="body1"
                          fontWeight="bold"
                        >
                          {deal?.voltzRequired}
                        </Typography>
                        <Image
                          src={Voltz}
                          height={18}
                          width={18}
                          alt="logo"
                          priority
                        />
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(deal?.from).format(
                        process.env.NEXT_PUBLIC_DATE_FORMAT
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(deal?.to).format(
                        process.env.NEXT_PUBLIC_DATE_FORMAT
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          deal?.activationStatus === "active"
                            ? "Active"
                            : "Inactive"
                        }
                        arrow
                      >
                        <Switch
                          checked={deal?.activationStatus === "active"}
                          onChange={() => handleToggleStatus(deal)}
                          color="primary"
                        />
                      </Tooltip>
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
          count={deals?.meta?.totalItems || 0}
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

export default Deals;
