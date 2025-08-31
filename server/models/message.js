import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: String,
    attachements : [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
