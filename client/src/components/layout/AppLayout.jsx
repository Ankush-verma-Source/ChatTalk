import { Drawer, Grid, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Title1 from "../shared/Title1";
import Header from "./Header";

import ChatList from "../specific/ChatList";
// import { sampleChats } from "../../constants/sampleData";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMyChatsQuery } from "../../app/api";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/event";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../features/chat/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../features/misc/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import useSocket from "../../useSocket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Profile from "../specific/Profile";

function AppLayout({ children }) {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();

  const chatId = params.chatId;
  const deleteMenuAnchor = useRef(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  // console.log(socket.id);

  const { isMobile } = useSelector((state) => state.misc);
  const { user } = useSelector((state) => state.auth);
  const { newMessagesAlert } = useSelector((state) => state.chat);

  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

  useErrors([{ isError, error }]);

  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
  }, [newMessagesAlert]);

  const handleDeleteChat = (e, chatId, groupChat) => {
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    deleteMenuAnchor.current = e.currentTarget;
  };

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const newMessageAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId]
  );

  const newRequestListener = useCallback(() => {
    dispatch(incrementNotification());
  }, [dispatch]);

  const refetchListener = useCallback(() => {
    refetch();
    navigate("/");
  }, [refetch, navigate]);

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  const eventHanlders = {
    [NEW_MESSAGE_ALERT]: newMessageAlertListener,
    [NEW_REQUEST]: newRequestListener,
    [REFETCH_CHATS]: refetchListener,
    [ONLINE_USERS]: onlineUsersListener,
  };
  useSocketEvents(socket, eventHanlders);

  return (
    <>
      <Title1 />
      <Header />

      <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <Drawer open={isMobile} onClose={handleMobileClose}>
          <ChatList
            w="70vw"
            chats={data?.chats}
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessagesAlert}
            onlineUsers={onlineUsers}
          />
        </Drawer>
      )}

      <Grid container height={"calc(100vh - 4rem)"}>
        <Grid
          size={{ sm: 4, md: 3 }}
          sx={{ display: { xs: "none", sm: "block" } }}
          height={"100%"}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
          {/* {children } */}
          {cloneElement(children, {
            chatId: chatId,
            user: user,
            // any other props you want to pass
          })}
        </Grid>
        <Grid
          size={{ sm: 4, md: 4, lg: 3 }}
          sx={{
            display: { xs: "none", md: "block" },
            padding: "2rem",
            bgcolor: "rgba(0,0,0,0.85)",
          }}
          height={"100%"}
        >
          <Profile user={user} />
        </Grid>
      </Grid>
    </>
  );
}

export default AppLayout;
