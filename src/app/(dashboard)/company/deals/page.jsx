/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  Chip,
  Select,
  Tooltip,
  InputLabel,
  FormControl,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { Voltz } from "@/assets";
import {
  DeleteDialogBox,
  ModalWrapper,
  SecondaryButton,
  SelectBox,
  TableWrapper,
} from "@/component";
import BasicMenu from "@/component/Menu/Menu";
import { ApiManager } from "@/helpers";
import useQueryParams from "@/hooks/useQueryParams";
import { handleLoader, setToast } from "@/store/reducer";
import Utils from "@/Utils";
import UITable from "@/component/TableContainer/TableContainer";
import Grid from "@mui/material/Unstable_Grid2";

const Deals = () => {
  const [deals, setDeals] = useState();
  const { queryParams, setQueryParams } = useQueryParams({ page: 0 });
  const [page, setPage] = useState(+queryParams?.page);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [products, setProducts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState({
    state: 'all',
    status: 'all'
  });
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  const getDeals = async () => {
    setLoading(true);
    let path = `deal?companyId=${user?.id}&page=${page + 1}&perPage=${itemsPerPage}`;

    if (filter.state !== "all") path += `&${filter.state}=true`;
    if (filter.status !== "all") path += `&activationStatus=${filter?.status}`;

    try {
      let { data } = await ApiManager({ path });
      setDeals(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      let { data } = await ApiManager({ path: "product" });
      console.log("data?.message", data?.response?.details);
      setProducts(data?.response?.details);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilter((prev) => ({ ...prev, [name]: value }))
    setPage(0);
    getDeals();
  };

  const DeleteDeal = async (deal) => {
    dispatch(handleLoader(true));
    try {
      let { data } = await ApiManager({
        method: "delete",
        path: `deal/${deal?.id}`,
      });
      console.log("data?.message", data);
      getDeals();
      dispatch(setToast({ type: "success", message: data?.message }));
      setDeleteId(null);
      setOpenDelete(false);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      dispatch(handleLoader(false));
    }
  };
  const handlePagination = (_, count) => {
    setPage(count);
    setQueryParams("page", count);
  };
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // const currentDate = new Date();
  // const isExpired = new Date(deals?.to) < currentDate;

  useEffect(() => {
    getDeals();
  }, [page, filter, itemsPerPage]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={Style.table}>
      <Grid
        container
        gap={2}
        mb={"30px"}
      // justifyContent="space-between"
      >
        <Grid item xs={12}>
          <Typography variant="h4" fontWeight="SemiBold">
            Deals
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent={'flex-end'} spacing={1.8} gap={0.9}>
          {/* Filter SelectBox */}
          <Grid item xs={12} sm={6.9} md={8} container justifyContent={'flex-end'} spacing={{ xs: 1, md: 2 }}>
            <Grid item xs={12} sm={5.8} md={5.5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  name="state"
                  value={filter?.state}
                  onChange={(e) => handleFilterChange(e, true)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="onGoing">Ongoing</MenuItem>
                  <MenuItem value="upComing">Upcoming</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5.8} md={5.5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={filter?.status}
                  onChange={(e) => handleFilterChange(e)}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid >
          <Grid item xs={12} sm={4.9} md={3.2} justifyItems={'flex-end'}>
            <SecondaryButton
              LinkComponent={Link}
              href={products?.items?.length ? "/company/create-deal" : "#"}
              startIcon={<Add />}
              onClick={() => !products?.items?.length && setOpen(true)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "1rem" },
              }}
              fullWidth
            >
              Create an Offer
            </SecondaryButton>
          </Grid>
        </Grid>
      </Grid>
      <Stack sx={{ minHeight: "500px" }}>
        <UITable
          headings={[
            "Deal Name",
            "State",
            "Deal Amount",
            "Voltz",
            "Start Date",
            "End Date",
            "Status",
            "Final Amount",
            "Action",
          ]}
          spanTd={8}
          isContent={deals?.items?.length}
          loading={loading}
          handlePageChange={handlePagination}
          handleRowsPerPageChange={handleRowsPerPageChange}
          itemsPerPage={itemsPerPage}
          count={deals?.meta?.totalItems}
          page={page}
        >
          {deals?.items?.map((deal, i) => (
            <RenderRow
              key={i}
              deal={deal}
              setOpenDelete={setOpenDelete}
              setDeleteId={setDeleteId}
            />
          ))}
        </UITable>
      </Stack>
      <ModalWrapper open={open} handleClose={() => setOpen(false)}>
        <Stack sx={{ p: 3 }} gap={2}>
          <Typography variant="h6">
            Please add some products before creating a Deal.
          </Typography>
          <Stack direction="row" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              LinkComponent={Link}
              href="/company/products"
            >
              Add Product
            </Button>
          </Stack>
        </Stack>
      </ModalWrapper>
      <DeleteDialogBox
        title="Deal"
        name={deleteId?.name}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onClick={() => DeleteDeal(deleteId)}
      />
    </Container>
  );
};

export default Deals;

const RenderRow = ({ deal, setOpenDelete, setDeleteId }) => {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const currentDate = new Date();
  const isExpired = new Date(deal?.to) < currentDate;
  const isUpcoming = new Date(deal?.from) > currentDate;

  return (
    <TableRow>
      <TableCell sx={{ maxWidth: "180px" }}>
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: 0.5, sm: 1, md: 2 }}
        >
          <Avatar variant="rounded" src={deal?.bannerImage} />
          <Typography fontWeight="Medium">
            {Utils.limitStringWithEllipsis(deal?.dealName, 15)}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell sx={{ maxWidth: "fit-content" }}>
        <Chip
          label={isExpired ? "Expired" : isUpcoming ? "Upcoming" : "Ongoing"}
          sx={{
            backgroundColor: isExpired
              ? "#f4433633"
              : isUpcoming
                ? "#2196f333"
                : "#4caf5033",
          }}
        />
      </TableCell>
      <TableCell sx={{ textAlign: "left" }}>
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
        <Stack
          direction="row"
          bgcolor="#FAFAFA"
          gap={1}
          alignSelf="center"
          sx={{ px: 1, borderRadius: 10, maxWidth: "fit-content" }}
        >
          <Typography color="secondary.main" variant="body1" fontWeight="bold">
            {deal?.voltzRequired}
          </Typography>
          <Image src={Voltz} height={20} width={20} alt="logo" priority />
        </Stack>
      </TableCell>
      <TableCell>{moment(deal?.from).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
      <TableCell>{moment(deal?.to).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
      <TableCell>
        <Tooltip
          title={
            deal?.activationStatus === "active"
              ? "Active"
              : "Inactive by admin"
          }
          arrow
        >
          <Typography sx={{ textTransform: "capitalize" }}
            color={deal?.activationStatus === 'active' ? '#5CB85C' : 'error'}
          >{deal?.activationStatus}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>${deal?.dealAmountAfterDiscount}</TableCell>
      <TableCell>
        <BasicMenu setOpenMenu={setOpenMenu} openMenu={openMenu}>
          <MenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            <Link
              LinkComponent={Link}
              href={`/company/update-deal/${deal?.id}`}
            >
              Edit Offer Details
            </Link>
          </MenuItem>

          <MenuItem
            onClick={() => {
              setOpenDelete(true);
              setDeleteId(deal);
            }}
          >
            Delete
          </MenuItem>
        </BasicMenu>
      </TableCell>
    </TableRow>
  );
};

const Style = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
