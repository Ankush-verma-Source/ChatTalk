import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function MessageComponent({ message, user }) {
  const { sender, content, attachements = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  // console.log(message);
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}
      {attachements.length > 0 &&
        attachements.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index}>
              <a href={url} target="_blank" download style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
}

export default memo(MessageComponent);
