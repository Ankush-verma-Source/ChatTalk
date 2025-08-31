import { IconButton, ListItem, Typography, Stack, Avatar } from "@mui/material";
import { memo } from "react";
import { Add as AddIcon , Remove as RemoveIcon} from "@mui/icons-material";
import { transformImage } from "../../lib/features";

function UserItem({ user, handler, handlerIsLoading, isAdded=false, styling={} }) {
  const { _id, name, avatar } = user;
  // console.log("user",user);
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar src={transformImage(avatar,100)} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </Typography>

        <IconButton
          size="small"
          sx={{
            bgcolor:isAdded? "error.main": "primary.main",
            color: "white",
            "&:hover": { bgcolor: isAdded? "error.dark": "primary.dark" },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon/> : <AddIcon />}
          
        </IconButton>
      </Stack>
    </ListItem>
  );
}

export default memo(UserItem);
