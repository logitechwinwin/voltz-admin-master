"use client";
import {
  Avatar,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
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
import TableContainer from "@/component/TableContainer/TableContainer";
import UITable from "@/component/TableContainer/TableContainer";
import Link from "next/link";
import moment from "moment";

const Ngos = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [sdgs, setSdgs] = useState([]);
  const [selectedSdgs, setSelectedSdgs] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();


  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      let path = `volunteer?page=${page + 1}&perPage=${itemsPerPage}`;
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
      setVolunteers(data?.response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSdgs = async () => {
    try {
      const { data } = await ApiManager({
        method: "get",
        path: `sdgs?page=1&perPage=999`,
      });
      setSdgs(data?.response?.details);
    } catch (error) {
      console.log(error);
    }
  };

  const updateVolunteerStatus = async () => {
    if (!reason.trim()) {
      return;
    }

    const newStatus =
      selectedVolunteer?.activationStatus === "active" ? "inactive" : "active";
    setLoading(true);
    try {
      const { data } = await ApiManager({
        method: "patch",
        path: `admin/change-activation-status/user/${selectedVolunteer?.id}`,
        params: { reason, status: newStatus },
      });

      handleCloseStatusModal(false);
      dispatch(setToast({ type: "success", message: data.message }));
      // fetchVolunteers();
      setVolunteers((prevCompanies) => ({
        ...prevCompanies,
        details: prevCompanies?.details?.map((company) =>
          company.id === selectedVolunteer?.id
            ? { ...company, activationStatus: newStatus }
            : company
        ),
      })

      )
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (company) => {
    setSelectedVolunteer(company);
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
    setSelectedVolunteer(null);
    setReason("");
  };

  useEffect(() => {
    const handler = setTimeout(fetchVolunteers, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [page, itemsPerPage, filterStatus, searchQuery, selectedSdgs]);

  useEffect(() => {
    fetchSdgs();
  }, []);


  const renderTableRow = (item) => {
    return (
      <TableRow key={item?.id}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={item?.profileImage} alt={item?.name} />
            <Typography whiteSpace="nowrap" variant="body2">
              {item?.firstName || ``} {item?.lastName || ``}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{item?.email || "-"}</TableCell>
        <TableCell>{item?.phoneNumber || "-"}</TableCell>
        <TableCell>
          {moment(item.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
        </TableCell>
        <TableCell>
          <Tooltip
            title={
              item?.activationStatus === "active"
                ? "Active"
                : "Inactive"
            }
            arrow
          >
            <Switch
              checked={item?.activationStatus === "active"}
              onChange={() => handleToggleStatus(item)}
              color="primary"
            />
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip title="View" arrow>
            <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}volunteer?value=0&userId=${item?.id}`} target="_blank">
              <IconButton>
                <VisibilityIcon />
              </IconButton>
            </Link>
          </Tooltip>
        </TableCell>

      </TableRow>
    )
  }

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
        <Grid item xs={12} md={3} lg={4}>
          <Typography variant="h4" fontWeight="SemiBold">
            Volunteers
          </Typography>
        </Grid>
        <Grid item xs={12} md={9} lg={8}>
          <Stack direction={{ sm: "column", md: "row" }} justifyContent="flex-end" gap={2}>
            <InputField
              label="Search Volunteer"
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
              variant="outlined"
              label={"Status"}
              items={statusData}
              value={filterStatus}
              optionRenderKeys={{ name: "label", value: "value" }}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </Stack>
        </Grid>
      </Grid>

      <UITable
        headings={tableHeadings}
        spanTd={6}
        isContent={volunteers?.details?.length}
        loading={loading}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        itemsPerPage={itemsPerPage}
        count={volunteers?.totalItems}
        page={page}
      >
        {volunteers?.details?.map((volunteer) => (
          renderTableRow(volunteer)
        ))}
      </UITable>


      {/* Status Modal */}
      {selectedVolunteer && (
        <StatusChangeModal
          open={openStatusModal}
          handleClose={handleCloseStatusModal}
          company={selectedVolunteer}
          reason={reason}
          setReason={setReason}
          updateStatus={updateVolunteerStatus}
          loading={loading}
          fetchData={fetchVolunteers}
        />
      )}
    </Box>
  );
};

export default Ngos;


const statusData = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const tableHeadings = ["Name", "Email", "Phone", "Created At", "Status", "Action"];