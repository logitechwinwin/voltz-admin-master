// "use client";

// import React, { useEffect, useState } from "react";
// import { Wallet } from "@mui/icons-material";
// import {
//   Avatar,
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   Grid,
//   InputAdornment,
//   Stack,
// } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import axios from "axios";
// import moment from "moment";
// import Image from "next/image";
// import { useDispatch, useSelector } from "react-redux";
// import { CardButton, FormattedInputs } from "..";
// import InputField from "../InputField/InputField";
// import { CloseIcon, VoltzIcon, WestIcon } from "@/assets";
// import { ApiManager } from "@/helpers";
// import { setToast, setWalletBalance } from "@/store/reducer";

// export default function VoltzModal({ openModal, setOpenModal }) {
//   const [selected, setSelected] = useState(5);
//   const [donating, setDonating] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [formErrors, setFormErrors] = useState({});
//   const [redirectUrl, setRedirectUrl] = useState("");
//   const [tokenId, setTokenId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { walletBalance } = useSelector((state) => state.appReducer);
//   const year = moment().format("YY");
//   const dispatch = useDispatch();
//   const donationAmounts = [
//     {
//       id: 1,
//       amount: 5,
//     },
//     {
//       id: 2,
//       amount: 10,
//     },
//     {
//       id: 3,
//       amount: 50,
//     },
//     {
//       id: 4,
//       amount: 100,
//     },
//     {
//       id: 5,
//       amount: 500,
//     },
//     {
//       id: 6,
//       amount: 1000,
//     },
//   ];
//   const handleInputChange = (e) => {
//     let { value, name } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDonate = async () => {
//     if (selected > 4) {
//       setLoading(true);
//       try {
//         let { data } = await ApiManager({
//           method: "post",
//           path: "ngo/voltzs-purchasing/initiate-payment",
//           params: { voltzRequested: selected, redirectUrl: `xyz` },
//         });
//         setRedirectUrl(data?.response?.details?.formUrl);
//         const Id = data?.response?.details?.formUrl.split("/").pop();
//         if (Id) {
//           setTokenId(Id);
//         }
//         setDonating(true);
//         setFormErrors({});
//       } catch (error) {
//         if (error?.response?.data?.statusCode === 422) {
//           setFormErrors(error?.response?.data?.details);
//         } else {
//           dispatch(setToast({ type: "error", message: error?.message }));
//         }
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setFormErrors({
//         voltzRequested: "Voltz should not be less than 5",
//       });
//     }
//   };

//   const verify = async () => {
//     try {
//       let { data } = await ApiManager({
//         method: "post",
//         path: "ngo/voltzs-purchasing/verify-payment",
//         params: { tokenId: tokenId },
//       });

//       dispatch(
//         setToast({ type: "success", message: "Voltz Purchased successfully" })
//       );
//       console.log("selected", selected);
//       console.log("wallet balance", walletBalance);
//       console.log("total", Number(walletBalance) + Number(selected));
//       dispatch(setWalletBalance(Number(walletBalance ?? 0) + Number(selected)));
//       setDonating(false);
//       setOpenModal(false);
//       console.log(data);
//     } catch (error) {
//       let errorRes = error?.response?.data;
//       if (errorRes?.statusCode === 400 || errorRes?.statusCode === 500) {
//         setDonating(false);
//       }
//       dispatch(setToast({ type: "error", message: errorRes?.message }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validate = () => {
//     let obj = {};

//     // Check if the password is at least 6 characters long
//     if (formData["billing-cc-number"]?.length < 19) {
//       obj["billing-cc-number"] = "Invalid card number. Please enter 16 digits";
//     }

//     if (formData["billing-cc-exp"].split("/")[0] > 12) {
//       obj["billing-cc-exp"] = "Invalid Expiration date";
//     }
//     if (formData["billing-cc-exp"].split("/")[1] < year) {
//       obj["billing-cc-exp"] = "Invalid Expiration date";
//     }

//     if (formData["billing-cvv"]?.length < 3) {
//       obj["billing-cvv"] = "Invalid cvv number. Please enter 3 digits";
//     }

//     if (Object.keys(obj)?.length) {
//       setFormErrors(obj);
//       return true;
//     }

//     return false;
//   };

//   const addCardDetails = async (e) => {
//     e.preventDefault();
//     if (validate()) {
//       return;
//     }
//     setFormErrors({});
//     setLoading(true);
//     try {
//       const form = new FormData();
//       form.append("billing-cc-exp", formData["billing-cc-exp"]);
//       form.append("billing-cvv", formData["billing-cvv"]);
//       form.append("billing-cc-number", formData["billing-cc-number"]);
//       await axios.post(
//         redirectUrl,
//         {
//           "billing-cc-number": formData["billing-cc-number"].replace(/-/g, ""),
//           "billing-cvv": formData["billing-cvv"],
//           "billing-cc-exp": formData["billing-cc-exp"].replace("/", ""),
//         },
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       verify();
//     } catch (error) {
//       console.log("error", error);
//       setLoading(false);
//       dispatch(setToast({ type: "error", message: error?.message }));
//     }
//   };

//   const handleClose = () => {
//     setOpenModal(false);
//     setFormErrors({});
//     setDonating(false);
//   };

//   return (
//     <Dialog open={openModal} onClose={handleClose} sx={Styles.dialog}>
//       <CloseIcon style={Styles.closeIcon} onClick={handleClose} />
//       <Card
//         sx={{ width: { xs: "80vw", md: "60vw", lg: "50vw" }, overflow: "auto" }}
//       >
//         <Box sx={{ p: 3 }}>
//           <CardContent>
//             <Stack gap={4}>
//               <Stack direction={{ xs: "column", md: "row" }} gap={2}>
//                 {/* <Image src={DonationThumbnail} alt="" /> */}
//                 <Stack>
//                   {/* <Typography variant="h6" fontWeight="Medium" color="text.hint">
//                     {" "}
//                     You’re donating to
//                   </Typography> */}
//                   <Typography variant="h5" fontWeight="bold">
//                     Buy Voltz
//                   </Typography>
//                 </Stack>
//               </Stack>
//               {!donating ? (
//                 <Stack gap={1.5}>
//                   <Typography variant="h6" fontWeight="SemiBold">
//                     Select Voltz{" "}
//                   </Typography>
//                   <Grid container spacing={2}>
//                     {donationAmounts?.map((amount, i) => (
//                       <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
//                         <Box
//                           sx={{
//                             border: "2px solid ",
//                             borderColor:
//                               amount?.amount === selected
//                                 ? "primary.main"
//                                 : "rgba(196, 196, 196, 1)",
//                             p: 1.5,
//                             backgroundColor:
//                               amount?.amount === selected
//                                 ? "button.background"
//                                 : "#fff",
//                             borderRadius: "4px",
//                             minWidth: "81px",
//                             cursor: "pointer",
//                             position: "relative",
//                             display: "flex",
//                             gap: 1,
//                           }}
//                           onClick={() => setSelected(amount?.amount)}
//                         >
//                           {/* {amount?.amount === 100 && <Image src={StarIcon} alt="" style={Styles.icon} />} */}
//                           <Image
//                             src={VoltzIcon}
//                             alt=""
//                             height={15}
//                             width={15}
//                           />
//                           <Typography
//                             textAlign="center"
//                             fontWeight="Medium"
//                             color={
//                               amount?.amount === selected
//                                 ? "primary.main"
//                                 : "black"
//                             }
//                           >
//                             {amount.amount}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     ))}
//                   </Grid>
//                   <InputField
//                     type="number"
//                     error={formErrors?.voltzRequested}
//                     label="Custom Amount"
//                     value={selected}
//                     InputProps={{
//                       startAdornment: (
//                         <Image
//                           src={VoltzIcon}
//                           alt=""
//                           height={15}
//                           width={15}
//                           style={{ marginRight: "5px" }}
//                         />
//                       ),
//                     }}
//                     onChange={(e) => setSelected(e.target.value)}
//                   />
//                 </Stack>
//               ) : (
//                 <Stack gap={3} component="form" onSubmit={addCardDetails}>
//                   <Button
//                     sx={{ alignSelf: "flex-start" }}
//                     onClick={() => setDonating(false)}
//                   >
//                     <WestIcon />
//                   </Button>
//                   <Typography variant="h6" fontWeight="SemiBold">
//                     Add Card Details
//                   </Typography>
//                   <FormattedInputs
//                     handleInput={handleInputChange}
//                     textMask="0000-0000-0000-0000"
//                     error={formErrors["billing-cc-number"]}
//                     type="number"
//                     label="Card Number"
//                     name="billing-cc-number"
//                   />
//                   <FormattedInputs
//                     error={formErrors["billing-cc-exp"]}
//                     handleInput={handleInputChange}
//                     textMask="00/00"
//                     type="number"
//                     label="Card Expiry (MM/YY)"
//                     name="billing-cc-exp"
//                   />
//                   <FormattedInputs
//                     error={formErrors["billing-cvv"]}
//                     handleInput={handleInputChange}
//                     textMask="000"
//                     type="number"
//                     label="Card cvv"
//                     name="billing-cvv"
//                   />
//                   <CardButton
//                     disabled={loading}
//                     type="submit"
//                     textStyle={{ variant: "h6", fontWeight: "Medium" }}
//                   >
//                     {loading ? <CircularProgress size={30} /> : "Submit"}
//                   </CardButton>
//                 </Stack>
//               )}
//               {!donating && (
//                 <Stack>
//                   <Stack direction="row" justifyContent="space-between">
//                     <Typography variant="h6" color="text.hint">
//                       Total Price
//                     </Typography>
//                     <Typography variant="h6" color="text.hint">
//                       ${selected}
//                     </Typography>
//                   </Stack>
//                 </Stack>
//               )}
//             </Stack>
//           </CardContent>
//           {!donating && (
//             <CardActions sx={{ textAlign: "center" }}>
//               <CardButton
//                 disabled={loading}
//                 textStyle={{ variant: "h6", fontWeight: "Medium" }}
//                 onClick={handleDonate}
//               >
//                 {loading ? (
//                   <CircularProgress size={30} color="grey" />
//                 ) : (
//                   "Buy Now"
//                 )}
//               </CardButton>
//             </CardActions>
//           )}
//         </Box>
//       </Card>
//     </Dialog>
//   );
// }

// const Styles = {
//   dialog: {
//     "& .MuiPaper-root ": {
//       borderRadius: "10px",
//       maxWidth: "650px",
//     },
//   },
//   closeIcon: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     cursor: "pointer",
//   },
//   icon: {
//     position: "absolute",
//     top: -20,
//     right: -14,
//   },
// };

"use client";

import React, { useEffect, useState } from "react";
import { Wallet } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  InputAdornment,
  Stack,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { CardButton, FormattedInputs } from "..";
import InputField from "../InputField/InputField";
import { CloseIcon, VoltzIcon, WestIcon } from "@/assets";
import { ApiManager } from "@/helpers";
import { setToast, setWalletBalance } from "@/store/reducer";

export default function VoltzModal({ openModal, setOpenModal }) {
  const [selected, setSelected] = useState(5);
  const [donating, setDonating] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [redirectUrl, setRedirectUrl] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const { walletBalance } = useSelector((state) => state.appReducer);
  const year = moment().format("YY");
  const dispatch = useDispatch();
  const donationAmounts = [
    {
      id: 1,
      amount: 5,
    },
    {
      id: 2,
      amount: 10,
    },
    {
      id: 3,
      amount: 50,
    },
    {
      id: 4,
      amount: 100,
    },
    {
      id: 5,
      amount: 500,
    },
    {
      id: 6,
      amount: 1000,
    },
  ];
  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDonate = async () => {
    if (selected > 4) {
      setLoading(true);
      try {
        let { data } = await ApiManager({
          method: "post",
          path: "ngo/voltzs-purchasing/initiate-payment",
          params: { voltzRequested: selected, redirectUrl: `xyz` },
        });

        setRedirectUrl(data?.response?.details?.formUrl);
        const Id = data?.response?.details?.formUrl.split("/").pop();
        if (Id) {
          setTokenId(Id);
        }

        // Prefill form with test card details
        setFormData({
          "billing-cc-number": "4111-1111-1111-1111",
          "billing-cc-exp": "10/30",
          "billing-cvv": "999",
        });

        setDonating(true); // Show the card form
        setFormErrors({}); // Clear any previous form errors
      } catch (error) {
        if (error?.response?.data?.statusCode === 422) {
          setFormErrors(error?.response?.data?.details);
        } else {
          dispatch(setToast({ type: "error", message: error?.message }));
        }
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors({
        voltzRequested: "Voltz should not be less than 5",
      });
    }
  };

  const verify = async () => {
    try {
      let { data } = await ApiManager({
        method: "post",
        path: "ngo/voltzs-purchasing/verify-payment",
        params: { tokenId: tokenId },
      });

      dispatch(
        setToast({ type: "success", message: "Voltz Purchased successfully" })
      );

      console.log("selected", selected);
      console.log("wallet balance", walletBalance);
      console.log("total", Number(walletBalance) + Number(selected));
      dispatch(setWalletBalance(Number(walletBalance ?? 0) + Number(selected)));
      setDonating(false);
      setOpenModal(false);
      console.log(data);
    } catch (error) {
      let errorRes = error?.response?.data;
      if (errorRes?.statusCode === 400 || errorRes?.statusCode === 500) {
        setDonating(false);
      }
      dispatch(setToast({ type: "error", message: errorRes?.message }));
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let obj = {};
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    // Validate card number (must be 16 digits + spaces = 19 characters)
    if (formData["billing-cc-number"]?.length < 19) {
      obj["billing-cc-number"] = "Invalid card number. Please enter 16 digits";
    }

    // Extract expiration month and year from the input (e.g., "12/2025")
    const [expMonth, expYear] = formData["billing-cc-exp"]
      .split("/")
      .map(Number);

    // Validate expiration date
    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      obj["billing-cc-exp"] = "Invalid card expiry";
    }

    // Validate CVV (must be 3 digits)
    if (formData["billing-cvv"]?.length < 3) {
      obj["billing-cvv"] = "Invalid cvv number. Please enter 3 digits";
    }

    if (Object.keys(obj)?.length) {
      setFormErrors(obj);
      return true;
    }

    return false;
  };

  const addCardDetails = async (e) => {
    e.preventDefault();
    if (validate()) {
      return;
    }
    setFormErrors({});
    setLoading(true);
    try {
      const form = new FormData();
      form.append("billing-cc-exp", formData["billing-cc-exp"]);
      form.append("billing-cvv", formData["billing-cvv"]);
      form.append("billing-cc-number", formData["billing-cc-number"]);
      await axios.post(
        redirectUrl,
        {
          "billing-cc-number": formData["billing-cc-number"].replace(/-/g, ""),
          "billing-cvv": formData["billing-cvv"],
          "billing-cc-exp": formData["billing-cc-exp"].replace("/", ""),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      verify();
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      dispatch(setToast({ type: "error", message: error?.message }));
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setFormErrors({});
    setDonating(false);
  };

  return (
    <Dialog open={openModal} onClose={handleClose} sx={Styles.dialog}>
      <CloseIcon style={Styles.closeIcon} onClick={handleClose} />
      <Card
        sx={{ width: { xs: "80vw", md: "60vw", lg: "50vw" }, overflow: "auto" }}
      >
        <Box sx={{ p: 3 }}>
          <CardContent>
            <Stack gap={4}>
              <Stack direction={{ xs: "column", md: "row" }} gap={2}>
                {/* <Image src={DonationThumbnail} alt="" /> */}
                <Stack>
                  {/* <Typography variant="h6" fontWeight="Medium" color="text.hint">
                    {" "}
                    You’re donating to
                  </Typography> */}
                  <Typography variant="h5" fontWeight="bold">
                    Buy Voltz
                  </Typography>
                </Stack>
              </Stack>
              {!donating ? (
                <Stack gap={1.5}>
                  <Typography variant="h6" fontWeight="SemiBold">
                    Select Voltz{" "}
                  </Typography>
                  <Grid container spacing={2}>
                    {donationAmounts?.map((amount, i) => (
                      <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
                        <Box
                          sx={{
                            border: "2px solid ",
                            borderColor:
                              amount?.amount === selected
                                ? "primary.main"
                                : "rgba(196, 196, 196, 1)",
                            p: 1.5,
                            backgroundColor:
                              amount?.amount === selected
                                ? "button.background"
                                : "#fff",
                            borderRadius: "4px",
                            minWidth: "81px",
                            cursor: "pointer",
                            position: "relative",
                            display: "flex",
                            gap: 1,
                          }}
                          onClick={() => setSelected(amount?.amount)}
                        >
                          {/* {amount?.amount === 100 && <Image src={StarIcon} alt="" style={Styles.icon} />} */}
                          <Image
                            src={VoltzIcon}
                            alt=""
                            height={15}
                            width={15}
                          />
                          <Typography
                            textAlign="center"
                            fontWeight="Medium"
                            color={
                              amount?.amount === selected
                                ? "primary.main"
                                : "black"
                            }
                          >
                            {amount.amount}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <InputField
                    type="number"
                    error={formErrors?.voltzRequested}
                    label="Custom Amount"
                    value={selected}
                    InputProps={{
                      startAdornment: (
                        <Image
                          src={VoltzIcon}
                          alt=""
                          height={15}
                          width={15}
                          style={{ marginRight: "5px" }}
                        />
                      ),
                    }}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                </Stack>
              ) : (
                <Stack gap={3} component="form" onSubmit={addCardDetails}>
                  <Button
                    sx={{ alignSelf: "flex-start" }}
                    onClick={() => setDonating(false)}
                  >
                    <WestIcon />
                  </Button>
                  <Typography variant="h6" fontWeight="SemiBold">
                    Add Card Details
                  </Typography>
                  <FormattedInputs
                    handleInput={handleInputChange}
                    textMask="0000-0000-0000-0000"
                    error={formErrors["billing-cc-number"]}
                    type="number"
                    label="Card Number"
                    name="billing-cc-number"
                    value={formData["billing-cc-number"] || ""}
                  />
                  <FormattedInputs
                    error={formErrors["billing-cc-exp"]}
                    handleInput={handleInputChange}
                    textMask="00/00"
                    type="number"
                    label="Card Expiry (MM/YY)"
                    name="billing-cc-exp"
                    value={formData["billing-cc-exp"] || ""}
                  />
                  <FormattedInputs
                    error={formErrors["billing-cvv"]}
                    handleInput={handleInputChange}
                    textMask="000"
                    type="number"
                    label="Card cvv"
                    name="billing-cvv"
                    value={formData["billing-cvv"] || ""}
                  />
                  <CardButton
                    disabled={loading}
                    type="submit"
                    textStyle={{ variant: "h6", fontWeight: "Medium" }}
                  >
                    {loading ? <CircularProgress size={30} /> : "Submit"}
                  </CardButton>
                </Stack>
              )}
              {!donating && (
                <Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" color="text.hint">
                      Total Price
                    </Typography>
                    <Typography variant="h6" color="text.hint">
                      ${selected}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </CardContent>
          {!donating && (
            <CardActions sx={{ textAlign: "center" }}>
              <CardButton
                disabled={loading}
                textStyle={{ variant: "h6", fontWeight: "Medium" }}
                onClick={handleDonate}
              >
                {loading ? (
                  <CircularProgress size={30} color="grey" />
                ) : (
                  "Buy Now"
                )}
              </CardButton>
            </CardActions>
          )}
        </Box>
      </Card>
    </Dialog>
  );
}

const Styles = {
  dialog: {
    "& .MuiPaper-root ": {
      borderRadius: "10px",
      maxWidth: "650px",
    },
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    cursor: "pointer",
  },
  icon: {
    position: "absolute",
    top: -20,
    right: -14,
  },
};
