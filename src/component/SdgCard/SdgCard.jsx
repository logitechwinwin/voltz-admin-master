const { TickSdg } = require("@/assets");
const { Box } = require("@mui/material");
const { default: Image } = require("next/image");

const SdgCard = ({ sdg, onClick = () => {}, checked = false }) => {
  return (
    <Box
      onClick={onClick}
      sx={{ cursor: "pointer", minWidth: "40px", position: "relative" }}
    >
      {checked && (
        <Image
          priority
          src={TickSdg}
          alt=""
          style={{
            position: "absolute",
            top: "-11px",
            right: "-11px",
          }}
        />
      )}
      <Image
        src={sdg?.image}
        style={{
          height: "127px",
          width: "127px",
          borderRadius: checked ? "17px" : "0px",
        }}
        alt=""
        height={147}
        width={147}
      />
    </Box>
  );
};

export default SdgCard;
