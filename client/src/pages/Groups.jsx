import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
  Group as GroupIcon,
  PeopleAlt as PeopleAltIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { lazy, memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../app/api";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { setIsAddMember } from "../features/misc/misc";
import { useAsyncMutation, useErrors } from "../hooks/hook";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

// ── Shared dark input style ──────────────────────────────
const darkInput = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    bgcolor: "rgba(15,23,42,0.6)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

function Groups() {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];
  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue });
  };

  const navigateBack = () => navigate("/");
  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => dispatch(setIsAddMember(true));
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/group");
  };
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid
      container
      height={"100vh"}
      sx={{ background: "linear-gradient(135deg, #0f172a 0%, #0d1526 100%)" }}
    >
      {/* ── Left: Groups List ── */}
      <Grid
        size={{ sm: 4, md: 3 }}
        sx={{ display: { xs: "none", sm: "block" }, height: "100%" }}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      {/* ── Right: Group Details ── */}
      <Grid
        size={{ xs: 12, sm: 8, md: 9 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 2,
            background: "rgba(15,23,42,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Mobile menu btn */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              onClick={handleMobile}
              sx={{ color: "#94a3b8", borderRadius: "10px" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Back button */}
          <Tooltip title="Back to chats">
            <IconButton
              onClick={navigateBack}
              sx={{
                color: "#94a3b8",
                borderRadius: "10px",
                "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.07)" },
              }}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "rgba(139,92,246,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GroupIcon sx={{ color: "#a78bfa", fontSize: "1.1rem" }} />
          </Box>
          <Typography fontWeight="700" sx={{ color: "#f1f5f9", fontSize: "1.1rem" }}>
            Manage Groups
          </Typography>
        </Box>

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: { xs: 2, md: 6 },
            py: 4,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(139,92,246,0.2)", borderRadius: "4px" },
          }}
        >
          {groupName ? (
            <Box sx={{ width: "100%", maxWidth: "600px" }}>
              {/* Group name area */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  bgcolor: "rgba(30,41,59,0.5)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  mb: 3,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", mb: 1.5 }}
                >
                  Group Name
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  {isEdit ? (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        value={groupNameUpdatedValue}
                        onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                        sx={darkInput}
                      />
                      <Tooltip title="Save">
                        <IconButton
                          onClick={updateGroupName}
                          disabled={isLoadingGroupName}
                          sx={{
                            bgcolor: "rgba(59,130,246,0.15)",
                            color: "#3b82f6",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "rgba(59,130,246,0.25)" },
                          }}
                        >
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ color: "#f1f5f9", flex: 1, letterSpacing: "-0.02em" }}
                      >
                        {groupName}
                      </Typography>
                      <Tooltip title="Edit name">
                        <IconButton
                          onClick={() => setIsEdit(true)}
                          disabled={isLoadingGroupName}
                          sx={{
                            color: "#64748b",
                            borderRadius: "10px",
                            "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.07)" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Box>

              {/* Members section */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  bgcolor: "rgba(30,41,59,0.5)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  mb: 3,
                }}
              >
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <PeopleAltIcon sx={{ color: "#60a5fa", fontSize: "1rem" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}
                  >
                    Members ({members.length})
                  </Typography>
                </Stack>

                <Stack
                  spacing={0.5}
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { width: "3px" },
                    "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" },
                  }}
                >
                  {isLoadingRemoveMember ? (
                    <CircularProgress size={24} sx={{ color: "#3b82f6", mx: "auto", display: "block" }} />
                  ) : (
                    members.map((i) => (
                      <UserItem
                        user={i}
                        key={i._id}
                        isAdded
                        handler={removeMemberHandler}
                      />
                    ))
                  )}
                </Stack>
              </Box>

              {/* Action buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={openAddMemberHandler}
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    fontWeight: 600,
                    py: 1.2,
                    borderColor: "rgba(59,130,246,0.3)",
                    color: "#60a5fa",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      bgcolor: "rgba(59,130,246,0.08)",
                    },
                  }}
                >
                  Add Member
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={openConfirmDeleteHandler}
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    fontWeight: 600,
                    py: 1.2,
                    borderColor: "rgba(239,68,68,0.3)",
                    color: "#f87171",
                    "&:hover": {
                      borderColor: "#ef4444",
                      bgcolor: "rgba(239,68,68,0.08)",
                    },
                  }}
                >
                  Delete Group
                </Button>
              </Stack>
            </Box>
          ) : (
            /* Empty state — no group selected */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: "24px",
                  bgcolor: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  mb: 1,
                }}
              >
                <GroupIcon sx={{ fontSize: "3.5rem", color: "#a78bfa", opacity: 0.7 }} />
              </Box>
              <Typography variant="h6" fontWeight="600" sx={{ color: "#f1f5f9" }}>
                Select a group to manage
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", textAlign: "center", maxWidth: 280 }}>
                Choose a group from the list on the left to view members and settings.
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>

      {/* Mobile drawer */}
      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
        PaperProps={{ sx: { bgcolor: "transparent" } }}
      >
        <GroupsList w={"75vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>

      {isAddMember && (
        <Suspense fallback={<Backdrop open={true} />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open={true} />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
    </Grid>
  );
}

// ── GroupsList sidebar ───────────────────────────────────
const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      background: "linear-gradient(180deg, #1a2236 0%, #141d2e 100%)",
      height: "100%",
      overflowY: "auto",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      "&::-webkit-scrollbar": { width: "3px" },
      "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(139,92,246,0.2)", borderRadius: "4px" },
    }}
  >
    {/* Sidebar header */}
    <Box sx={{ px: 2, pt: 2.5, pb: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <Typography
        variant="overline"
        sx={{ color: "#a78bfa", fontWeight: 700, letterSpacing: "0.12em", fontSize: "0.7rem" }}
      >
        👥 My Groups
      </Typography>
    </Box>

    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
          No groups yet
        </Typography>
      </Box>
    )}
  </Stack>
);

// ── GroupListItem ────────────────────────────────────────
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isSelected = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      style={{ textDecoration: "none" }}
      onClick={(e) => { if (isSelected) e.preventDefault(); }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mx: 1,
          my: 0.4,
          px: 1.5,
          py: 1,
          borderRadius: "12px",
          bgcolor: isSelected ? "rgba(139,92,246,0.18)" : "transparent",
          border: isSelected ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": isSelected ? {} : {
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        <AvatarCard avatar={avatar} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              color: isSelected ? "#f8fafc" : "#e2e8f0",
              fontWeight: isSelected ? 600 : 500,
              fontSize: "0.9rem",
            }}
          >
            {name}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#475569" }}>
            Group chat
          </Typography>
        </Box>
      </Box>
    </Link>
  );
});

export default Groups;
