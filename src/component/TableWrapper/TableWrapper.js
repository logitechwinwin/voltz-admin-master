/* eslint-disable no-unused-vars */
"use client";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  TableFooter,
  Stack,
  Box,
} from "@mui/material";

import UsePagination from "../UsePagination/UsePagination";

function TableWrapper({
  tableStyle,
  containerStyle,
  spanTd,
  message,
  isLoading,
  isContent,
  children,
  thContent,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  page,
  rowsPerPage,
  perPage,
  total,
  showPagination,
  ...props
}) {
  return (
    // <TableContainer sx={{whiteSpace:'nowrap', ...containerStyle,"& .MuiTableCell-root":{
    //   textAlign:'center'
    // }}}>
    <TableContainer
      component={Stack}
      justifyContent="space-between"
      sx={{
        whiteSpace: "nowrap",
        ...containerStyle,
        "& .MuiTableCell-root": {},
        height: "97%",
        overflowX: "auto", // Allow horizontal scrolling
        "&::-webkit-scrollbar": {
          width: "8px", // Width of the scrollbar
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#06B0BA", // Color of the scrollbar thumb
          borderRadius: "4px", // Rounded edges for the scrollbar thumb
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1", // Background color of the scrollbar track
          borderRadius: "4px", // Rounded edges for the scrollbar track
        },
        scrollbarWidth: "thin", // Firefox: thin scrollbar
        scrollbarColor: "#06B0BA #f1f1f1", // Firefox: thumb and track color
      }}
    >
      <Table sx={[tableStyle]} {...props}>
        <TableHead>
          <TableRow>
            {thContent?.map((each, index) => {
              return (
                <TableCell key={index}>
                  <Typography variant="body1" fontWeight="SemiBold">
                    {each}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <CircularProgress size={22} />
              </TableCell>
            </TableRow>
          ) : isContent ? (
            children
          ) : (
            <TableRow>
              <TableCell colSpan={spanTd} align="center">
                <Typography sx={{ textAlign: "center" }} variant="caption1">
                  {message ? message : "No Records Found"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Stack sx={{ width: "100%" }}>
        {pagination}
        {showPagination && (
          <Stack alignSelf="center" py={4}>
            <UsePagination
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              perPage={perPage || 0}
              total={total || 0}
            />
          </Stack>
        )}
      </Stack>
    </TableContainer>
  );
}
TableWrapper.defaultProps = {
  tableStyle: {},
  spanTd: "1",
  message: null,
  isContent: false,
  isLoading: false,
};
export default TableWrapper;
