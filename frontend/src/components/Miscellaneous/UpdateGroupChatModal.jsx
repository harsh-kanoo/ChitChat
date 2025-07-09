import React, { useState } from "react";
import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { ChatState } from "@/context/ChatProvider";
import { Toaster, toaster } from "@/components/ui/toaster";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { Field, Fieldset, Input } from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import { Spinner } from "@chakra-ui/react";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { user, setSelectedChat, chats, setChats, setUser, selectedChat } =
    ChatState();

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRemove = async (userToRemove) => {
    if (!userToRemove) return;
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toaster.create({
        title: "Only admins can remove someone",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:8080/removeFromGroup",
        { groupId: selectedChat._id, userId: userToRemove._id },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setLoading(false);
      setFetchAgain(!fetchAgain);
      fetchMessages();

      toaster.create({
        title:
          userToRemove._id !== user._id
            ? `${userToRemove.username} removed from the group`
            : "You left the group",
        type: "success",
      });

      return;
    } catch (error) {
      const msg = error.response.data.message;
      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
      return;
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toaster.create({ title: "Please enter a group name", type: "warning" });
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:8080/renameGroup",
        {
          groupId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain); // so that all the chats again get fetched by useEffect

      toaster.create({ title: "Group name updated", type: "success" });
      return;
    } catch (error) {
      const msg = error.response.data.message;
      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setRenameLoading(false);
      return;
    }
  };

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

  const handleAddUser = async (userToAdd) => {
    if (!userToAdd) return;
    if (selectedChat.users.find((member) => member._id === userToAdd._id)) {
      toaster.create({ title: "User already in the group", type: "warning" });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({ title: "Only admins can add someone", type: "warning" });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:8080/addToGroup",
        {
          groupId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      const msg = error.response.data.message;

      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog.Root placement="center" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <Button
            _hover={{ bg: "gray.200" }}
            bg="white"
            border="none"
            w={15}
            _focus={{ outline: "none", boxShadow: "none" }}
          >
            <i class="fa-solid fa-eye"></i>{" "}
          </Button>
        </Dialog.Trigger>
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
                <Dialog.Title>{selectedChat.chatName}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                  {selectedChat.users.map((member) => (
                    <UserBadgeItem
                      key={member._id}
                      user={member}
                      handleFunction={() => handleRemove(member)}
                    />
                  ))}
                </Box>

                <Fieldset.Root>
                  <Fieldset.Content>
                    <Field.Root required>
                      <Field.Label>
                        New Group Name <Field.RequiredIndicator />
                      </Field.Label>
                      <Box display="flex" w="100%">
                        <Input
                          name="chatName"
                          placeholder="Chat Name"
                          value={groupChatName}
                          onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                          type="submit"
                          alignSelf="center"
                          onClick={handleRename}
                          color="white"
                          border="none"
                          bg="teal"
                        >
                          Update Chat
                        </Button>
                      </Box>
                      <Field.ErrorText>This field is required</Field.ErrorText>
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>
                        Add Group Members <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        name="users"
                        placeholder="Add Users"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </Field.Root>
                    {loading ? (
                      <>
                        <Spinner size="lg" mr={2} />
                      </>
                    ) : (
                      searchResult
                        ?.slice(0, 4)
                        .map((member) => (
                          <UserListItem
                            key={member._id}
                            user={member}
                            handleFunction={() => handleAddUser(member)}
                          />
                        ))
                    )}
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={() => handleRemove(user)}
                  bg="red"
                  color="white"
                  border="none"
                  w={100}
                  alignSelf="center"
                >
                  Leave Group
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default UpdateGroupChatModal;
