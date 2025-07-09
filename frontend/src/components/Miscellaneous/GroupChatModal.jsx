import React, { useState } from "react";
import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { ChatState } from "@/context/ChatProvider";
import {
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { Navigate, useNavigate } from "react-router-dom";

function GroupChatModal({ children }) {
  const { user, setSelectedChat, chats, setChats, setUser, selectedChat } =
    ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (searchItem) => {
    setSearch(searchItem);
    if (!searchItem) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8080/search?search=${searchItem}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      const msg = error.response.data.message;

      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchResult([]);
    setGroupMembers([]);
    setGroupChatName("");
    setSearch("");
  };

  const handleSubmit = async () => {
    if (!groupChatName || !groupMembers) {
      toaster.create({ title: "Please all the fields", type: "warning" });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:8080/createGroupChat",
        {
          chatName: groupChatName,
          users: JSON.stringify(groupMembers.map((member) => member._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setLoading(false);

      toaster.create({ title: "New group chat created", type: "success" });
      handleClose();

      return;
    } catch (error) {
      const msg = error.response.data.message;

      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
    }
  };

  const handleDelete = (userToDelete) => {
    if (groupMembers.includes(userToDelete)) {
      setGroupMembers(
        groupMembers.filter((member) => member._id !== userToDelete._id)
      );
    }
    return;
  };

  const handleGroup = (userToAdd) => {
    if (groupMembers.includes(userToAdd)) {
      toaster.create({ title: "user already added", type: "warning" });
      return;
    }

    setGroupMembers([...groupMembers, userToAdd]);
    return;
  };

  return (
    <>
      <Toaster />
      <Dialog.Root placement="center" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
              >
                <Dialog.Title>Create Group Chat</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDir="column" alignItems="center">
                <Fieldset.Root>
                  <Fieldset.Content>
                    <Field.Root required>
                      <Field.Label>
                        Group Name <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        name="chatName"
                        placeholder="Chat Name"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                      <Field.ErrorText>This field is required</Field.ErrorText>
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label>
                        Group Members <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        name="users"
                        placeholder="Add Users"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <Field.ErrorText>This field is required</Field.ErrorText>
                    </Field.Root>

                    <Box w="100%" display="flex" flexWrap="wrap">
                      {groupMembers?.map((member) => (
                        <UserBadgeItem
                          key={member._id}
                          user={member}
                          handleFunction={() => handleDelete(member)}
                        />
                      ))}
                    </Box>
                    {loading ? (
                      <>
                        <Spinner size="sm" mr={2} />
                      </>
                    ) : (
                      searchResult
                        ?.slice(0, 4)
                        .map((member) => (
                          <UserListItem
                            key={member._id}
                            user={member}
                            handleFunction={() => handleGroup(member)}
                          />
                        ))
                    )}
                  </Fieldset.Content>

                  <Button
                    type="submit"
                    alignSelf="center"
                    onClick={handleSubmit}
                    color="white"
                  >
                    Create Chat
                  </Button>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={handleClose} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default GroupChatModal;
