"use client";
import { Avatar, Card, Skeleton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApiManager } from "@/helpers";
import { setToast } from "@/store/reducer";
import { CardButton } from "..";
import Utils from "@/Utils";
import DonationAmountModal from "../DonationAmountModal/DonationAmountModal";

const NGO = ({
  data,
  loading,
  userId,
  suggestion = false,
  isClick = true,
}) => {
  const [followStatus, setFollowStatus] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [follower, setFollower] = useState(0);
  // const [ngoId,setNgoId] = useState(null)
  const [selectedNgo,setSelectedNgo] = useState(null)
  const dispatch = useDispatch();
const {walletBalance} = useSelector((state) => state.appReducer);

  // const handleCardClick = () => {
  //   if (isClick) {
  //     const role = data?.role?.toLowerCase();
  //     if (role === "company") {
  //       router.push(`/company/${data?.id}`);
  //     } else if (role === "ngo") {
  //       router.push(`/search-ngo/${data?.id}`);
  //     }
  //   }
  // };


  useEffect(() => {
    if (data) {
      setFollowStatus(data?.followed || false);
      setFollower(Number(data?.followercount || data?.followerCount) || 0);
    }
  }, [data]);

  return (
    <Card
      sx={{
        width: suggestion ? "auto" : "100%",
        // borderRadius: suggestion ? "8px" : "18px",
        px: suggestion ? 1 : 2,
        py: 2,
        cursor: "pointer",
        mx: 1,
        // mx: !suggestion ? 0 : 1,
      }}
      elevation={0}
      onClick={()=>{}}
    >
      <Stack gap={2.5}>
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="center"
            // sx={{
            //   width: "250px",
            //   height: "150px",
            // }}
          >
            {loading ? (
              <Skeleton
                sx={{ height: "70px", width: "70px", borderRadius: "35px" }}
                animation="wave"
                variant="rectangular"
              />
            ) : (
              <Avatar sx={StylesNGOs.image} src={data?.profileImage} />
            )}
            <Stack alignItems={"flex-start"}>
              {loading ? (
                <Skeleton animation="wave" width={200} height={15} />
              ) : (
                <Typography
                  variant="body1"
                  fontWeight="SemiBold"
                  whiteSpace="nowrap"
                  p={0}
                >
                  {Utils.limitStringWithEllipsis(data?.name || data?.title, 20)}
                </Typography>
              )}
              {loading ? (
                <>
                  <Skeleton animation="wave" width={150} height={15} />
                  <Skeleton animation="wave" width={120} height={15} />
                </>
              ) : (
                <Typography
                  variant="caption"
                  sx={{ textOverflow: "ellipsis" }}
                  maxWidth="135px"
                  color="#8f8f8f"
                  lineHeight="16px"
                >
                  {follower ?? 0} Followers
                </Typography>
              )}

              {/* {loading ? (
                  <Skeleton animation="wave" width={70} height={15} />
                ) : (
                  <Typography variant="caption" color="#8f8f8f" sx={{ textTransform: "capitalize" }}>
                    23 Events
                  </Typography>
                )} */}
            </Stack>
          </Stack>
          {suggestion || loading ? (
            <Skeleton
              animation="wave"
              width="100%"
              height={45}
              sx={{ borderRadius: "13px" }}
            />
          ) : (
            !userId && (
              <CardButton
                textStyle={{ variant: "body1", fontWeight: "Medium" }}
                variant={followStatus ? "contained" : "outlined"}
                onClick={()=>{
                  if(walletBalance){
                   setModalOpen(true)
                    setSelectedNgo(data)
                  }else{
                    dispatch(setToast({ type: "error", message: "Insufficient voltz" }));
                  }
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "80px",
                    textAlign: "center",
                  }}
                >
                  Donate
                </span>
              </CardButton>
            )
          )}
        </Stack>

        {/* {!suggestion && (
          <CardActions sx={{ p: 0 }}>
            {loading ? (
              <Skeleton animation="wave" width="100%" height={45} />
            ) : (
              <CardButton textStyle={{ variant: "body1", fontWeight: "Medium" }}>Follow</CardButton>
            )}
          </CardActions>
        )} */}
      </Stack>
     <DonationAmountModal openModal={openModal} setOpenModal={setModalOpen} ngo={selectedNgo}/>
    </Card>
  );
};

export default NGO;

const StylesNGOs = {
  image: {
    height: "70px",
    width: "70px",
    borderRadius: "50%",
    border: "2px solid white",
    boxShadow: " 0px 4.54px 7.57px 0px rgba(0, 0, 0, 0.2)",
  },

  button: {
    padding: 0,
    color: "#06B0BA",
    borderRadius: "16px",
    border: "2px solid #06B0BA",
    "&:hover": {
      border: "2px solid #06B0BA",
      color: "#06B0BA",
    },
    marginLeft: "auto",
  },
  card: {
    width: "100%",
    borderRadius: "16px",
    p: 2,
    cursor: "pointer",
  },
};

const Styles = {
  listItem: {
    px: 0,
    color: "#7B7B80",
    py: 2,
  },
};
