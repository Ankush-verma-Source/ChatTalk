import { Typography, Box } from "@mui/material";
import { grayColor } from "../constants/color";

function Home() {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
}

export default Home;
