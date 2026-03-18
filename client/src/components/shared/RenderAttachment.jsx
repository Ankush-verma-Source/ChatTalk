import { useState } from "react";
import { FileOpen as FileOpenIcon, Download as DownloadIcon, Close as CloseIcon, ZoomIn as ZoomInIcon } from "@mui/icons-material";
import { Box, IconButton, Backdrop, Typography } from "@mui/material";
import { transformImage } from "../../lib/features";

// ── Image Lightbox ──────────────────────────────────────
function ImageLightbox({ src, onClose }) {
  return (
    <Backdrop
      open
      onClick={onClose}
      sx={{ zIndex: 9999, bgcolor: "rgba(0,0,0,0.92)", flexDirection: "column" }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "fixed", top: 16, right: 16,
          color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.08)",
          borderRadius: "12px",
          "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          zIndex: 10000,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Download button */}
      <IconButton
        component="a"
        href={src}
        download
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "fixed", top: 16, right: 68,
          color: "#f1f5f9", bgcolor: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: "12px",
          "&:hover": { bgcolor: "rgba(59,130,246,0.25)" },
          zIndex: 10000,
        }}
      >
        <DownloadIcon />
      </IconButton>

      <Box
        component="img"
        src={src}
        alt="Full view"
        onClick={(e) => e.stopPropagation()}
        sx={{
          maxWidth: "90vw",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: "16px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    </Backdrop>
  );
}

// ── Main render function ────────────────────────────────
function RenderAttachment(file, url) {
  switch (file) {
    case "video":
      return (
        <video
          src={url}
          controls
          preload="none"
          style={{
            width: "100%",
            maxWidth: "260px",
            borderRadius: "12px",
            display: "block",
          }}
        />
      );

    case "image":
      return <ClickableImage url={url} />;

    case "audio":
      return (
        <Box sx={{ my: 0.5 }}>
          <audio
            src={url}
            controls
            preload="none"
            style={{ width: "220px", borderRadius: "8px" }}
          />
        </Box>
      );

    default:
      return <FileCard url={url} />;
  }
}

const FileCard = ({ url }) => {
  const fileName = url.split("/").pop().split("?")[0] || "Attachment";
  const extension = fileName.split(".").pop().toLowerCase();
  
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      download
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: "16px",
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        textDecoration: "none",
        color: "#f1f5f9",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        maxWidth: "240px",
        position: "relative",
        overflow: "hidden",
        "&:hover": { 
          bgcolor: "rgba(255,255,255,0.08)", 
          transform: "translateY(-2px)",
          "& .download-overlay": { opacity: 1 }
        },
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box sx={{ 
        p: 1, 
        borderRadius: "10px", 
        bgcolor: extension === "pdf" ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.15)",
        color: extension === "pdf" ? "#f87171" : "#3b82f6",
        display: "flex"
      }}>
        <FileOpenIcon />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="caption" 
          noWrap 
          sx={{ display: "block", color: "#64748b", fontWeight: 700, fontSize: "0.6rem", textTransform: "uppercase" }}
        >
          {extension} File
        </Typography>
        <Typography noWrap sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {fileName}
        </Typography>
      </Box>
      <Box className="download-overlay" sx={{ 
        position: "absolute", inset: 0, 
        bgcolor: "rgba(59, 130, 246, 0.1)", 
        opacity: 0, transition: "opacity 0.2s" 
      }} />
    </Box>
  );
};

// ── Clickable image with lightbox ───────────────────────
function ClickableImage({ url }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          cursor: "zoom-in",
          borderRadius: "12px",
          overflow: "hidden",
          "&:hover .zoom-overlay": { opacity: 1 },
        }}
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true); }}
      >
        <Box
          component="img"
          src={transformImage(url)}
          alt="Attachment"
          sx={{
            width: "220px",
            height: "160px",
            objectFit: "cover",
            display: "block",
            borderRadius: "12px",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.03)" },
          }}
        />
        {/* Hover overlay */}
        <Box
          className="zoom-overlay"
          sx={{
            position: "absolute", inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0, transition: "opacity 0.2s ease",
            borderRadius: "12px",
          }}
        >
          <ZoomInIcon sx={{ color: "white", fontSize: "2rem" }} />
        </Box>
      </Box>

      {open && <ImageLightbox src={url} onClose={() => setOpen(false)} />}
    </>
  );
}

export default RenderAttachment;
