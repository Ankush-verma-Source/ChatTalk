import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ChatBubble as ChatBubbleIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { lazy, Suspense } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../../constants/config";
import { logout } from "../../features/authSlice/authSlice";
import { resetNotificationCount } from "../../features/chat/chat";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
  setIsProfile,
} from "../../features/misc/misc";

const SearchDialog = lazy(() => import("../specific/Search"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const ProfileDialog = lazy(() => import("../specific/ProfileDialog"));

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup, isProfile } = useSelector(
    (state) => state.misc
  );
  const { user } = useSelector((state) => state.auth);
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openProfile = () => dispatch(setIsProfile(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      dispatch(logout());
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const navigateToGroup = () => navigate("/group");

  return (
    <>
      <Box height={"4rem"}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "linear-gradient(90deg, #1a2236 0%, #16213e 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            height: "4rem",
            justifyContent: "center",
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: "4rem !important" }}>
            {/* Logo */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1.2,
                mr: 2,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)",
                }}
              >
                <ChatBubbleIcon sx={{ color: "white", fontSize: "1.1rem" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{
                  color: "#f1f5f9",
                  letterSpacing: "-0.03em",
                  fontSize: "1.15rem",
                }}
              >
                ChatTalk
              </Typography>
            </Box>

            {/* Mobile menu */}
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton sx={{ color: "#f8fafc" }} onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Action icons */}
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <IconBtn title="Search"        icon={<SearchIcon />}        onClick={openSearch} />
              <IconBtn title="New Group"     icon={<AddIcon />}           onClick={openNewGroup} />
              <IconBtn title="Manage Groups" icon={<GroupIcon />}         onClick={navigateToGroup} />
              <IconBtn
                title="Notification"
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <Tooltip title="Profile">
                <Avatar 
                  src={user?.avatar?.url} 
                  onClick={openProfile}
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    cursor: "pointer", 
                    ml: 0.5,
                    border: "2px solid rgba(255,255,255,0.1)", 
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#3b82f6", transform: "scale(1.1)" } 
                  }} 
                />
              </Tooltip>
              <Box sx={{ width: "1px", height: "24px", bgcolor: "rgba(255,255,255,0.1)", mx: 0.5 }} />
              <IconBtn title="Logout" icon={<LogoutIcon />} onClick={logoutHandler} danger />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open={true} />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NewGroupDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NotificationDialog />
        </Suspense>
      )}
      {isProfile && (
        <Suspense fallback={<Backdrop open={true} />}>
          <ProfileDialog />
        </Suspense>
      )}
    </>
  );
}

function IconBtn({ title, icon, onClick, value, danger = false }) {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        sx={{
          color: danger ? "#f87171" : "#94a3b8",
          borderRadius: "10px",
          width: 40,
          height: 40,
          transition: "all 0.2s ease",
          "&:hover": {
            color: danger ? "#fca5a5" : "#f1f5f9",
            bgcolor: danger ? "rgba(248, 113, 113, 0.1)" : "rgba(255,255,255,0.08)",
            transform: "scale(1.05)",
          },
        }}
      >
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
}

export default Header;
