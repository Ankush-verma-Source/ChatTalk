import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../app/api";
import { setIsNewGroup } from "../../features/misc/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import UserItem from "../shared/UserItem";
import toast from "react-hot-toast";

function NewGroup() {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };
  console.log(selectedMembers);

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Select at least 3 members");

    newGroup("Creating New Group...", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
