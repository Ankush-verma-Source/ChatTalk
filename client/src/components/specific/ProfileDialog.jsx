import {
  Avatar,
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsProfile } from "../../features/misc/misc";
import { useUpdateProfileMutation, useUpdateAvatarMutation } from "../../app/api";
import { useAsyncMutation } from "../../hooks/hook";
import toast from "react-hot-toast";

const darkDialog = {
  background: "#1a2236",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  color: "#f8fafc",
  overflow: "hidden",
};

function ProfileDialog() {
  const { isProfile } = useSelector((state) => state.misc);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url);

  const [updateProfile] = useAsyncMutation(useUpdateProfileMutation);
  const [updateAvatar] = useAsyncMutation(useUpdateAvatarMutation);

  const closeHandler = () => {
    dispatch(setIsProfile(false));
    setIsEditing(false);
  };

  const saveProfileHandler = async () => {
    await updateProfile("Updating profile...", { name, bio });
    setIsEditing(false);
  };

  const avatarChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };

    const formData = new FormData();
    formData.append("avatar", file);

    await updateAvatar("Updating avatar...", formData);
  };

  return (
    <Dialog
      open={isProfile}
      onClose={closeHandler}
      PaperProps={{ sx: darkDialog }}
    >
      <Stack p={"2rem"} direction={"column"} width={{ xs: "90vw", sm: "24rem" }} spacing={3} alignItems="center">
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography variant="h5" fontWeight="800" sx={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            My Profile
          </Typography>
          <IconButton onClick={closeHandler} size="small"
            sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Avatar Section */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={avatarPreview}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #3b82f6",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
            }}
          />
          <input
            type="file"
            accept="image/*"
            id="avatar-input"
            style={{ display: "none" }}
            onChange={avatarChangeHandler}
          />
          <Tooltip title="Change Avatar">
            <label htmlFor="avatar-input">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "#3b82f6",
                  color: "white",
                  "&:hover": { bgcolor: "#2563eb" },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                size="small"
              >
                <CameraIcon fontSize="small" />
              </IconButton>
            </label>
          </Tooltip>
        </Box>

        {/* Info Section */}
        <Stack spacing={3} width="100%">
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>
                Display Name
              </Typography>
              {!isEditing ? (
                <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ color: "#3b82f6" }}>
                  <EditIcon fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton size="small" onClick={saveProfileHandler} sx={{ color: "#22c55e" }}>
                  <CheckIcon fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    bgcolor: "rgba(15,23,42,0.6)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  }
                }}
              />
            ) : (
              <Typography variant="body1" sx={{ color: "#f1f5f9", fontWeight: 500 }}>
                {user?.name}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", display: "block", mb: 1 }}>
              Username
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              @{user?.username}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", display: "block", mb: 1 }}>
              Bio
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#e2e8f0",
                    bgcolor: "rgba(15,23,42,0.6)",
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  }
                }}
              />
            ) : (
              <Typography variant="body2" sx={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                {user?.bio || "No bio added yet."}
              </Typography>
            )}
          </Box>
        </Stack>

        {isEditing && (
          <Button
            fullWidth
            variant="contained"
            onClick={saveProfileHandler}
            sx={{
              bgcolor: "#3b82f6",
              borderRadius: "10px",
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
              "&:hover": { bgcolor: "#2563eb" },
            }}
          >
            Save Changes
          </Button>
        )}
      </Stack>
    </Dialog>
  );
}

export default ProfileDialog;
