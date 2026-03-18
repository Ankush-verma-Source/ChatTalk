import { Avatar, Box, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

function Profile({ user }) {
  return (
    <Stack spacing={"1.5rem"} direction={"column"} alignItems={"center"} sx={{ mt: "1rem" }}>
      {/* Pic has written at bottom active */}
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={transformImage(user?.avatar?.url)}
          sx={{
            width: 130,
            height: 130,
            objectFit: "contain",
            border: "4px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "#22c55e",
            color: "white",
            px: 1,
            borderRadius: "10px",
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 4px 10px rgba(34,197,94,0.3)",
          }}
        >
          Active
        </Typography>
      </Box>

      {/* Name at bottom of pic */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: "#f1f5f9", letterSpacing: "-0.03em" }}>
          {user?.name}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#94a3b8", 
            mt: 0.5, 
            fontStyle: "italic", 
            px: 2,
            lineHeight: 1.5 
          }}
        >
          {user?.bio || "Life is a journey, not a destination."}
        </Typography>
      </Box>

      {/* Separate sections for username and date */}
      <Stack spacing={2} width="100%" sx={{ px: 2, pt: 2 }}>
        <ProfileCard 
          heading={"Username"} 
          text={user?.username} 
          Icon={<UsernameIcon />} 
        />
        <ProfileCard 
          heading={"Joined At"} 
          text={moment(user?.createdAt).fromNow()} 
          Icon={<CalendarIcon />} 
        />
      </Stack>
    </Stack>
  );
}

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={1.5}
    sx={{
      bgcolor: "rgba(255,255,255,0.03)",
      p: 1.5,
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.05)",
      transition: "all 0.2s",
      "&:hover": { bgcolor: "rgba(255,255,255,0.05)", transform: "scale(1.02)" }
    }}
  >
    <Box sx={{ color: "#3b82f6", display: "flex" }}>{Icon}</Box>
    <Stack>
      <Typography variant={"caption"} sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase" }}>
        {heading}
      </Typography>
      <Typography variant={"body2"} sx={{ color: "#f1f5f9", fontWeight: 500 }}>
        {text}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
