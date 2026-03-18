import { Stack, Typography, Box, InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ChatItem from "../shared/ChatItem";

function ChatList({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "", count: 0 }],
  handleDeleteChat,
}) {
  return (
    <Stack
      width={w}
      direction={"column"}
      height={"100%"}
      sx={{
        background: "linear-gradient(180deg, #1a2236 0%, #141d2e 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ px: 2, pt: 2.5, pb: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: "#60a5fa",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.7rem",
            display: "block",
            mb: 1.5,
          }}
        >
          💬 Messages
        </Typography>

        {/* Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: "12px",
            bgcolor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            "&:focus-within": {
              border: "1px solid rgba(96, 165, 250, 0.4)",
              bgcolor: "rgba(96,165,250,0.04)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <SearchIcon sx={{ color: "#64748b", fontSize: "1rem" }} />
          <InputBase
            placeholder="Search conversations..."
            sx={{
              color: "#cbd5e1",
              fontSize: "0.85rem",
              flex: 1,
              "& input::placeholder": { color: "#475569", opacity: 1 },
            }}
          />
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.05)", mx: 2 }} />

      {/* Chat Items */}
      <Stack
        direction={"column"}
        overflow={"auto"}
        sx={{
          flex: 1,
          py: 1,
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(96,165,250,0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        }}
      >
        {chats?.map((data, index) => {
          const { avatar, _id, name, groupChat, members } = data;
          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );
          const isOnline = members?.some((member) =>
            onlineUsers.includes(member)
          );
          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}

export default ChatList;
