

import { CameraAlt as CameraAltIcon, AccountCircle as AccountCircleIcon, ChatBubble as ChatBubbleIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { VisuallyHiddenInput } from "../components/styles/styledComponents";
import { motion, AnimatePresence } from "framer-motion";

import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";

import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { login } from "../features/authSlice/authSlice";
import { usernameValidator } from "../utils/validators";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // custom validators for form :
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(login(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing up...");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("avatar", avatar.file);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      // console.log(data);
      dispatch(login(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };
  const inputStyles = {
    marginBottom: "1rem",
    "& .MuiOutlinedInput-root": {
      color: "#f8fafc",
      backgroundColor: "rgba(15, 23, 42, 0.6)", // Deeper dark for a hollow, soft effect
      borderRadius: "14px",
      "& fieldset": { border: "1px solid rgba(255, 255, 255, 0.04)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
      "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: "2px" },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px #1e293b inset",
        WebkitTextFillColor: "#f8fafc",
        transition: "background-color 5000s ease-in-out 0s",
      },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" }, // Brighter floating label
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        background: "radial-gradient(circle at 50% -20%, #1e3a8a 0%, #0f172a 60%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem"
      }}
    >
      <Container
        component={"main"}
        maxWidth={"sm"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            padding: "3.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "24px",
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%",
            color: "#f8fafc"
          }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <Box sx={{ p: 2, borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", mb: 3 }}>
                <ChatBubbleIcon sx={{ fontSize: "3rem", color: "#3b82f6" }} />
              </Box>
              <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: "#f8fafc", letterSpacing: "-0.02em" }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4 }}>
                Sign in to continue connecting.
              </Typography>
              <form
                style={{
                  width: "100%",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={inputStyles}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={inputStyles}
                />
                <Button
                  sx={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    borderRadius: "14px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textTransform: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 15px 20px -3px rgba(37, 99, 235, 0.4)",
                    }
                  }}
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  Sign In
                </Button>

                <Box sx={{ width: '100%', my: 4, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
                  <Typography sx={{ mx: 2, color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>OR</Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
                </Box>

                <Button
                  disabled={isLoading}
                  variant="outlined"
                  fullWidth
                  onClick={toggleLogin}
                  sx={{ 
                    textTransform: "none", 
                    fontWeight: "600", 
                    fontSize: "1rem", 
                    padding: "1rem",
                    borderRadius: "14px",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#f8fafc",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.03)"
                    }
                  }}
                >
                  Create an account
                </Button>
              </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <Box sx={{ p: 2, borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", mb: 3 }}>
                <AccountCircleIcon sx={{ fontSize: "3rem", color: "#3b82f6" }} />
              </Box>
              <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: "#f8fafc", letterSpacing: "-0.02em" }}>
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4, textAlign: "center" }}>
                Join us and start connecting.
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                  sx={inputStyles}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  sx={inputStyles}
                />

                <TextField
                  required
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={inputStyles}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={inputStyles}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}

                <Button
                  sx={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    borderRadius: "14px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    textTransform: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 15px 20px -3px rgba(37, 99, 235, 0.4)",
                    }
                  }}
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Box sx={{ width: '100%', my: 4, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
                  <Typography sx={{ mx: 2, color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>OR</Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.08)' }} />
                </Box>

                <Button
                  disabled={isLoading}
                  variant="outlined"
                  fullWidth
                  onClick={toggleLogin}
                  sx={{ 
                    textTransform: "none", 
                    fontWeight: "600", 
                    fontSize: "1rem", 
                    padding: "1rem",
                    borderRadius: "14px",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#f8fafc",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.03)"
                    }
                  }}
                >
                  Login Instead
                </Button>
              </form>
              </motion.div>
            )}
          </AnimatePresence>
          </Paper>
      </Container>
    </Box>
  );
}

export default Login;

