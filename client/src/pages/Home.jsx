import { Box, Typography } from "@mui/material";
import { ChatBubbleOutline as ChatIcon } from "@mui/icons-material";

function Home() {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: "24px",
          bgcolor: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          mb: 1,
        }}
      >
        <ChatIcon sx={{ fontSize: "3.5rem", color: "#3b82f6", opacity: 0.7 }} />
      </Box>
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ color: "#f8fafc" }}
      >
        Select a conversation
      </Typography>
      <Typography variant="body2" sx={{ color: "#64748b", textAlign: "center", maxWidth: 280 }}>
        Choose a chat from the list on the left to start messaging.
      </Typography>
    </Box>
  );
}

export default Home;
