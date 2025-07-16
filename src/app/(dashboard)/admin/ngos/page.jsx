"use client";
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
  Checkbox,
  Grid,
} from "@mui/material";
import { ApiManager } from "@/helpers";
import { useEffect, useState } from "react";
import { EditIcon, BarChartIcon, VisibilityIcon } from "@/assets";
import { useRouter } from "next/navigation";
import { AutoComplete, InputField, SelectBox, StatusChangeModal } from "@/component";
import { setToast } from "@/store/reducer";
import { useDispatch } from "react-redux";
import moment from "moment";

const Ngos = () => {
  const [companies, setCompanies] = useState([]);
  const [sdgs, setSdgs] = useState([]);
  const [selectedSdgs, setSelectedSdgs] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchNgos = async () => {
    setLoading(true);
    try {
      let path = `ngo?page=${page + 1}&perPage=${itemsPerPage}`;
      if (searchQuery) path += `&search=${searchQuery}`;
      if (filterStatus !== "all") path += `&activationStatus=${filterStatus}`;
      if (selectedSdgs.length > 0) {
        const sdgsQuery = selectedSdgs
          .map((sdg) => `sdgs[]=${sdg.id}`)
          .join("&");
        path += `&${sdgsQuery}`;
      }

      const { data } = await ApiManager({
        method: "get",
        path,
      });
      setCompanies(data?.response?.details);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSdgs = async () => {
    setLoading(true);
    try {
      const { data } = await ApiManager({
        method: "get",
        path: `sdgs?page=1&perPage=999`,
      });
      setSdgs(data?.response?.details);
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
        path: `admin/change-activation-status/user/${selectedCompany?.id}`,
        params: { reason, status: newStatus },
      });

      handleCloseStatusModal(false);
      dispatch(setToast({ type: "success", message: data.message }));

      setCompanies((prevCompanies) => ({
        items: prevCompanies?.items.map((company) =>
          company.id === selectedCompany?.id
            ? { ...company, activationStatus: newStatus }
            : company
        ),
        meta: prevCompanies?.meta,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
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

  const handleChange = (e, value) => {
    setSelectedSdgs(value);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedCompany(null);
    setReason("");
  };

  useEffect(() => {
    const handler = setTimeout(fetchNgos, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [page, itemsPerPage, filterStatus, searchQuery, selectedSdgs]);

  useEffect(() => {
    fetchSdgs();
  }, []);

  const handleActionClick = (action, company) => {
    switch (action) {
      case "view":
        router.push(`/admin/kyc-verification/${company?.id}?fromCompanies=true`);
        break;
      case "edit":
        router.push(`/admin/ngo-kyc/${company?.id}`);
        break;
      case "stats":
        window.open(`/admin/ngo/dashboard?id=${company?.id}&name=${company?.name}`, "_blank");
        break;
      default:
        break;
    }
  };

  const MAX_VISIBLE_TAGS = 2;
  const renderTruncatedTags = (value, getTagProps) => {
    if (value.length > MAX_VISIBLE_TAGS) {
      return [
        ...value
          .slice(0, MAX_VISIBLE_TAGS)
          .map((option, index) => (
            <Chip
              size="small"
              key={option.id}
              label={option.label}
              {...getTagProps({ index })}
            />
          )),
        <Chip
          size="small"
          key="more"
          label={`+${value.length - MAX_VISIBLE_TAGS} more...`}
        />,
      ];
    }

    return value.map((option, index) => (
      <Chip
        size="small"
        key={option.id}
        label={option.label}
        {...getTagProps({ index })}
      />
    ));
  };

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
      <Grid container spacing={{ xs: 2, md: 0 }} alignItems="center" mb={4}>
        <Grid item xs={12} md={2} lg={4}>
          <Typography variant="h4" fontWeight="SemiBold">
            NGOs
          </Typography>
        </Grid>
        <Grid item xs={12} md={10} lg={8}>
          <Stack direction={{ sm: "column", md: "row" }} justifyContent="flex-end" gap={2}>
            <InputField
              label="Search Ngo"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <AutoComplete
              fullWidth
              multiple
              label="Select SDGs"
              placeholder="Choose..."
              options={sdgs}
              onChange={(e, v) => setSelectedSdgs(v)}
              value={selectedSdgs}
              disableCloseOnSelect
              limitTags={2}
              getOptionLabel={(option) => option.label}
            />
            <SelectBox
              items={statusData}
              optionRenderKeys={{ name: "label", value: "value" }}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
            />
          </Stack>
        </Grid>
      </Grid>

      <TableContainer
        sx={{
          flex: 1,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflowY: "auto",
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
                <TableCell sx={{ color: "white" }}>Name</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Reg Number
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Created At
                </TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : companies?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No Ngos found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companies?.items?.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={company.profileImage} alt={company.name} />
                        <Typography whiteSpace="nowrap" variant="body2">
                          {company.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.regNumber}</TableCell>
                    <TableCell>
                      {/* {new Date(company.createdAt).toLocaleDateString()} */}
                      {moment(company.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          company.activationStatus === "active"
                            ? "Active"
                            : "Inactive"
                        }
                        arrow
                      >
                        <Switch
                          checked={company.activationStatus === "active"}
                          onChange={() => handleToggleStatus(company)}
                          color="primary"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="View" arrow>
                          <IconButton
                            onClick={() =>
                              handleActionClick("view", company)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            onClick={() =>
                              handleActionClick("edit", company)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Stats" arrow>
                          <IconButton
                            onClick={() =>
                              handleActionClick("stats", company)
                            }
                          >
                            <BarChartIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pagination  */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={companies?.meta?.totalItems || 0}
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

export default Ngos;

const statusData = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]