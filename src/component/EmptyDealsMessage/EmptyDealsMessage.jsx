import { Box, Typography, Stack } from "@mui/material";
import Image from "next/image";
import { NoData } from "@/assets";

const EmptyDealsMessage = ({title,message}) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ py: 5, textAlign: "center" }}
    >
      {/* Illustration */}
      <Box sx={{ width: "200px", height: "200px", mb: 2 }}>
        <Image src={NoData} alt="No deals available" width={200} height={200} />
      </Box>

      <Typography variant="h6" fontWeight="bold" color="text.primary">
        {title || 'No Deals!'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message || "It seems there is no deal at the moment."}
      </Typography>
    </Stack>
  );
};

export default EmptyDealsMessage;
