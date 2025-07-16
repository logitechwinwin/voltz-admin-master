"use client";
import React, { useState } from "react";

import { Avatar, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { UserCircle } from "@/assets";
// import { UnfollowModal } from "@/component";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";

function JoinButton({ communityData, setCommunityData }) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLogged } = useSelector((state) => state.appReducer);

  // Separate function to handle joining
  const handleJoin = async () => {
    if (isLogged) {
      setLoading(true);
      try {
        let { data } = await ApiManager({
          method: "post",
          path: `community/${communityData?.id}/join`,
        });
        setCommunityData((prev) => ({
          ...prev,
          isJoined: true,
        }));
        dispatch(
          setToast({
            type: "success",
            message: "Successfully joined the community!",
          })
        );
        setModalOpen(false);
      } catch (error) {
        dispatch(setToast({ type: "error", message: error?.message }));
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/login");
    }
  };

  // Separate function to handle unjoining
  const handleUnjoin = async () => {
    setLoading(true);
    try {
      let { data } = await ApiManager({
        method: "post",
        path: `community/${communityData?.id}/unjoin`,
      });
      setCommunityData((prev) => ({
        ...prev,
        isJoined: false,
      }));
      dispatch(
        setToast({
          type: "success",
          message: "Successfully left the community!",
        })
      );
      // setModalOpen(false);
    } catch (error) {
      dispatch(setToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  // Open modal when the user tries to unjoin
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Button
        sx={Styles.button}
        onClick={!communityData?.isJoined ? handleJoin : handleOpenModal} // Open modal on unjoin
        // startIcon={
        //   !communityData?.isJoined && !loading ? <Avatar src={UserCircle.src} alt="" style={{ fontSize: "30px", fontWeight: "bold" }} /> : <></>
        // }
      >
        {loading ? <CircularProgress size={30} /> : communityData?.isJoined ? "Joined" : "Join"}
      </Button>

      {/* UnfollowModal for confirming unjoin */}
      {/* <UnfollowModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleUnfollow={handleUnjoin}
        type="community"
        name={communityData?.title} // Community name for the modal
      /> */}
    </>
  );
}

export default JoinButton;

const Styles = {
  button: {
    px: 8,
    borderRadius: 5,
    fontSize: "20px",
    fontWeight: "SemiBold",
    color: "black",
    backgroundColor: "#fff",
  },
};
