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
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EditIcon, BarChartIcon, VisibilityIcon } from "@/assets";
import { useRouter } from "next/navigation";
import { InputField, SelectBox, StatusChangeModal } from "@/component";
import { setToast } from "@/store/reducer";
import { useDispatch } from "react-redux";
import moment from "moment";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
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

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      let path = `company?page=${page + 1}&perPage=${itemsPerPage}`;
      if (searchQuery) path += `&search=${searchQuery}`;
      if (filterStatus !== "all") path += `&activationStatus=${filterStatus}`;

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

  useEffect(() => {
    const handler = setTimeout(fetchCompanies, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [page, itemsPerPage, searchQuery, filterStatus]);

  const handleActionClick = (action, company) => {
    switch (action) {
      case "view":
        router.push(`/admin/kyc-verification/${company?.id}?fromCompanies=true`);
        break;
      case "edit":
        router.push(`/admin/company-kyc/${company?.id}`);
        break;
      case "stats":
        window.open(`/admin/company/dashboard?id=${company?.id}&name=${company?.name}`, "_blank");
        break;
      default:
        break;
    }
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
        <Grid item xs={12} sm={5} md={7} lg={8}>
          <Typography variant="h4" fontWeight="SemiBold">
            Companies
          </Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={5} lg={4}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" gap={2}>
            <InputField
              label="Search Company"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SelectBox
              items={StatusData}
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
                      No companies found.
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

        {/* Pagination Section */}
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

export default Companies;


const StatusData = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]