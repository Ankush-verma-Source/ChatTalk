import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Group as GroupIcon, Close as CloseIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../app/api";
import { setIsNewGroup } from "../../features/misc/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import UserItem from "../shared/UserItem";
import toast from "react-hot-toast";

const darkDialog = {
  background: "#1a2236",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  color: "#f8fafc",
};

function NewGroup() {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useErrors([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2) return toast.error("Select at least 3 members");
    newGroup("Creating New Group...", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  return (
    <Dialog open={isNewGroup} onClose={closeHandler} PaperProps={{ sx: darkDialog }}>
      <Stack p={"1.5rem"} width={{ xs: "90vw", sm: "28rem" }} spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                bgcolor: "rgba(139,92,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <GroupIcon sx={{ color: "#a78bfa", fontSize: "1.1rem" }} />
            </Box>
            <Typography fontWeight="700" sx={{ color: "#f1f5f9", fontSize: "1.05rem" }}>
              New Group
            </Typography>
          </Stack>
          <IconButton onClick={closeHandler} size="small"
            sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.06)" }} />

        {/* Group name input */}
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              bgcolor: "rgba(15,23,42,0.6)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
              "&.Mui-focused fieldset": { borderColor: "#a78bfa" },
            },
            "& .MuiInputLabel-root": { color: "#64748b" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#a78bfa" },
          }}
        />

        {/* Selected chips */}
        {selectedMembers.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={0.8}>
            {data?.friends
              ?.filter((f) => selectedMembers.includes(f._id))
              .map((f) => (
                <Chip
                  key={f._id}
                  label={f.name}
                  size="small"
                  onDelete={() => selectMemberHandler(f._id)}
                  sx={{
                    bgcolor: "rgba(139,92,246,0.15)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.25)",
                    "& .MuiChip-deleteIcon": { color: "#a78bfa" },
                  }}
                />
              ))}
          </Stack>
        )}

        {/* Members list */}
        <Box>
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Select Members
          </Typography>
          <Stack
            sx={{
              mt: 1, maxHeight: "220px", overflowY: "auto",
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(139,92,246,0.2)", borderRadius: "4px" },
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" height={50} sx={{ borderRadius: "10px", bgcolor: "rgba(255,255,255,0.05)" }} />
            ) : data?.friends?.length === 0 ? (
              <Typography sx={{ color: "#64748b", fontSize: "0.85rem", py: 2, textAlign: "center" }}>
                No friends available
              </Typography>
            ) : (
              data?.friends?.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
            )}
          </Stack>
        </Box>

        {/* Action buttons */}
        <Stack direction={"row"} spacing={1.5}>
          <Button
            variant="outlined"
            fullWidth
            onClick={closeHandler}
            sx={{
              textTransform: "none", borderRadius: "12px", fontWeight: 600,
              borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)", bgcolor: "rgba(255,255,255,0.04)" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            sx={{
              textTransform: "none", borderRadius: "12px", fontWeight: 600,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 4px 12px rgba(109,40,217,0.35)",
              "&:hover": { background: "linear-gradient(135deg, #6d28d9, #5b21b6)" },
            }}
          >
            Create Group
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
