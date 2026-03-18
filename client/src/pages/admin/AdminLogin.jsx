import { useInputValidation } from "6pp";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../features/thunks/admin";

// const isAdmin= false;

// ── Shared dark input style ──────────────────────────────
const darkInput = {
  "& .MuiOutlinedInput-root": {
    color: "#e2e8f0",
    bgcolor: "rgba(15,23,42,0.6)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#64748b" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

function AdminLogin() {
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #0d1526 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <Box sx={{ position: "absolute", top: "10%", left: "15%", width: 300, height: 300, bgcolor: "rgba(139,92,246,0.1)", filter: "blur(80px)", borderRadius: "50%" }} />
      <Box sx={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, bgcolor: "rgba(59,130,246,0.1)", filter: "blur(80px)", borderRadius: "50%" }} />

      <Container component={"main"} maxWidth={"xs"} sx={{ zIndex: 1, position: "relative" }}>
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(30,41,59,0.65)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              width: 56, height: 56, mb: 2,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="h4">🛡️</Typography>
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#f1f5f9", letterSpacing: "-0.02em", mb: 0.5 }}
          >
            Admin Panel
          </Typography>
          <Typography
            sx={{ color: "#94a3b8", fontSize: "0.875rem", mb: 3 }}
          >
            Enter secret key to access dashboard
          </Typography>

          <form
            style={{ width: "100%" }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="Secret Key"
              type="password"
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              sx={darkInput}
            />
            <Button
              sx={{
                marginTop: "1.5rem",
                padding: "0.8rem",
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.45)",
                },
              }}
              variant="contained"
              fullWidth
              type="submit"
            >
              Verify Access
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminLogin;
