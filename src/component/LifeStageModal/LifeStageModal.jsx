import React from "react";
import { ModalWrapper } from "@/component";
import { TextField, Stack, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";

const LifeStageModal = ({
  open,
  onClose,
  onSave,
  selectedLifeStage,
  apiError,
  clearApiError,
}) => {
  const [topicName, setTopicName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const isValidTopicName = (name) => /^[a-zA-Z0-9\s&]+$/.test(name);

    if (!topicName.trim()) {
      setError("Life Stage name cannot be empty.");
      return;
    }

    if (!isValidTopicName(topicName)) {
      setError(
        "Life Stage name can only contain letters, numbers, and spaces."
      );
      return;
    }

    if (topicName.length < 3 || topicName.length > 40) {
      setError("Life Stage name must be between 3 and 40 characters.");
      return;
    }

    // setTopicName("");
    clearApiError();
    onSave(topicName);
  };

  useEffect(() => {
    setTopicName(selectedLifeStage?.label || "");
    setError("");
  }, [selectedLifeStage]);

  return (
    <ModalWrapper
      open={open}
      handleClose={onClose}
      title={selectedLifeStage ? "Update Life Stage" : "Add Life Stage"}
    >
      <Box mt={2}>
        <TextField
          label="Life Stage Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          fullWidth
          error={!!error || !!apiError}
          helperText={error || apiError}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {selectedLifeStage ? "Update" : "Add"}
          </Button>
        </Stack>
      </Box>
    </ModalWrapper>
  );
};

export default LifeStageModal;
