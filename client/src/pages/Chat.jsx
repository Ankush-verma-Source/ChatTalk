import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  Circle as CircleIcon,
  EmojiEmotions as EmojiIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Avatar, IconButton, Skeleton, Stack, Box, Typography, Tooltip, Fade, Paper, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FileMenu from "../components/dialogs/FileMenu";
import { InputBox } from "../components/styles/styledComponents";
import { grayColor } from "../constants/color";
import { transformImage } from "../lib/features";

import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useChatDetailsQuery, useGetMessagesQuery, useMarkAsReadMutation, useLazySearchMessagesQuery, useDeleteChatMutation, useClearChatMutation } from "../app/api";
import { TypingLoader } from "../components/layout/Loaders";
import MessageComponent from "../components/shared/MessageComponent";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  REACT_MESSAGE,
  MESSAGE_READ,
  CLEAR_MESSAGES,
} from "../constants/event";
import { removeNewMessagesAlert } from "../features/chat/chat";
import { setIsFileMenu } from "../features/misc/misc";
import { useErrors, useSocketEvents } from "../hooks/hook";
import useSocket from "../useSocket";


function Chat({ chatId, user, onlineUsers = [] }) {
  // console.log(chatId);
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatMenuAnchor, setChatMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const typingTimeout = useRef(null);

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessages] = useLazySearchMessagesQuery();

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const res = await searchMessages({ chatId, query });
      if (res.data) setSearchResults(res.data.messages);
    } else {
      setSearchResults([]);
    }
  };

  const chatDetails = useChatDetailsQuery({ chatId, populate: true, skip: !chatId });
  const [deleteChat] = useDeleteChatMutation();
  const [clearChat] = useClearChatMutation();
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  // console.log(oldMessages);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      const memberIds = members.map((m) => m?._id || m);
      socket.emit(START_TYPING, { chatId, members: memberIds });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      const memberIds = members.map((m) => m?._id || m);
      socket.emit(STOP_TYPING, { chatId, members: memberIds });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    e.preventDefault();
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim() || !members) return;

    let replyData = null;
    if (replyingTo) {
      replyData = {
        messageId: replyingTo._id,
        senderName: replyingTo.sender?.name || "User",
        content: replyingTo.content || "Attachment",
      };
    }

    const memberIds = members.map((m) => m?._id || m);
    socket.emit(NEW_MESSAGE, { chatId, members: memberIds, message, replyTo: replyData });

    setMessage("");
    setReplyingTo(null);
  };

  useEffect(() => {
    if (members) {
      const memberIds = members.map((m) => m?._id || m);
      socket.emit(CHAT_JOINED, { userId: user._id, members: memberIds });
    }
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      if (setOldMessages) setOldMessages([]);
      setPage(1);
      setMessage("");
      if (members) {
        const memberIds = members.map((m) => m?._id || m);
        socket.emit(CHAT_LEAVED, { userId: user._id, members: memberIds });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, members]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // console.log("start-typing", data);
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // console.log("stop-typing", data);
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "fwefgasfsff",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const editMessageListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const updateMessage = (prev) =>
        (prev || []).filter(Boolean).map((msg) =>
          msg._id === data.messageId ? { ...msg, content: data.content } : msg
        );

      setMessages(updateMessage);
      setOldMessages?.(updateMessage);
    },
    [chatId, setOldMessages]
  );

  const deleteMessageListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const filterMessage = (prev) =>
        (prev || []).filter(Boolean).filter((msg) => msg._id !== data.messageId);

      setMessages(filterMessage);
      setOldMessages?.(filterMessage);
    },
    [chatId, setOldMessages]
  );

  const [markAsRead] = useMarkAsReadMutation();

  const reactMessageListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const updateReaction = (prev) =>
        (prev || []).filter(Boolean).map((msg) =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        );

      setMessages(updateReaction);
      setOldMessages?.(updateReaction);
    },
    [chatId, setOldMessages]
  );

  const clearMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages([]);
      setOldMessages?.([]);
    },
    [chatId, setOldMessages]
  );

  const messageReadListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const updateReadStatus = (prev) =>
        (prev || []).filter(Boolean).map((msg) => {
          const senderId = msg.sender?._id || msg.sender;
          if (senderId !== data.userId) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), data.userId],
              status: "seen",
            };
          }
          return msg;
        });

      setMessages(updateReadStatus);
      setOldMessages?.(updateReadStatus);
    },
    [chatId, setOldMessages]
  );

  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, messages.length, markAsRead]);

  const eventHandler = useMemo(
    () => ({
      [ALERT]: alertListener,
      [NEW_MESSAGE]: newMessagesListener,
      [START_TYPING]: startTypingListener,
      [STOP_TYPING]: stopTypingListener,
      [EDIT_MESSAGE]: editMessageListener,
      [DELETE_MESSAGE]: deleteMessageListener,
      [REACT_MESSAGE]: reactMessageListener,
      [MESSAGE_READ]: messageReadListener,
      [CLEAR_MESSAGES]: clearMessagesListener,
    }),
    [
      alertListener,
      newMessagesListener,
      startTypingListener,
      stopTypingListener,
      editMessageListener,
      deleteMessageListener,
      reactMessageListener,
      messageReadListener,
      clearMessagesListener,
    ]
  );

  useSocketEvents(socket, eventHandler);

  const handleChatMenu = (e) => {
    setChatMenuAnchor(e.currentTarget);
  };

  const handleChatMenuClose = () => {
    setChatMenuAnchor(null);
  };

  const deleteChatHandler = async () => {
    handleChatMenuClose();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      const res = await deleteChat(chatId);
      if (res.data) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const clearMessagesHandler = async () => {
    handleChatMenuClose();
    if (!window.confirm("Are you sure you want to clear all messages?")) return;
    try {
      await clearChat(chatId);
    } catch (err) {
      console.log(err);
    }
  };

  useErrors(errors);

  const chatName = chatDetails?.data?.chat?.name;
  const chatMembers = chatDetails?.data?.chat?.members || [];
  const isGroupChat = chatDetails?.data?.chat?.groupChat;
  const otherMember = chatMembers?.find?.(m => m?._id && String(m._id) !== String(user?._id));
  const onlineOtherMembers = chatMembers?.filter(m => m?._id && String(m._id) !== String(user?._id) && onlineUsers.includes(String(m._id)));
  const isOnlineProps = isGroupChat ? onlineOtherMembers?.length > 0 : (otherMember?._id ? onlineUsers.includes(String(otherMember._id)) : false);
  const statusText = isGroupChat ? `${onlineOtherMembers?.length || 0} online` : (isOnlineProps ? "Active now" : "Offline");
  const allMessages = [...(oldMessages || []), ...messages].filter(msg => !!msg);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#0f172a", position: "relative" }}>

      {/* ── Chat Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2.5,
          py: 1.5,
          gap: 1.5,
          background: "rgba(15, 23, 42, 0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flex: "0 0 auto",
        }}
      >
        {isSearch ? (
          <Stack direction="row" alignItems="center" flex={1} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "10px", px: 1, ml: 1 }}>
            <SearchIcon sx={{ color: "#64748b", fontSize: "1.2rem" }} />
            <InputBox
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              sx={{ border: "none", bgcolor: "transparent", fontSize: "0.85rem", height: "35px" }}
            />
            <IconButton size="small" onClick={() => { setIsSearch(false); setSearchQuery(""); setSearchResults([]); }} sx={{ color: "#64748b" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={isGroupChat ? transformImage(chatDetails?.data?.chat?.avatar?.url) : transformImage(otherMember?.avatar?.url || otherMember?.avatar)}
                sx={{ width: 40, height: 40, border: "2px solid rgba(59,130,246,0.4)" }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                fontWeight="700"
                noWrap
                sx={{ color: "#f1f5f9", fontSize: "0.95rem", lineHeight: 1.3 }}
              >
                {isGroupChat ? chatName : (otherMember?.name || chatName || "Chat")}
              </Typography>
            </Box>
          </>
        )}

        {/* Header action icons */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {!isSearch && (
            <Tooltip title="Search messages">
              <IconButton
                onClick={() => setIsSearch(true)}
                sx={{ color: "#64748b", borderRadius: "10px", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Voice call">
            <IconButton
              sx={{ color: "#64748b", borderRadius: "10px", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video call">
            <IconButton
              sx={{ color: "#64748b", borderRadius: "10px", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}
            >
              <VideocamIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More options">
            <IconButton
              onClick={handleChatMenu}
              sx={{ color: "#64748b", borderRadius: "10px", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Chat Options Menu */}
      <Menu
        anchorEl={chatMenuAnchor}
        open={Boolean(chatMenuAnchor)}
        onClose={handleChatMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: "#0f172a",
            color: "#f1f5f9",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            mt: 0.5,
          },
        }}
      >
        <MenuItem onClick={clearMessagesHandler} sx={{ px: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
          <ListItemText primary="Clear chat" primaryTypographyProps={{ fontSize: "0.85rem" }} />
        </MenuItem>
        <MenuItem onClick={deleteChatHandler} sx={{ px: 2, color: "#f87171", "&:hover": { bgcolor: "rgba(248,113,113,0.08)" } }}>
          <ListItemText primary="Delete chat" primaryTypographyProps={{ fontSize: "0.85rem" }} />
        </MenuItem>
      </Menu>


      {/* ── Messages Area ── */}
      {isSearch && searchQuery.length > 2 && (
        <Box
          sx={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxHeight: "300px",
            bgcolor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
            borderRadius: "15px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            p: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "3px" },
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b", px: 2, pt: 1, display: "block", mb: 1, fontWeight: 700, textTransform: "uppercase" }}>
            {searchResults.length} matches found
          </Typography>
          {searchResults.map((msg) => (
            <Box
              key={msg._id}
              onClick={() => {
                const element = document.getElementById(msg._id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                  element.style.backgroundColor = "rgba(59,130,246,0.2)";
                  setTimeout(() => { element.style.backgroundColor = "transparent"; }, 2000);
                }
                setIsSearch(false);
              }}
              sx={{
                p: 1.5,
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                mb: 0.5
              }}
            >
              <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 700 }}>
                {msg.sender.name}
              </Typography>
              <Typography noWrap variant="body2" sx={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                {msg.content}
              </Typography>
            </Box>
          ))}
          {searchResults.length === 0 && (
            <Typography sx={{ color: "#64748b", textAlign: "center", py: 2, fontSize: "0.85rem" }}>
              No results found for "{searchQuery}"
            </Typography>
          )}
        </Box>
      )}
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1.5rem 1.5rem 0.5rem"}
        spacing={"1rem"}
        sx={{
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #0d1526 0%, #0f172a 100%)",
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(59,130,246,0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        }}
      >


        {allMessages.map((i) => (
          <MessageComponent
            message={i}
            user={user}
            key={i._id}
            setReplyingTo={setReplyingTo}
          />
        ))}

        {userTyping && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1, mt: 1 }}>
            <TypingLoader />
            <Typography sx={{ fontSize: "0.75rem", color: "#64748b", fontStyle: "italic" }}>
              someone is typing...
            </Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Stack>

      <Box sx={{ display: "flex", flexDirection: "column", height: "auto" }}>
        {/* Reply Preview Banner */}
        {replyingTo && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "rgba(30, 41, 59, 0.95)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              px: { xs: 2, md: 3 },
              py: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, borderLeft: "3px solid #3b82f6", pl: 1.5 }}>
              <Typography sx={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: 600, mb: 0.2 }}>
                Replying to {replyingTo.sender?.name || "User"}
              </Typography>
              <Typography noWrap sx={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                {replyingTo.content || "Attachment"}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setReplyingTo(null)}
              sx={{ color: "#64748b", "&:hover": { color: "#ef4444" } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <form
          style={{ height: "70px" }}
          onSubmit={submitHandler}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              px: 2,
              gap: 1.5,
              background: "rgba(15, 23, 42, 0.95)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Emoji picker */}
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(emoji) => {
                  setMessage((prev) => prev + emoji);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}

            {/* Emoji button */}
            <IconButton
              onClick={() => setShowEmojiPicker((p) => !p)}
              sx={{
                color: showEmojiPicker ? "#fbbf24" : "#64748b",
                flexShrink: 0,
                borderRadius: "10px",
                transition: "all 0.2s",
                "&:hover": { color: "#fbbf24", bgcolor: "rgba(251,191,36,0.08)" },
              }}
            >
              <EmojiIcon />
            </IconButton>

            {/* Attach button */}
            <IconButton
              onClick={handleFileOpen}
              sx={{
                color: "#64748b",
                flexShrink: 0,
                borderRadius: "10px",
                transform: "rotate(30deg)",
                "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              <AttachFileIcon />
            </IconButton>

            {/* Input wrapper */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                height: "48px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                "&:focus-within": {
                  border: "1px solid rgba(59,130,246,0.4)",
                },
                transition: "border 0.2s ease",
              }}
            >
              <InputBox
                placeholder="Type a message..."
                value={message}
                onChange={messageOnChange}
              />
            </Box>

            {/* Send button */}
            <IconButton
              type="submit"
              sx={{
                flexShrink: 0,
                width: 46,
                height: 46,
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.5)",
                },
              }}
            >
              <SendIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Box>
        </form>
      </Box>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Box>
  );
}

// ── Emoji Picker ────────────────────────────────────────
const EMOJI_CATEGORIES = [
  { label: "😊 Smileys", emojis: ["😀", "😂", "😍", "😎", "😭", "😅", "🤣", "😊", "😇", "🥰", "😘", "😜", "🤔", "😴", "🤯", "😱", "🥳", "😡", "😔", "🤗"] },
  { label: "👋 Gestures", emojis: ["👍", "👎", "❤️", "🔥", "✨", "💯", "🙏", "👏", "💪", "🤝", "✌️", "🤙", "👊", "💅", "🫶", "🤞", "☝️", "🤜", "🫀", "🫂"] },
  { label: "🎉 Celebration", emojis: ["🎉", "🎊", "🥂", "🍾", "🎂", "🎁", "🎶", "🎵", "🏆", "🥇", "🎯", "🎮", "🎸", "🕺", "💃", "🎆", "🎇", "✨", "🌟", "⭐"] },
  { label: "🌿 Nature", emojis: ["🌸", "🌻", "🌹", "🌊", "🦋", "🐶", "🐱", "🌈", "🌙", "⭐", "🌍", "🐼", "🦁", "🐬", "🦅", "🌺", "🍀", "🌴", "🍁", "🌾"] },
  { label: "🍕 Food", emojis: ["🍕", "🍔", "🍣", "🍜", "🍦", "🍰", "🍩", "☕", "🧋", "🍷", "🥑", "🍎", "🍓", "🍇", "🌮", "🥗", "🧆", "🍱", "🥡", "🍫"] },
];

function EmojiPicker({ onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Fade in>
      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: 0,
          zIndex: 1200,
          width: 340,
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Category tabs */}
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            overflowX: "auto",
            px: 1, pt: 1,
            gap: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {EMOJI_CATEGORIES.map((cat, i) => (
            <Box
              key={i}
              onClick={() => setActiveTab(i)}
              sx={{
                px: 1.2, py: 0.6,
                borderRadius: "10px 10px 0 0",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: activeTab === i ? 700 : 400,
                color: activeTab === i ? "#f1f5f9" : "#64748b",
                bgcolor: activeTab === i ? "rgba(59,130,246,0.15)" : "transparent",
                borderBottom: activeTab === i ? "2px solid #3b82f6" : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                "&:hover": { color: "#e2e8f0" },
              }}
            >
              {cat.label}
            </Box>
          ))}
        </Box>

        {/* Emoji grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 0.3,
            p: 1.5,
            maxHeight: "180px",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "3px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" },
          }}
        >
          {EMOJI_CATEGORIES[activeTab].emojis.map((emoji, i) => (
            <Box
              key={i}
              onClick={() => onSelect(emoji)}
              sx={{
                fontSize: "1.3rem",
                textAlign: "center",
                py: 0.4,
                borderRadius: "8px",
                cursor: "pointer",
                lineHeight: 1.4,
                transition: "all 0.1s",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)", transform: "scale(1.2)" },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Box>
      </Paper>
    </Fade>
  );
}

export default Chat;

