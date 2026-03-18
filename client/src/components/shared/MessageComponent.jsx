import { Box, Typography, IconButton, TextField } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { memo, useState } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import { useDeleteMessageMutation, useEditMessageMutation, useReactMessageMutation } from "../../app/api";

function MessageComponent({ message, user, setReplyingTo }) {
  if (!message) return null;
  const { sender, content, attachements = [], createdAt, _id, reactions = [], replyTo, status, readBy = [] } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [reactMessageApi] = useReactMessageMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(content);

  const handleDelete = () => {
    deleteMessage(_id);
  };

  const handleReact = (emoji) => {
    reactMessageApi({ messageId: _id, emoji });
  };

  const handleEditSave = () => {
    if (editVal.trim() !== content) {
      editMessage({ messageId: _id, content: editVal });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      id={_id}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "column",
        alignItems: sameSender ? "flex-end" : "flex-start",
        maxWidth: "70%",
      }}
    >
      {/* Sender label for group chats */}
      {!sameSender && (
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#60a5fa",
            mb: 0.4,
            ml: 1.5,
          }}
        >
          {sender?.name}
        </Typography>
      )}

      <Box
        sx={{
          position: "relative",
          px: 2,
          py: 1.2,
          borderRadius: sameSender
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          background: sameSender
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "rgba(30, 41, 59, 0.8)",
          border: sameSender
            ? "none"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: sameSender
            ? "0 4px 15px rgba(37, 99, 235, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.3)",
          maxWidth: "100%",
          "&:hover .message-actions": { opacity: 1, pointerEvents: "auto", transform: "translateY(0)" },
        }}
      >
        {/* Floating Action Bar (Reactions + Reply + Edit/Delete) */}
        {!isEditing && (
          <Box
            className="message-actions"
            sx={{
              position: "absolute",
              top: "-18px",
              [sameSender ? "right" : "left"]: "10px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              borderRadius: "20px",
              px: 1,
              py: 0.4,
              opacity: 0,
              pointerEvents: "none",
              transform: "translateY(5px)",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
          >
            {["👍", "❤️", "😂", "🎉"].map((emoji) => (
              <Box
                key={emoji}
                onClick={() => handleReact(emoji)}
                sx={{
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "transform 0.1s",
                  "&:hover": { transform: "scale(1.3)" },
                }}
              >
                {emoji}
              </Box>
            ))}
            <Box
              sx={{
                width: "1px",
                height: "12px",
                bgcolor: "rgba(255,255,255,0.15)",
                mx: 0.5,
              }}
            />
            <Typography
              onClick={() => setReplyingTo(message)}
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#94a3b8",
                cursor: "pointer",
                mr: sameSender ? 0.5 : 0,
                "&:hover": { color: "#f1f5f9" },
              }}
            >
              Reply
            </Typography>

            {sameSender && (
              <>
                <Box
                  sx={{
                    width: "1px",
                    height: "12px",
                    bgcolor: "rgba(255,255,255,0.15)",
                    mx: 0.1,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{ color: "#94a3b8", p: 0.3, "&:hover": { color: "#3b82f6" } }}
                >
                  <EditIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{ color: "#94a3b8", p: 0.3, "&:hover": { color: "#ef4444" } }}
                >
                  <DeleteIcon sx={{ fontSize: "1rem" }} />
                </IconButton>
              </>
            )}
          </Box>
        )}

        {/* Reply To Preview */}
        {replyTo && (
          <Box
            sx={{
              background: sameSender ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.05)",
              borderLeft: `3px solid ${sameSender ? "#fbbf24" : "#3b82f6"}`,
              borderRadius: "4px",
              padding: "6px 10px",
              mb: 1.5,
              cursor: "pointer",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: sameSender ? "#fbbf24" : "#3b82f6",
                fontWeight: 700,
                mb: 0.3,
              }}
            >
              {replyTo.senderName}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontSize: "0.82rem",
                color: sameSender ? "rgba(255,255,255,0.7)" : "#94a3b8",
                fontStyle: "italic",
              }}
            >
              {replyTo.content}
            </Typography>
          </Box>
        )}

        {/* Attachments */}
        {attachements.length > 0 &&
          attachements.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return (
              <Box key={index} sx={{ mb: content ? 1 : 0, borderRadius: "12px", overflow: "hidden" }}>
                {RenderAttachment(file, url)}
              </Box>
            );
          })}

        {/* Message text / Edit input */}
        {content && !isEditing && (
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: sameSender ? "#fff" : "#e2e8f0",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {content}
          </Typography>
        )}

        {isEditing && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: "200px" }}>
            <TextField
              size="small"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  color: "#e2e8f0",
                  bgcolor: "rgba(15,23,42,0.8)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#fbbf24" },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "6px 10px",
                },
              }}
            />
            <IconButton
              size="small"
              onClick={handleEditSave}
              sx={{ bgcolor: "#22c55e", color: "white", p: 0.3, "&:hover": { bgcolor: "#16a34a" } }}
            >
              <CheckIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsEditing(false)}
              sx={{ bgcolor: "#ef4444", color: "white", p: 0.3, "&:hover": { bgcolor: "#dc2626" } }}
            >
              <CloseIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        )}

        {/* Display Reactions */}
        {reactions && reactions.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: "-12px",
              [sameSender ? "right" : "left"]: "12px",
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              px: 0.8,
              py: 0.2,
              gap: 0.3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {/* Group reactions by emoji and show count */}
            {Object.entries(
              reactions.reduce((acc, curr) => {
                acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <Box key={emoji} sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                <Typography sx={{ fontSize: "0.75rem", lineHeight: 1 }}>{emoji}</Typography>
                {count > 1 && <Typography sx={{ fontSize: "0.6rem", color: "#f1f5f9", fontWeight: 700 }}>{count}</Typography>}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box
        className="message-footer"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 0.5,
          mx: 0.5,
          opacity: 0.7,
          transition: "opacity 0.2s",
          "&:hover": { opacity: 1 },
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            color: "#475569",
          }}
        >
          {timeAgo}
        </Typography>

        {/* Read receipts for sent messages */}
        {sameSender && (
          <Box
            component="span"
            sx={{
              display: "flex",
              color: status === "seen" ? "#3b82f6" : "#64748b",
              fontSize: "0.8rem",
              lineHeight: 0,
            }}
          >
            {status === "sent" ? "✓" : "✓✓"}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

export default memo(MessageComponent);
