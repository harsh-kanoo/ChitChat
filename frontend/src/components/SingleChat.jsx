import React, { useEffect, useState } from "react";
import { ChatState } from "@/context/ChatProvider";
import { Box, Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { getSender } from "@/config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import { getSenderFull } from "@/config/ChatLogics";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import { Spinner } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { useRef } from "react";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

function SingleChat() {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    setUser,
    selectedChat,
    notifications,
    setNotifications,
    fetchAgain,
    setFetchAgain,
  } = ChatState();

  const lastTypingTimeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8080/allMessage/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
      return;
    } catch (error) {
      const msg = error.response.data.message;
      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
  }, []);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);

        const { data } = await axios.post(
          "http://localhost:8080/sendMessage",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);

        return;
      } catch (error) {
        const msg = error.response.data.message;
        toaster.create({ title: `Error: ${msg}`, type: "error" });
        return;
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator
    if (!socketConnected) return;

    if (!typing) setTyping(true);
    socket.emit("typing", selectedChat._id);

    lastTypingTimeRef.current = new Date().getTime();
    const timerLength = 2000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTimeRef.current;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <Toaster />
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              bg="white"
              border="none"
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                  icon={true}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  height={20}
                  width={50}
                  style={{ marginBottom: 10, marginLeft: 0, marginTop: 10 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Input
              placeholder="Enter your message"
              onKeyDown={sendMessage}
              value={newMessage}
              onChange={typingHandler}
              borderColor="gray.300"
              minHeight="40px"
              mt={2}
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
