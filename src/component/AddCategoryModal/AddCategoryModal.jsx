import { useEffect, useState } from "react";

import { Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";

import { InputField, ModalWrapper } from "..";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";

const AddCategoryModal = ({ categoryForEdit, category, setCategory, open, setOpen, getCategories }) => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState({});

  let dataToSend = {
    params: { label: category },
    ...(categoryForEdit?.id ? { method: "patch", path: `category/${categoryForEdit?.id}` } : { method: "post", path: `category` }),
  };

  useEffect(() => {
    if (categoryForEdit?.id) {
      setCategory(categoryForEdit?.label);
    }
  }, [categoryForEdit]);

  const handleUpdateTopic = async () => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    try {
      if (!category.trim()) {
        setFormError({ label: "This field is required" });
        return;
      } else if (specialCharRegex.test(category)) {
        setFormError({ label: "Special characters are not allowed" });
        return;
      }
      setFormError({});
      dispatch(handleLoader(true));
      let { data } = await ApiManager(dataToSend);
      dispatch(setToast({ type: "success", message: data?.message }));
      setOpen(false);
      setCategory("");
      getCategories();
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
  };

  return (
    <>
      <ModalWrapper
        open={open}
        handleClose={() => {
          setCategory(categoryForEdit?.label);
          onClose();
        }}
        title={`${categoryForEdit?.id ? `Update Category` : `Add Category`}`}
      >
        <Stack alignItems="flex-end" gap={2}>
          <InputField onChange={(e) => setCategory(e.target.value)} value={category} error={formError?.label} label="Category" styles={{ my: 1 }} />
          <Button onClick={handleUpdateTopic}>{categoryForEdit?.id ? `Update` : `Add`}</Button>
        </Stack>
      </ModalWrapper>
    </>
  );
};

export default AddCategoryModal;
