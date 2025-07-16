"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { SelectBox } from "@/component";
import { ApiManager } from "@/helpers";
import useQueryParams from "@/hooks/useQueryParams";
import { setToast } from "@/store/reducer";
import Utils from "@/Utils";
import { EditIcon, VisibilityIcon } from "@/assets";
import moment from "moment";

const Users = () => {
  const [users, setUsers] = useState(null);
  const { queryParams, setQueryParams } = useQueryParams({
    role: "all",
    registrationStatus: "all",
    page: 1,
  });
  const [filter, setFilter] = useState(queryParams);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  let router = useRouter();
  const dispatch = useDispatch();

  const getUsers = async () => {
    setLoading(true);
    let query = Utils.buildQueryString({
      ...filter,
      page: page + 1,
      perPage: itemsPerPage,
    });
    try {
      let { data } = await ApiManager({
        method: "get",
        path: `admin/kyc-verifications?${query}`,
      });
      setUsers(data?.response);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    let { name, value } = e.target;
    if (name === "page") {
      setFilter((prev) => ({ ...prev, [name]: value }));
    } else {
      setFilter((prev) => ({ ...prev, [name]: value, page: 1 }));
    }
    setQueryParams(name, value);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getUsers();
  }, [filter, page, itemsPerPage]);

  const handleActionClick = (action, userId, role) => {
    switch (action) {
      case "view":
        router.push(`/admin/kyc-verification/${userId}`);
        break;
      case "edit":
        router.push(`/admin/${role}-kyc/${userId}?redirectUrl=/admin/kyc-verification`);
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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          KYC Verification
        </Typography>
        <Stack gap={2} direction="row" ml="auto" sx={{ width: "fit-content" }}>
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/admin/ngo-kyc"
          >
            Create NGO
          </Button>
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/admin/company-kyc"
          >
            Create Company
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        my={2}
        sx={{ width: "fullWidth" }}
        gap={2}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} gap={2}>
          <SelectBox
            items={roleOpt}
            optionRenderKeys={{ name: "label", value: "value" }}
            size="small"
            label={"Role"}
            value={filter?.role}
            onChange={handleFilter}
            name="role"
          />
          <SelectBox
            items={StatusOpt}
            optionRenderKeys={{ name: "label", value: "value" }}
            size="small"
            name="registrationStatus"
            label={"Status"}
            value={filter?.registrationStatus}
            onChange={handleFilter}
          />
        </Stack>
      </Stack>

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
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Reg Number
                </TableCell>
                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  Reg Status
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <Typography>Email</Typography>
                </TableCell>
                <TableCell sx={{ color: "white" }}>Role</TableCell>

                <TableCell sx={{ color: "white", whiteSpace: "nowrap" }}>
                  created At
                </TableCell>
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
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users?.details?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users?.details?.map((user, i) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={user.profileImage} alt={user.name} />
                        <Typography whiteSpace="nowrap" variant="body2">
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{user.regNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user?.registrationStatus[0].toUpperCase() +
                          user?.registrationStatus.slice(1)
                        }
                        sx={{
                          backgroundColor:
                            user?.registrationStatus === "approved"
                              ? "#4caf5033"
                              : user?.registrationStatus === "rejected"
                                ? "#f4433633"
                                : "#F7B40033",
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {moment(user.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
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
                              handleActionClick("view", user.id, user.role)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" arrow>
                          <IconButton
                            onClick={() =>
                              handleActionClick("edit", user.id, user.role)
                            }
                          >
                            <EditIcon />
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
          count={users?.totalItems || 0}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    </Box>
  );
};

export default Users;

let roleOpt = [
  { label: "All", value: "all" },
  { label: "Company", value: "company" },
  { label: "Ngo", value: "ngo" },
];

let StatusOpt = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];
