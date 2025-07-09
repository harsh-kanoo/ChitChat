import React, { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { Box, Input, Spinner, Text } from "@chakra-ui/react";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { GoBellFill } from "react-icons/go";
import { FaChevronDown } from "react-icons/fa";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "@/context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { Navigate, useNavigate } from "react-router-dom";
import { CloseButton, Drawer, For } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "@/config/ChatLogics";

function SideDrawer() {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [chatLoading, setChatLoading] = useState();
  const [loading, setLoading] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    fetchAgain,
    setFetchAgain,
  } = ChatState();
  const navigate = useNavigate();
  const placement = "start";

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Enter user",
        type: "warning",
      });
      return;
    } else {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `http://localhost:8080/search?search=${search}`,
          config
        );
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        const msg = error.response.data.message;

        toaster.create({ title: `Error: ${msg}`, type: "error" });
        setLoading(false);
      }
    }
  };

  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8080/accessChat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setChatLoading(false);
    } catch (error) {
      const msg = error.response.data.message;

      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setChatLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat();
    navigate("/");
  };

  const handleDrawerClose = () => {
    setSearch("");
    setSearchResult([]);
  };

  return (
    <>
      <Toaster />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Drawer.Root placement="start">
          <Tooltip
            showArrow
            content={
              <span style={{ color: "white" }}>Search users to chat</span>
            }
            contentProps={{
              css: { "--tooltip-bg": "black" },
              style: { zIndex: 10000 },
            }}
          >
            <Drawer.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                bg="white"
                color="black"
                border="none"
                _hover={{
                  bg: "gray.100",
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
                <i className="fa-solid fa-magnifying-glass"></i>
                <Text display={{ base: "none", md: "flex" }} px={4}>
                  Search User
                </Text>
              </Button>
            </Drawer.Trigger>
          </Tooltip>

          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content
                roundedTop={placement === "bottom" ? "l3" : undefined}
                roundedBottom={placement === "top" ? "l3" : undefined}
              >
                <Drawer.Header>
                  <Drawer.Title>Search Users</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <Box display="flex" pb={2}>
                    <Input
                      placeholder="Search by name or email"
                      mr={2}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                      onClick={handleSearch}
                      bg="gray.500"
                      color="gray.200"
                      border="none"
                    >
                      Go
                    </Button>
                  </Box>
                  {loading ? (
                    <ChatLoading />
                  ) : (
                    searchResult?.map((result) => (
                      <UserListItem
                        key={result._id}
                        user={result}
                        handleFunction={() => accessChat(result._id)}
                      />
                    ))
                  )}
                  {chatLoading && <Spinner size="sm" mr={2} />}
                </Drawer.Body>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={handleDrawerClose} />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
        <Text fontSize="2xl" fontFamily="Work sans" color="black">
          Chit Chat
        </Text>
        <div style={{ display: "flex", gap: "0.1vw" }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                bg="white"
                sx={{
                  border: "none",
                  boxShadow: "none",
                }}
                _hover={{
                  bg: "gray.100",
                  border: "none",
                }}
                _focus={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                }}
                _active={{
                  border: "none",
                  boxShadow: "none",
                }}
              >
                {/* <NotificationBadge
                  count={notifications.length}
                  effect={Effect.SCALE}
                /> */}
                {/* <GoBellFill color="black">
                  <NotificationBadge
                    count={notifications.length}
                    effect={Effect.SCALE}
                  />
                </GoBellFill> */}
                {notifications.length ? (
                  <GoBellFill color="red"></GoBellFill>
                ) : (
                  <GoBellFill color="black"></GoBellFill>
                )}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {!notifications.length ? (
                    <Menu.Item>No new messages</Menu.Item>
                  ) : (
                    notifications.map((notif) => (
                      <Menu.Item
                        key={notif._id}
                        cursor="pointer"
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotifications(
                            notifications.filter((n) => n !== notif)
                          );
                        }}
                      >
                        {notif.chat.isGroupChat
                          ? `New message in ${notif.chat.chatName}`
                          : `New message from ${getSender(
                              user,
                              notif.chat.users
                            )}`}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                bg="white"
                sx={{
                  border: "none",
                  boxShadow: "none",
                }}
                _hover={{
                  bg: "gray.100",
                  border: "none",
                }}
                _focus={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                }}
                _active={{
                  border: "none",
                  boxShadow: "none",
                }}
              >
                <Avatar.Root
                  size="xs"
                  cursor="pointer"
                  border="none"
                  boxShadow="none"
                >
                  <Avatar.Fallback name={user.username} />
                  <Avatar.Image src={user.picture} />
                </Avatar.Root>
                <FaChevronDown color="black" />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content bg="white" color="black">
                  <ProfileModal user={user} icon={false}>
                    <Menu.Item></Menu.Item>
                  </ProfileModal>
                  <Menu.Item
                    color="fg.error"
                    value="logout"
                    _hover={{ bg: "gray.200" }}
                    justifyContent="center"
                    onClick={logoutHandler}
                  >
                    <Text fontWeight="bold">Log out</Text>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
    </>
  );
}

export default SideDrawer;
