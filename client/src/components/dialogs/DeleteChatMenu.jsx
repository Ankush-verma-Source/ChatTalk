import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { Menu, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../features/misc/misc";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../app/api";
import { useEffect } from "react";

function DeleteChatMenu({ dispatch, deleteMenuAnchor }) {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

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
    if (deleteChatData || leaveGroupData) {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteChatData, leaveGroupData]);
  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{ width: "10rem", padding: "0.5rem", cursor: "pointer" }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <ExitToAppIcon />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <DeleteIcon />
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
}

export default DeleteChatMenu;
