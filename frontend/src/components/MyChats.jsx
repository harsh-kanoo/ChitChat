import { ChatState } from "@/context/ChatProvider";
import React, { useEffect, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import ChatLoading from "./Miscellaneous/ChatLoading";
import { Stack } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { getSender } from "@/config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";

function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    setUser,
    selectedChat,
    fetchAgain,
    setFetchAgain,
  } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:8080/fetchChats",
        config
      );
      setChats(data);
      return;
    } catch (error) {
      const msg = error.response?.data?.message || "Unknown error";
      toaster.create({ title: `Error: ${msg}`, type: "error" });
      return;
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Toaster />
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          color="black"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              alignItems="center"
              gap="2"
              flexWrap="wrap"
              fontSize={{ base: "12px", md: "11px", lg: "17px" }}
              px={{ base: 2, md: 1 }}
              py={{ base: 1, md: 1 }}
              w={{ base: "fit-content", md: "auto" }}
              bg="gray.200"
              _hover={{
                border: "none",
                boxShadow: "none",
              }}
              _focus={{
                border: "none",
                boxShadow: "none",
              }}
              _active={{
                border: "none",
                boxShadow: "none",
              }}
            >
              New Group Chat
              <i className="fa-solid fa-plus" />
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
}

export default MyChats;
