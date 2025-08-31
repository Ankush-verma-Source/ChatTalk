// import { useState } from "react";
// import "./Login.css";

// // form validation :
// import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
// import { usernameValidator } from "../utils/validators";

// // For avatar uploading preview :
// import {
//   IconButton,
//   Stack,
//   Avatar,
// } from "@mui/material";
// import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
// import { VisuallyHiddenInput } from "../components/styles/styledComponents";

// function Login() {
//   const [isLogin, setIsLogin] = useState(true);

//   // custom validators for form :
//   const name = useInputValidation("");
//   const bio = useInputValidation("");
//   const username = useInputValidation("", usernameValidator);
//   const password = useStrongPassword();
//   const avatar = useFileHandler("single");

//   const handleLogin = (e) => {
//     e.preventDefault();
//   };
//   const handleSignUp = (e) => {
//     e.preventDefault();
//   };

//   const toggleLogin = () => {
//     setIsLogin((prev) => !prev);
//   };

//   return (
//     <div className="page">
//       <div className="form-container">
//         {isLogin ? (
//           <>
//             <h2 className="title">Login</h2>
//             <form onSubmit={handleLogin}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username.value}
//                 onChange={username.changeHandler}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password.value}
//                 onChange={password.changeHandler}
//                 required
//               />

//               <button type="submit" className="btn primary">
//                 Login
//               </button>

//               <p className="divider">OR</p>

//               <button
//                 type="button"
//                 className="btn secondary"
//                 onClick={toggleLogin}
//               >
//                 Sign up Instead
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             <h2 className="title">Sign Up</h2>
//             <form onSubmit={handleSignUp}>
//               {/* <div className="avatar-wrapper">
//                 <img
//                   src={avatar.preview || "https://via.placeholder.com/150"}
//                   alt="Avatar"
//                   className="avatar"
//                 />
//                 <label className="camera-btn">
//                   📷
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={avatar.changeHandler}
//                     hidden
//                   />
//                 </label>
//               </div> */}
//               {/* <div className="avatar-wrapper">
//                 <img
//                   src={avatar.preview || "https://via.placeholder.com/120"}
//                   // alt="Avatar"
//                   className="avatar"
//                 />
//                 <label className="camera-btn">
//                   📷
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={avatar.changeHandler}
//                     hidden
//                   />
//                 </label>
//               </div> */}
//               <Stack position={"relative"} width={"10rem"} margin={"auto"}>
//                 <Avatar
//                   sx={{
//                     width: "10rem",
//                     height: "10rem",
//                     objectFit: "contain",
//                   }}
//                   src={avatar.preview}
//                 />

//                 <IconButton
//                   sx={{
//                     position: "absolute",
//                     bottom: "0",
//                     right: "0",
//                     color: "white",
//                     bgcolor: "rgba(0,0,0,0.5)",
//                     ":hover": {
//                       bgcolor: "rgba(0,0,0,0.7)",
//                     },
//                   }}
//                   component="label"
//                 >
//                   <>
//                     <CameraAltIcon />
//                     <VisuallyHiddenInput
//                       type="file"
//                       onChange={avatar.changeHandler}
//                     />
//                   </>
//                 </IconButton>
//               </Stack>
//                {avatar.error && <p className="error">{avatar.error}</p>}
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={name.value}
//                 onChange={name.changeHandler}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Bio"
//                 value={bio.value}
//                 onChange={bio.changeHandler}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username.value}
//                 onChange={username.changeHandler}
//                 required
//               />
//               {username.error && <p className="error">{username.error}</p>}
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password.value}
//                 onChange={password.changeHandler}
//                 required
//               />
//               {password.error && <p className="error">{password.error}</p>}
//               <button type="submit" className="btn primary">
//                 Sign Up
//               </button>
//               <p className="divider">OR</p>
//               <button
//                 type="button"
//                 className="btn secondary"
//                 onClick={toggleLogin}
//               >
//                 Login Instead
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Login;

import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
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
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(255 255 209),rgb(249,159,159))",
      }}
    >
      <Container
        component={"main"}
        maxWidth={"xs"}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  variant="text"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Sign up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
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
                  label="name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}

                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  variant="text"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Login;

// import { useState, useCallback } from 'react';
// import { Camera, Moon, Sun, Eye, EyeOff, User, Lock, Mail, FileText } from 'lucide-react';
// import './Login.css';

// // Custom hooks to replace the 6pp hooks
// const useInputValidation = (initialValue = '', validator) => {
//   const [value, setValue] = useState(initialValue);
//   const [error, setError] = useState('');

//   const changeHandler = useCallback((e) => {
//     const newValue = e.target.value;
//     setValue(newValue);

//     if (validator) {
//       const validationError = validator(newValue);
//       setError(validationError || '');
//     }
//   }, [validator]);

//   return { value, error, changeHandler };
// };

// const useStrongPassword = () => {
//   const [value, setValue] = useState('');
//   const [error, setError] = useState('');

//   const changeHandler = useCallback((e) => {
//     const newValue = e.target.value;
//     setValue(newValue);

//     if (newValue.length < 8) {
//       setError('Password must be at least 8 characters long');
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newValue)) {
//       setError('Password must contain uppercase, lowercase, and number');
//     } else {
//       setError('');
//     }
//   }, []);

//   return { value, error, changeHandler };
// };

// const useFileHandler = (/*type*/) => {
//   const [preview, setPreview] = useState('');
//   const [error, setError] = useState('');

//   const changeHandler = useCallback((e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         setError('File size must be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         setError('Please select an image file');
//         return;
//       }
//       setError('');
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target?.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   return { preview, error, changeHandler };
// };

// // Username validator
// const usernameValidator = (username) => {
//   if (username.length < 3) return 'Username must be at least 3 characters';
//   if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
//   return null;
// };

// function Login() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [isDark, setIsDark] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Form validation hooks
//   const name = useInputValidation('');
//   const bio = useInputValidation('');
//   const username = useInputValidation('', usernameValidator);
//   const password = useStrongPassword();
//   const avatar = useFileHandler('single');

//   const handleLogin = (e) => {
//     e.preventDefault();
//     console.log('Login attempted');
//   };

//   const handleSignUp = (e) => {
//     e.preventDefault();
//     console.log('Signup attempted');
//   };

//   const toggleLogin = () => {
//     setIsLogin((prev) => !prev);
//   };

//   const toggleTheme = () => {
//     setIsDark((prev) => !prev);
//   };

//   return (
//     <div className={`auth-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
//       {/* Animated Background */}
//       <div className="background-animation">
//         <div className="floating-shape shape-1"></div>
//         <div className="floating-shape shape-2"></div>
//         <div className="floating-shape shape-3"></div>
//         <div className="floating-shape shape-4"></div>
//       </div>

//       {/* Theme Toggle */}
//       <button className="theme-toggle" onClick={toggleTheme}>
//         {isDark ? <Sun size={20} /> : <Moon size={20} />}
//       </button>

//       {/* Main Content */}
//       <div className="auth-content">
//         <div className="auth-card">
//           {/* Header */}
//           <div className="auth-header">
//             <div className="auth-icon">
//               <User size={32} />
//             </div>
//             <h1 className="auth-title">
//               {isLogin ? 'Welcome Back! 👋' : 'Join Us! 🚀'}
//             </h1>
//             <p className="auth-subtitle">
//               {isLogin ? 'Sign in to your account' : 'Create your account'}
//             </p>
//           </div>

//           {isLogin ? (
//             /* Login Form */
//             <form onSubmit={handleLogin} className="auth-form">
//               {/* Username Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <User size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   required
//                   value={username.value}
//                   onChange={username.changeHandler}
//                   placeholder="Username"
//                   className="auth-input"
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <Lock size={20} />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={password.value}
//                   onChange={password.changeHandler}
//                   placeholder="Password"
//                   className="auth-input"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="password-toggle"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>

//               {/* Login Button */}
//               <button type="submit" className="auth-button primary">
//                 Sign In
//               </button>

//               <div className="divider">
//                 <span>OR</span>
//               </div>

//               <button type="button" onClick={toggleLogin} className="auth-button secondary">
//                 Create Account
//               </button>
//             </form>
//           ) : (
//             /* Signup Form */
//             <form onSubmit={handleSignUp} className="auth-form">
//               {/* Avatar Upload */}
//               <div className="avatar-upload">
//                 <div className="avatar-container">
//                   {avatar.preview ? (
//                     <img src={avatar.preview} alt="Avatar" className="avatar-image" />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       <User size={32} />
//                     </div>
//                   )}
//                   <label className="avatar-upload-btn">
//                     <Camera size={16} />
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={avatar.changeHandler}
//                       style={{ display: 'none' }}
//                     />
//                   </label>
//                 </div>
//                 {avatar.error && (
//                   <p className="error-message">{avatar.error}</p>
//                 )}
//               </div>

//               {/* Name Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <User size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   required
//                   value={name.value}
//                   onChange={name.changeHandler}
//                   placeholder="Full Name"
//                   className="auth-input"
//                 />
//               </div>

//               {/* Bio Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <FileText size={20} />
//                 </div>
//                 <textarea
//                   required
//                   value={bio.value}
//                   onChange={bio.changeHandler}
//                   placeholder="Bio"
//                   rows={3}
//                   className="auth-textarea"
//                 />
//               </div>

//               {/* Username Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <Mail size={20} />
//                 </div>
//                 <input
//                   type="text"
//                   required
//                   value={username.value}
//                   onChange={username.changeHandler}
//                   placeholder="Username"
//                   className="auth-input"
//                 />
//                 {username.error && (
//                   <p className="error-message">{username.error}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="input-group">
//                 <div className="input-icon">
//                   <Lock size={20} />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={password.value}
//                   onChange={password.changeHandler}
//                   placeholder="Password"
//                   className="auth-input"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="password-toggle"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {password.error && (
//                   <p className="error-message">{password.error}</p>
//                 )}
//               </div>

//               {/* Sign Up Button */}
//               <button type="submit" className="auth-button primary">
//                 Create Account
//               </button>

//               <div className="divider">
//                 <span>OR</span>
//               </div>

//               <button type="button" onClick={toggleLogin} className="auth-button secondary">
//                 Sign In Instead
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
