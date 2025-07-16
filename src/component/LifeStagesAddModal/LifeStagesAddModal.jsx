import { useEffect, useState } from "react";

import { Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";

import { InputField, ModalWrapper } from "..";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const StageAddModal = ({
  topicForEdit,
  stage,
  setLifeStage,
  open,
  setOpen,
  getLifeStages,
}) => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState({});

  let dataToSend = {
    params: { label: stage },
    ...(topicForEdit?.id
      ? { method: "patch", path: `life-stage/${topicForEdit?.id}` }
      : { method: "post", path: `life-stage` }),
  };

  useEffect(() => {
    if (topicForEdit?.id) {
      setLifeStage(topicForEdit?.label);
    }
  }, [topicForEdit]);

  const handleUpdateTopic = async () => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;

    // Check if the label has not been changed in edit mode
    if (topicForEdit?.id && topicForEdit?.label === stage.trim()) {
      // Inform the user that no changes were made
      dispatch(
        setToast({
          type: "success",
          message: "Life stage updated successfully",
        })
      );
      setOpen(false); // Close the modal
      return;
    }

    if (!stage.trim()) {
      setFormError({ label: "This field is required" });
      return;
    } else if (specialCharRegex.test(stage)) {
      setFormError({ label: "Special characters are not allowed" });
      return;
    }

    dispatch(handleLoader(true));
    setFormError({});
    try {
      let { data } = await ApiManager(dataToSend);
      dispatch(setToast({ type: "success", message: data?.message }));
      setOpen(false);
      setLifeStage("");
      getLifeStages();
    } catch (error) {
      console.log("🚀 ~ handleUpdateTopic ~ error:", error);
      if (error?.response?.status == 422) {
        setFormError(error.response.data?.details);
      } else {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    } finally {
      dispatch(handleLoader(false));
    }
  };

  const onClose = () => {
    setOpen(false);
    setFormError({});
    setLifeStage(topicForEdit?.label);
  };

  return (
    <>
      <ModalWrapper
        open={open}
        handleClose={onClose}
        title={`${topicForEdit?.id ? `Update Life Stage` : `Add Life Stage`}`}
      >
        <Stack alignItems="flex-end" gap={2}>
          <InputField
            onChange={(e) => setLifeStage(e.target.value)}
            value={stage}
            error={formError?.label}
            label="Life Stage"
            styles={{ my: 1 }}
          />
          <Button onClick={handleUpdateTopic}>
            {topicForEdit?.id ? `Update` : `Add`}
          </Button>
        </Stack>
      </ModalWrapper>
    </>
  );
};

export default StageAddModal;
