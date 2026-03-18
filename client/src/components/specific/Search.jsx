import { useEffect, useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon, PersonAdd as PersonAddIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Dialog,
  IconButton,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../app/api";
import { setIsSearch } from "../../features/misc/misc";
import { useAsyncMutation } from "../../hooks/hook";

const darkDialog = {
  background: "#1a2236",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
  color: "#f8fafc",
};

function Search() {
  const search = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((err) => console.log(err));
    }, 1000);
    return () => clearTimeout(timeOutId);
  });

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
      PaperProps={{ sx: darkDialog }}
    >
      <Stack p={"1.5rem"} direction={"column"} width={{ xs: "90vw", sm: "26rem" }} spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                bgcolor: "rgba(59,130,246,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PersonAddIcon sx={{ color: "#3b82f6", fontSize: "1.1rem" }} />
            </Box>
            <Typography fontWeight="700" sx={{ color: "#f1f5f9", fontSize: "1.05rem" }}>
              Find People
            </Typography>
          </Stack>
          <IconButton onClick={searchCloseHandler} size="small"
            sx={{ color: "#64748b", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.06)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Search input */}
        <TextField
          placeholder="Search by name or username..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#60a5fa", fontSize: "1.1rem" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#e2e8f0",
              bgcolor: "rgba(15,23,42,0.6)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
            "& input::placeholder": { color: "#475569" },
          }}
        />

        {/* Results */}
        <List disablePadding>
          {users.length === 0 ? (
            <Typography sx={{ color: "#475569", textAlign: "center", py: 2, fontSize: "0.875rem" }}>
              {search.value ? "No users found" : "Start typing to search..."}
            </Typography>
          ) : (
            users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          )}
        </List>
      </Stack>
    </Dialog>
  );
}

export default Search;
