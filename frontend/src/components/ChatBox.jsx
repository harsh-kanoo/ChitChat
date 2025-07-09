import React from "react";
import { ChatState } from "@/context/ChatProvider";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

function ChatBox() {
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
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      color="black"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
