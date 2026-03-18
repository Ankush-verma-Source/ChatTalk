import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        background: "radial-gradient(circle at 50% -10%, #1e3a8a 0%, #0f172a 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 2,
      }}
    >
      {/* Animated 404 number */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          sx={{
            fontSize: { xs: "6rem", sm: "10rem" },
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          404
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ textAlign: "center" }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          sx={{ color: "#f1f5f9", mb: 1, letterSpacing: "-0.02em" }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#64748b", maxWidth: 360, mx: "auto", mb: 3.5 }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          onClick={() => navigate("/")}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            px: 4,
            py: 1.4,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 24px rgba(37, 99, 235, 0.45)",
            },
          }}
        >
          ← Go back home
        </Button>
      </motion.div>

      {/* Decorative floating orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 300,
          height: 300,
          bgcolor: "rgba(59,130,246,0.06)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 400,
          height: 400,
          bgcolor: "rgba(139,92,246,0.06)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

export default NotFound;
