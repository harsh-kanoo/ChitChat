import { ChatState } from "@/context/ChatProvider";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import SideDrawer from "@/components/Miscellaneous/SideDrawer";
import MyChats from "@/components/MyChats";
import ChatBox from "@/components/ChatBox";
import "../App.css";

function ChatPage() {
  const { user, setUser } = ChatState();
  const navigate = useNavigate();
  // const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="App">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPage;
