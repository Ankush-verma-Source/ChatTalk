import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { WarningAmber as WarningIcon } from "@mui/icons-material";

function ConfirmDeleteDialog({ open, handleClose, deleteHandler }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: "#1a2236",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          color: "#f8fafc",
          minWidth: "320px",
        },
      }}
    >
      <Box sx={{ p: "1.5rem" }}>
        {/* Icon */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "14px",
            bgcolor: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <WarningIcon sx={{ color: "#f87171", fontSize: "1.6rem" }} />
        </Box>

        <DialogTitle
          sx={{
            p: 0,
            mb: 1,
            color: "#f1f5f9",
            fontWeight: 700,
            fontSize: "1.05rem",
          }}
        >
          Delete Group
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 2.5 }}>
          <DialogContentText sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Are you sure you want to delete this group? This action{" "}
            <Box component="span" sx={{ color: "#f87171", fontWeight: 600 }}>
              cannot be undone
            </Box>{" "}
            and all messages will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 0, gap: 1 }}>
          <Button
            onClick={handleClose}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteHandler}
            fullWidth
            sx={{
              textTransform: "none",
              borderRadius: "11px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;