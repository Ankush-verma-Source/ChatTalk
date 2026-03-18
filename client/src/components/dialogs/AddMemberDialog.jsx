import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { PersonAdd as PersonAddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../app/api";
import { setIsAddMember } from "../../features/misc/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import UserItem from "../shared/UserItem";

function AddMemberDialog({ chatId }) {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { chatId, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => dispatch(setIsAddMember(false));

  useErrors([{ isError, error }]);

  return (
    <Dialog
      open={isAddMember}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          background: "#1a2236",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          color: "#f8fafc",
        },
      }}
    >
      <Stack p={"1.5rem"} width={{ xs: "90vw", sm: "26rem" }} spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                bgcolor: "rgba(59,130,246,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PersonAddIcon sx={{ color: "#3b82f6", fontSize: "1.1rem" }} />
            </Box>
            <Typography fontWeight="700" sx={{ color: "#f1f5f9", fontSize: "1.05rem" }}>
              Add Members
            </Typography>
          </Stack>
          <IconButton onClick={closeHandler} size="small"
            sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.06)" }} />

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
                    bgcolor: "rgba(59,130,246,0.15)",
                    color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.25)",
                    "& .MuiChip-deleteIcon": { color: "#60a5fa" },
                  }}
                />
              ))}
          </Stack>
        )}

        {/* Friends list */}
        <Stack
          sx={{
            maxHeight: "240px",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "3px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(59,130,246,0.2)", borderRadius: "4px" },
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" height={50} sx={{ borderRadius: "10px", bgcolor: "rgba(255,255,255,0.05)" }} />
          ) : data?.friends?.length > 0 ? (
            data.friends.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                No friends available to add
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Action buttons */}
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            onClick={closeHandler}
            sx={{
              textTransform: "none", borderRadius: "12px", fontWeight: 600,
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMembers || selectedMembers.length === 0}
            sx={{
              textTransform: "none", borderRadius: "12px", fontWeight: 600,
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              "&:hover": { background: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
              "&.Mui-disabled": { opacity: 0.5, color: "white" },
            }}
          >
            Add {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ""}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default AddMemberDialog;
