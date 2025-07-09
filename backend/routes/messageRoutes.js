const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const Message = require("../models/messageSchema");
const Chat = require("../models/chatSchema");

router.post("/sendMessage", authenticateUser, async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res
        .status(400)
        .json({ message: "Invalid data passed into request" });
    }

    let newMessage = { content, chat: chatId, sender: req.user._id };
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "username picture");
    message = await message.populate({
      path: "chat",
      populate: {
        path: "users",
        select: "username picture",
      },
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/allMessage/:chatId", authenticateUser, async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username picture email")
      .populate("chat");

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
