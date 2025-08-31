import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import { transformImage } from "../../lib/features";

function RenderAttachment(file, url) {
  switch (file) {
    case "video":
      return <video src={url} controls preload="none" width={"200px"} />;
      
    case "image":
      return <img
        src={transformImage(url)}
        alt="Attachment"
        width={"200px"}
        height={"150px"}
        style={{
          objectFit: "contain",
             display: "block", 
    margin: "0 auto"
        }}
      />;
      
    case "audio":
      return <audio src={url} controls preload="none" />;
    default:
      return <FileOpenIcon />;
  }
}

export default RenderAttachment;
