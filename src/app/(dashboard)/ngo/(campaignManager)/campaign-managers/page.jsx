"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Container,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AddIcon, EditIcon } from "@/assets";
import {
  SecondaryButton,
  TableWrapper,
  BasicMenu,
  DeleteModal,
} from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";
import Utils from "@/Utils";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Flag from "react-world-flags";
import UITable from "@/component/TableContainer/TableContainer";
import { Delete } from "@mui/icons-material";

const CampaignManagers = () => {
  const isMobile = useMediaQuery("(max-width:540px)");
  const [page, setPage] = useState(0);
  const [managers, setManagers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [modalLoading, setModalLoading] = useState(false);
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  const getCampaignManagers = async () => {
    // dispatch(handleLoader(true));
    setIsLoading(true);
    try {
      let { data } = await ApiManager({
        path: `campaign-manager?ngoId=${user?.id}&page=${page + 1}&perPage=${itemsPerPage}`,
      });
      console.log("data?.message", data);
      setManagers(data?.response);
      setTotalPages(data?.response?.totalPages);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setIsLoading(false);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      let { data } = await ApiManager({
        method: "delete",
        path: `campaign-manager/${deleteId?.id}`,
      });
      getCampaignManagers();
      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      dispatch(
        setToast({
          type: error?.response?.status === 400 ? "info" : "error",
          message: error?.response?.data?.message,
        })
      );
    } finally {
      setModalLoading(false);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    getCampaignManagers();
  }, [page, itemsPerPage]);

  return (
    <Container maxWidth="lg" sx={styles.table}>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={!isMobile && "center"}
        mb={4}
      >
        <Stack>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            color={"text.heading"}
          >
            Campaign Managers
          </Typography>
          <Typography variant="subtitle1" component="h2" color="text.heading">
            Campaign managers can approve voltz
          </Typography>
        </Stack>
        <SecondaryButton
          fullWidth={false}
          LinkComponent={Link}
          href="/ngo/add-campaign-manager"
          startIcon={<AddIcon />}
          sx={isMobile && { alignSelf: "flex-end", mt: 1.5 }}
        >
          Add New
        </SecondaryButton>
      </Stack>

      <Stack sx={{ minHeight: 'calc(100vh - 250px)' }}>
        <UITable
          headings={["Campaign Manager", "Email", "Phone Number", "Actions"]}
          spanTd={4}
          isContent={managers?.details?.length}
          loading={isLoading}
          handlePageChange={(_, value) => setPage(value)}
          handleRowsPerPageChange={handleRowsPerPageChange}
          itemsPerPage={itemsPerPage}
          count={managers?.totalItems}
          page={page}
        >
          {managers?.details?.map((manager, i) => (
            <RenderRow
              key={i}
              data={manager}
              setOpen={setOpenModal}
              setDeleteId={setDeleteId}
            />
          ))}
        </UITable>
      </Stack>

      <DeleteModal
        loading={modalLoading}
        open={openModal}
        setOpen={setOpenModal}
        deleteId={deleteId}
        callback={handleDelete}
      />
    </Container>
  );
};

export default CampaignManagers;

const RenderRow = ({ data, setOpen, setDeleteId }) => {
  const phoneNumber = parsePhoneNumberFromString(data?.phoneNumber || "");
  const formattedPhoneNumber = phoneNumber
    ? phoneNumber.formatInternational()
    : data?.phoneNumber;
  const countryCode = phoneNumber ? phoneNumber?.country : "US";
  return (
    <TableRow>
      <TableCell sx={{ maxWidth: "140px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap={2}
        >
          <Avatar src={data?.profileImage} alt="" />
          {Utils.limitStringWithEllipsis(
            `${data?.firstName} ${data?.lastName}`,
            16
          )}
        </Stack>
      </TableCell>
      <TableCell>{data?.email}</TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" gap={1}>
          <Flag
            code={countryCode?.toLowerCase()}
            style={{ width: 24, height: 16 }}
          />
          <span>{formattedPhoneNumber}</span>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction='row' alignItems='center'>
          <Tooltip title="Edit">
            <IconButton>
              <Link href={`/ngo/update-campaign-manager?managerId=${data?.id}`}>
                <EditIcon />
              </Link>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => {
              setOpen(true);
              setDeleteId(data);
            }}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
    
      </TableCell>
    </TableRow>
  );
};

const styles = {
  table: {
    backgroundColor: "white",
    py: 3,
    borderRadius: "12px",
    boxShadow: "0px 3.11px 3.11px 0px #00000033",
  },
};
