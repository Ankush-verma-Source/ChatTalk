import { Stack, Typography, Box } from "@mui/material";
import { Link } from "../styles/styledComponents";
import { memo } from "react";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

function ChatItem({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) {
  return (
    <Link
      sx={{ padding: "0", textDecoration: "none" }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: "relative" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "0.85rem",
            alignItems: "center",
            px: 2,
            py: 1.2,
            mx: 1,
            my: 0.3,
            borderRadius: "12px",
            backgroundColor: sameSender
              ? "rgba(59, 130, 246, 0.18)"
              : "transparent",
            border: sameSender
              ? "1px solid rgba(59, 130, 246, 0.3)"
              : "1px solid transparent",
            transition: "all 0.2s ease",
            cursor: "pointer",
            "&:hover": sameSender
              ? {}
              : {
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                },
          }}
        >
          <AvatarCard avatar={avatar} />

          <Stack sx={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                color: sameSender ? "#f8fafc" : "#e2e8f0",
                fontWeight: sameSender ? 600 : 500,
                fontSize: "0.92rem",
                lineHeight: 1.4,
              }}
            >
              {name}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={0.5}>
              <Typography sx={{ fontSize: "0.72rem", color: newMessageAlert ? "#60a5fa" : "#475569", fontWeight: newMessageAlert ? 600 : 400 }}>
                {newMessageAlert ? "New message" + (newMessageAlert.count > 1 ? "s" : "") : (groupChat ? "Group chat" : "Private chat")}
              </Typography>
              
              {/* Unread Badge */}
              {newMessageAlert && (
                <Box
                  sx={{
                    bgcolor: "#3b82f6",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    px: 0.8,
                    py: 0.2,
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  {newMessageAlert.count}
                </Box>
              )}
            </Stack>
          </Stack>

          {isOnline && (
            <Box
              sx={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                flexShrink: 0,
              }}
            />
          )}
        </Box>
      </motion.div>
    </Link>
  );
}

export default memo(ChatItem);
