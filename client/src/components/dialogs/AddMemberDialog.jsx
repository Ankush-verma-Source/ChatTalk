import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../app/api";
import { setIsAddMember } from "../../features/misc/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import UserItem from "../shared/UserItem";

function AddMemberDialog({ chatId }) {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { chatId, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Button onClick={closeHandler} color="error">
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default AddMemberDialog;
