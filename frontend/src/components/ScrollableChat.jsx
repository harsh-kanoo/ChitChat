import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "@/context/ChatProvider";
import { isLastMessage, isSameSender } from "@/config/ChatLogics";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@chakra-ui/react";
import { isSameSenderMargin } from "@/config/ChatLogics";
import { isSameUser } from "@/config/ChatLogics";
import { useId } from "react";

const ScrollableChat = ({ messages }) => {
  const { user, setSelectedChat, chats, setChats, setUser, selectedChat } =
    ChatState();

  const id = useId();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, idx) => (
          <div key={msg._id} style={{ display: "flex" }}>
            {(isSameSender(messages, msg, idx, user._id) ||
              isLastMessage(messages, idx, user._id)) && (
              <Tooltip
                ids={{ trigger: id }}
                content={
                  <span style={{ color: "white" }}>{msg.sender.username}</span>
                }
                contentProps={{
                  css: { "--tooltip-bg": "black" },
                }}
              >
                <Avatar.Root ids={{ root: id }}>
                  <Avatar.Image src={msg.sender.picture} />
                  <Avatar.Fallback name={msg.sender.username} />
                </Avatar.Root>
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, msg, idx, user._id),
                marginTop: isSameUser(messages, msg, idx, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
