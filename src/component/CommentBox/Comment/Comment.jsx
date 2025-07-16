import React, { useState } from "react";

import { Avatar, Button, MenuItem, Skeleton, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { BasicMenu } from "@/component";
import InputField from "@/component/InputField/InputField";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

const Comment = ({ comment, loading, setAllComments, allComments, item, setComment }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();
  const isMyComment = item?.commenter?.id === user?.id;
  const handleDeleteComment = async () => {
    if (isMyComment) {
      try {
        let { data } = await ApiManager({ method: "delete", path: `comments/${item?.id}` });
        console.log("data?.message", data);
        setAllComments(allComments.filter((comment) => comment.id !== item.id));
        dispatch(setToast({ type: "success", message: data?.message }));
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      }
    }
  };

  return (
    <Stack direction="row" alignItems={loading && "center"} gap={1 / 2}>
      {loading ? (
        <Skeleton sx={{ height: "40px", width: "40px", borderRadius: "20px" }} variant="rectangular" />
      ) : (
        <Avatar src={item?.commenter?.profileImage} alt="" />
      )}
      {loading ? (
        <Skeleton sx={{ height: "80px", width: "100%" }} variant="rectangular" />
      ) : (
        <Stack sx={{ background: "#F8F8FB", borderRadius: "10px", p: 1, width: "100%" }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" fontWeight="SemiBold">
              {item?.commenter?.name || `${item?.commenter?.firstName} ${item?.commenter?.lastName}`}
            </Typography>

            {!isUpdating && isMyComment && (
              <BasicMenu verticalIcon={true} setOpenMenu={setOpenMenu} openMenu={openMenu}>
                {/* <MenuItem onClick={() => setIsUpdating(!isUpdating)}>Edit</MenuItem> */}
                <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
              </BasicMenu>
            )}
          </Stack>
          {isUpdating ? (
            <Stack sx={{ flex: 1 }} gap={1} component="form" onSubmit={() => {}}>
              <InputField
                sx={{ width: "100%", background: "white" }}
                value={comment || item?.content}
                onChange={(e) => setComment(e.target.value)}
                multiline
                required
                minRows={3}
                maxRows={7}
              />
              <Stack direction="row" justifyContent={"flex-end"} gap={1}>
                <Button onClick={() => setIsUpdating(false)} variant="outlined" sx={{ borderRadius: "23px" }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" sx={{ borderRadius: "23px" }}>
                  Update
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" fontWeight="regular">
              {item?.content}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};
export default Comment;
