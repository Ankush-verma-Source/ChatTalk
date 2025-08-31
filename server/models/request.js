import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    status: {
        type : String,
        default: "pending",
        enum:["pending","accepted","rejected"]
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;
