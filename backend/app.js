const express = require("express");
const chats = require("./seed");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");

const socketio = require("socket.io");

dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

//database connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.dbURL) // returns a promise
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("error in DB", err.message);
  });

app.get("/", (req, res) => {
  res.send("chat app");
});

// using all the routes
app.use(userRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
});

const io = socketio(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:5173" },
});

// emit -> send that message
// in -> inside the users room

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room : " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
