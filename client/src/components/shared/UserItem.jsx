import { Avatar, Box, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { Add as AddIcon, Check as CheckIcon } from "@mui/icons-material";
import { transformImage } from "../../lib/features";

function UserItem({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) {
  const { _id, name, avatar } = user;
  return (
    <ListItem
      disablePadding
      sx={{
        mb: 0.5,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.15s ease",
        "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1.5}
        width={"100%"}
        px={1}
        py={0.8}
        {...styling}
      >
        <Avatar
          src={transformImage(avatar, 100)}
          sx={{ width: 36, height: 36, border: "2px solid rgba(59,130,246,0.2)" }}
        />
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            color: "#e2e8f0",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>

        <IconButton
          size="small"
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            bgcolor: isAdded ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)",
            color: isAdded ? "#60a5fa" : "#3b82f6",
            border: isAdded ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(59,130,246,0.2)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: isAdded ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.25)",
              color: isAdded ? "#f87171" : "#60a5fa",
              borderColor: isAdded ? "rgba(239,68,68,0.3)" : "rgba(96,165,250,0.3)",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <CheckIcon sx={{ fontSize: "0.9rem" }} /> : <AddIcon sx={{ fontSize: "0.9rem" }} />}
        </IconButton>
      </Stack>
    </ListItem>
  );
}

export default memo(UserItem);
