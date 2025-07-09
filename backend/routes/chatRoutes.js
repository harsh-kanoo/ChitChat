const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const Chat = require("../models/chatSchema");
const User = require("../models/userSchema");

// creating or fetching a one on one chat
router.post("/accessChat", authenticateUser, async (req, res) => {
  const { userId } = req.body; // loggedin user will return the id of the other user (jiske saath baat karni hai)

  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId param not sent with request" });
  }

  // finding whether chat with that user is already present
  let prevChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password") // Replaces each ObjectId in the users array with the full user document from the User collection.
    .populate("latestMessage");

  prevChat = await User.populate(prevChat, {
    path: "latestMessage.sender",
    select: "username email picture",
  });

  if (prevChat) {
    return res.status(200).send(prevChat);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).send(FullChat);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
});

// query all the chats for the logged in user
router.get("/fetchChats", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    let chats = await Chat.find({ users: userId })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "username email picture",
    });
    return res.status(200).send(chats);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/createGroupChat", authenticateUser, async (req, res) => {
  let { chatName, users } = req.body;

  if (!chatName || !users) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  users = JSON.parse(users);

  if (users.length < 2) {
    return res.status(400).json({
      message: "More than 2 users are required to create a group chat",
    });
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      isGroupChat: true,
      users,
      chatName,
      groupAdmin: req.user._id,
    });

    let fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send(fullGroupChat);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/renameGroup", authenticateUser, async (req, res) => {
  const { groupId, chatName } = req.body;

  if (!groupId || !chatName) {
    return req.status(400).json({ message: "Error" });
  }

  let updatedChat = await Chat.findByIdAndUpdate(
    groupId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(400).json({ message: "Chat not found" });
  }
  return res.status(200).send(updatedChat);
});

router.put("/addToGroup", authenticateUser, async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ message: "Error" });
    }

    let updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    return res.status(200).send(updatedChat);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/removeFromGroup", authenticateUser, async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      return res.status(400).json({ message: "Error" });
    }

    let updatedChat = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    return res.status(200).send(updatedChat);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
