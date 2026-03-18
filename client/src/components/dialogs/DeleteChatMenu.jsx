import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../features/misc/misc";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../app/api";
import { useEffect } from "react";

function DeleteChatMenu({ dispatch, deleteMenuAnchor }) {
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc);

  const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteChatData, leaveGroupData]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          minWidth: "170px",
          p: 0.5,
          overflow: "hidden",
        },
      }}
    >
      <MenuItem
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
        sx={{
          borderRadius: "10px",
          px: 1.5,
          py: 1.1,
          gap: 1.5,
          color: isGroup ? "#fb923c" : "#f87171",
          transition: "all 0.15s ease",
          "&:hover": {
            bgcolor: isGroup
              ? "rgba(251,146,60,0.1)"
              : "rgba(248,113,113,0.1)",
          },
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            bgcolor: isGroup ? "rgba(251,146,60,0.12)" : "rgba(248,113,113,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isGroup ? (
            <ExitToAppIcon sx={{ fontSize: "1rem" }} />
          ) : (
            <DeleteIcon sx={{ fontSize: "1rem" }} />
          )}
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {isGroup ? "Leave Group" : "Delete Chat"}
        </Typography>
      </MenuItem>
    </Menu>
  );
}

export default DeleteChatMenu;
