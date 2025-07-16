"use client";
import { ApiManager } from "@/helpers";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Tooltip,
  TablePagination,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EditIcon, DeleteIcon } from "@/assets";
import { CategoryModal } from "@/component";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setToast } from "@/store/reducer";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [apiError, setApiError] = useState(null);
  const dispatch = useDispatch();

  const fetchTopics = async () => {
    setLoading(true);
    try {
      let path = `category?page=${page + 1}&perPage=${itemsPerPage}`;
      if (searchQuery) path += `&search=${searchQuery}`;

      const { data } = await ApiManager({
        method: "get",
        path,
      });
      setCategories(data?.response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (newCate) => {
    const isEdit = Boolean(selectedCategory);
    try {
      const path = isEdit ? `category/${selectedCategory.id}` : "category";
      const method = isEdit ? "patch" : "post";
      const { data } = await ApiManager({
        method,
        path,
        params: { label: newCate },
      });

      if (isEdit) {
        setCategories((prev) => ({
          ...prev,
          details: prev.details.map((category) =>
            category.id === selectedCategory.id ? data.response : category
          ),
        }));
      } else {
        setCategories((prev) => ({
          ...prev,
          details: [data.response, ...prev.details],
        }));
      }
      dispatch(setToast({ type: "success", message: data?.message }));

      fetchTopics();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error);
      if (error?.response?.status == 422) {
        const apiErrorMessage =
          error?.response?.data?.details?.label || "Validation error occurred.";
        setApiError(apiErrorMessage);
      } else if (error?.response?.status == 400) {
        const apiErrorMessage =
          error?.response?.data?.message || "Bad request.";
        setApiError(apiErrorMessage);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await ApiManager({
        method: "delete",
        path: `category/${id}`,
      });

      setCategories((prev) => ({
        ...prev,
        details: prev.details.filter((category) => category.id !== id),
      }));

      dispatch(setToast({ type: "success", message: data?.message }));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const clearApiError = () => setApiError(null);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    clearApiError();
    setSelectedCategory("");
  };

  useEffect(() => {
    const handler = setTimeout(fetchTopics, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [page, itemsPerPage, searchQuery]);

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
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
        marginBottom={2}
      >
        <TextField
          label="Search Category"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add Category
        </Button>
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
                <TableCell sx={{ color: "white" }}>Label</TableCell>
                <TableCell sx={{ color: "white" }}>Created At</TableCell>
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
              ) : categories?.details?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No categories found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories?.details?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.label}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(category?.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tooltip title="Edit" arrow>
                          <IconButton onClick={() => handleOpenModal(category)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton onClick={() => handleDelete(category.id)}>
                            <DeleteIcon />
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
          count={categories?.totalItems || 0}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>

      {/* category Modal */}
      <CategoryModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        selectedCategory={selectedCategory}
        apiError={apiError}
        clearApiError={clearApiError}
      />
    </Box>
  );
};

export default Categories;
