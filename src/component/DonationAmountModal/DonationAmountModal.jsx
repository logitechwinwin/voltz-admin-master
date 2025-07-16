"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
} from "@mui/material";
import { CloseIcon, Voltz, WestIcon } from "@/assets";
import { CardButton, FormattedInputs, InputField } from "..";
import Image from "next/image";
import { ApiManager } from "@/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setToast, setWalletBalance } from "@/store/reducer";

export default function DonationAmountModal({
  ngo,
  openModal,
  setOpenModal,
}) {
    const [donating, setDonating] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState({});
    const [formData, setFormData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const { user,walletBalance } = useSelector((state) => state.appReducer);
    const [selected, setSelected] = React.useState(5);


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

  

  const remainingDonationAmount = walletBalance

  const updatedDonationAmounts =
    remainingDonationAmount > 0
      ? donationAmounts
          .map((item) => {
            // If the amount is greater than the required donation, we should filter it out later
            if (
              remainingDonationAmount &&
              item.amount > remainingDonationAmount
            ) {
              return null; // Mark it for removal
            }
            // If the amount is less than or equal to donationRequired, keep it
            return {
              ...item,
              amount:
                item.amount === remainingDonationAmount
                  ? remainingDonationAmount
                  : item.amount,
            };
          })
          .filter((item) => item !== null)
      : donationAmounts;

  // If donationRequired is less than all amounts, we should also add the donationRequired amount
  if (remainingDonationAmount && remainingDonationAmount > 0) {
    if (
      !updatedDonationAmounts.some(
        (item) => item.amount === remainingDonationAmount
      )
    ) {
      updatedDonationAmounts.push({
        id: updatedDonationAmounts.length + 1,
        amount: remainingDonationAmount,
      });
    }
  }

  const bestOption = Math.floor(updatedDonationAmounts?.length / 2);

  React.useEffect(() => {
    if(updatedDonationAmounts[bestOption]?.amount){
        setSelected(updatedDonationAmounts[bestOption]?.amount);
    }else{
        setSelected(walletBalance)
    }
  }, [bestOption,walletBalance]);

 

  const handleDonate = async () => {
    const url = `company/donate-voltz-to-ngo`;

    if (remainingDonationAmount > 0 && selected > remainingDonationAmount) {
    //   setFormErrors({
    //     amount: `Your wallet balance is ${remainingDonationAmount} voltz`,
    //   });
    dispatch(setToast({ type: "error", message: `Insufficient voltz` }));
      return; // Stop execution if there's an error
    }

    setLoading(true); // Start loading indicator

    try {
      // API call to initiate donation
      let { data } = await ApiManager({
          method: "post",
          path:url,
          params: { numberOfVoltz: Number(selected), ngoId: ngo?.id},
        });
        dispatch(setToast({ type: "success", message: data?.message}));
        setOpenModal(false)
      dispatch(setWalletBalance(Number(walletBalance ?? 0) - Number(selected)));

    } catch (error) {
      console.log(error);

      if (error?.response?.data?.statusCode === 422) {
        setFormErrors(error?.response?.data?.details); // Handle validation errors
      } else {
        dispatch(setToast({ type: "error", message: error?.response?.data?.message })); // Show error toast
      }
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpenModal(false);
    setFormErrors({});
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
              <Stack
                alignItems="center"
                direction={{ xs: "column", md: "row" }}
                gap={2}
              >
                <Avatar
                  variant="rounded"
                  src={ngo?.profileImage}
                  sx={Styles.avatar}
                />
                <Stack>
                  <Typography
                    variant="h6"
                    fontWeight="Medium"
                    color="text.hint"
                  >
                    {" "}
                    You’re donating to
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {ngo?.name}
                  </Typography>
                </Stack>
              </Stack>
              {!donating ? (
                <Stack gap={1.5}>
                  <Typography variant="h6" fontWeight="SemiBold">
                    Enter Your Donation{" "}
                  </Typography>
                  <Grid container spacing={2}>
                    {updatedDonationAmounts?.map((amount, i) => {
                      if (amount?.amount && amount?.amount <= 1000) {
                        return (
                          <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
                            <Box
                              sx={{
                                ...Styles.card,
                                borderColor:
                                  amount?.amount === selected 
                                    ? "primary.main"
                                    : "rgba(196, 196, 196, 1)",

                                backgroundColor:
                                  amount?.amount === selected
                                    ? "button.background"
                                    : "#fff",
                              }}
                              onClick={() => setSelected(amount?.amount)}
                            >
                              <Stack direction='row' gap={1/2}>
                               <Image src={Voltz} alt="" height={20} width={20}/>
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
                                  </Stack>
                            </Box>
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                  <InputField
                    type="number"
                    error={formErrors?.amount}
                    label="Custom Amount"
                    onKeyDown={(e) => {
                      // Prevent decimal (.) input
                      if (e.key === "." || e.key === "e" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                    value={selected}
                    onChange={(e) => {
                      setSelected(e.target.value);
                    }}
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
                    type="text"
                    label="Card Number"
                    name="billing-cc-number"
                    value={formData["billing-cc-number"] || ""}
                  />

                  <FormattedInputs
                    handleInput={handleInputChange}
                    textMask="00/00"
                    error={formErrors["billing-cc-exp"]}
                    type="text"
                    label="Card Expiry (MM/YY)"
                    name="billing-cc-exp"
                    value={formData["billing-cc-exp"] || ""}
                  />

                  <FormattedInputs
                    handleInput={handleInputChange}
                    textMask="000"
                    error={formErrors["billing-cvv"]}
                    type="text"
                    label="Card CVV"
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
                  <Typography variant="h6" fontWeight="SemiBold">
                    Total
                  </Typography>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" color="text.hint">
                      Total Donation
                    </Typography>
                    <Stack direction='row' gap={1}>
                        <Image src={Voltz} alt="" height={20} width={20}/>
                    <Typography variant="h6" color="text.hint">
                      {selected}
                    </Typography>
                        </Stack>
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
                  "Donate Now"
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
    // overflow: "auto",
    // maxHeight: "70vh",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 20,
    cursor: "pointer",
  },
  icon: {
    position: "absolute",
    top: -20,
    right: -14,
  },
  avatar: {
    height: "50px",
    width: "50px",
    borderRadius: "5px",
    boxShadow: " rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  },
  card: {
    border: "2px solid ",

    p: 1.5,

    borderRadius: "4px",
    minWidth: "81px",
    cursor: "pointer",
    position: "relative",
  },
};
