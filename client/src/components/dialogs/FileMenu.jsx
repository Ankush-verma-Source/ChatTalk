import { ListItemText, Menu, MenuItem, MenuList, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../features/misc/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachementsMutation } from "../../app/api";

function FileMenu({ anchorE1, chatId }) {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachementsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));
      const res = await sendAttachments(myForm);
      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(`Failed to send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const menuItems = [
    {
      label: "Image",
      icon: <ImageIcon />,
      color: "#3b82f6",
      bgColor: "rgba(59,130,246,0.12)",
      onClick: selectImage,
      ref: imageRef,
      accept: "image/png, image/jpeg, image/gif",
      key: "Images",
    },
    {
      label: "Audio",
      icon: <AudioFileIcon />,
      color: "#a78bfa",
      bgColor: "rgba(167,139,250,0.12)",
      onClick: selectAudio,
      ref: audioRef,
      accept: "audio/mpeg, audio/wav",
      key: "Audios",
    },
    {
      label: "Video",
      icon: <VideoFileIcon />,
      color: "#34d399",
      bgColor: "rgba(52,211,153,0.12)",
      onClick: selectVideo,
      ref: videoRef,
      accept: "video/mp4, video/webm, video/ogg",
      key: "Videos",
    },
    {
      label: "File",
      icon: <UploadFileIcon />,
      color: "#fbbf24",
      bgColor: "rgba(251,191,36,0.12)",
      onClick: selectFile,
      ref: fileRef,
      accept: "*",
      key: "Files",
    },
  ];

  return (
    <Menu
      open={isFileMenu}
      onClose={closeFileMenu}
      anchorEl={anchorE1}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "left", vertical: "top" }}
      PaperProps={{
        sx: {
          background: "#1e293b",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          minWidth: "180px",
          p: 0.5,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "#60a5fa", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          Share
        </Typography>
      </Box>

      <MenuList sx={{ p: 0.5 }}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={item.onClick}
            sx={{
              borderRadius: "10px",
              px: 1.5,
              py: 1,
              mb: 0.3,
              gap: 1.5,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: item.bgColor,
              },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: item.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                sx: { color: "#e2e8f0", fontWeight: 500, fontSize: "0.88rem" },
              }}
            />
            <input
              type="file"
              multiple
              accept={item.accept}
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, item.key)}
              ref={item.ref}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default FileMenu;
