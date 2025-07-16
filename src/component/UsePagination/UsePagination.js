"use client";

import React from "react";
import { TableRow, Pagination } from "@mui/material";

const UsePagination = ({
  onChangePage = (value) => {},
  onChangeRowsPerPage,
  rowsPerPage,
  page,
  total = 10,
  perPage = 10,
  setPage = (value) => {},
}) => {
  const [totalPages, setTotalPages] = React.useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    let count = Math.ceil(total / perPage);
    setTotalPages(count === 0 ? 1 : count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const handlePagination = (event, value) => {
    setPage(value);
    onChangePage(event, value);
  };

  return (
    <Pagination
      count={totalPages || 0}
      page={page}
      onChange={handlePagination}
      variant="outlined"
      shape="rounded"
      dir="ltr"
      color="secondary"
    />
  );
};

export default UsePagination;
