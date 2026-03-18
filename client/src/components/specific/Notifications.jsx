import {
  Avatar,
  Box,
  Button,
  Dialog,
  IconButton,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Close as DeclineIcon,
} from "@mui/icons-material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../app/api.js";
import { setIsNotification } from "../../features/misc/misc.js";
import { useAsyncMutation, useErrors } from "../../hooks/hook.jsx";
import { transformImage } from "../../lib/features.js";

const darkDialog = {
  background: "#1a2236",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  color: "#f8fafc",
};

function Notifications() {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler} PaperProps={{ sx: darkDialog }}>
      <Stack p={"1.5rem"} width={{ xs: "90vw", sm: "24rem" }} spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                bgcolor: "rgba(251,191,36,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <NotificationsIcon sx={{ color: "#fbbf24", fontSize: "1.1rem" }} />
            </Box>
            <Typography fontWeight="700" sx={{ color: "#f1f5f9", fontSize: "1.05rem" }}>
              Notifications
            </Typography>
          </Stack>
          <IconButton onClick={closeHandler} size="small"
            sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Divider */}
        <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.06)" }} />

        {/* Notifications list */}
        {isLoading ? (
          <Skeleton variant="rectangular" height={60} sx={{ borderRadius: "12px", bgcolor: "rgba(255,255,255,0.05)" }} />
        ) : (
          <>
            {data?.allRequests?.length > 0 ? (
              data.allRequests.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Box sx={{ py: 3, textAlign: "center" }}>
                <Box sx={{ fontSize: "2.5rem", mb: 1 }}>🔔</Box>
                <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                  You're all caught up!
                </Typography>
              </Box>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem
      disablePadding
      sx={{
        mb: 1,
        borderRadius: "12px",
        bgcolor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1.5}
        width={"100%"}
        px={1.5}
        py={1.2}
      >
        <Avatar
          src={avatar?.url ? transformImage(avatar.url, 60) : undefined}
          sx={{ width: 38, height: 38, border: "2px solid rgba(59,130,246,0.3)" }}
        />
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            color: "#e2e8f0",
            fontSize: "0.85rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: "#f1f5f9" }}>
            {name}
          </Box>{" "}
          sent you a friend request.
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => handler({ _id, accept: true })}
            sx={{
              width: 30, height: 30, borderRadius: "8px",
              bgcolor: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              "&:hover": { bgcolor: "rgba(34,197,94,0.22)" },
            }}
          >
            <CheckIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handler({ _id, accept: false })}
            sx={{
              width: 30, height: 30, borderRadius: "8px",
              bgcolor: "rgba(239,68,68,0.12)",
              color: "#f87171",
              "&:hover": { bgcolor: "rgba(239,68,68,0.22)" },
            }}
          >
            <DeclineIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
