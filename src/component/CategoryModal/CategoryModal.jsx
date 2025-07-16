import React from "react";
import { ModalWrapper } from "@/component";
import { TextField, Stack, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";

const CategoryModal = ({
  open,
  onClose,
  onSave,
  selectedCategory,
  apiError,
  clearApiError,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const isValidTopicName = (name) => /^[a-zA-Z0-9\s&]+$/.test(name);

    if (!categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    if (!isValidTopicName(categoryName)) {
      setError("Category name can only contain letters, numbers, and spaces.");
      return;
    }

    if (categoryName.length < 3 || categoryName.length > 40) {
      setError("Category name must be between 3 and 40 characters.");
      return;
    }

    clearApiError();
    onSave(categoryName);
  };

  useEffect(() => {
    setCategoryName(selectedCategory?.label || "");
    setError("");
  }, [selectedCategory]);

  return (
    <ModalWrapper
      open={open}
      handleClose={onClose}
      title={selectedCategory ? "Update Category" : "Add Category"}
    >
      <Box mt={2}>
        <TextField
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          error={!!error || !!apiError}
          helperText={error || apiError}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {selectedCategory ? "Update" : "Add"}
          </Button>
        </Stack>
      </Box>
    </ModalWrapper>
  );
};

export default CategoryModal;
