export const getSender = (loggedUser, users) => {
  if (!users || users.length < 2 || !loggedUser) return;
  return users[0]._id === loggedUser._id
    ? users[1].username
    : users[0].username;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, msg, idx, userId) => {
  if (!messages || messages.length === 0) return false;

  return (
    idx < messages.length - 1 &&
    messages[idx + 1]?.sender?._id !== msg.sender._id &&
    msg.sender._id !== userId
  );
};

export const isLastMessage = (messages, idx, userId) => {
  if (!messages || messages.length === 0) return false;

  return idx === messages.length - 1 && messages[idx]?.sender?._id !== userId;
};

export const isSameSenderMargin = (messages, msg, idx, userId) => {
  if (
    idx < messages.length - 1 &&
    messages[idx + 1].sender._id === msg.sender._id &&
    messages[idx].sender._id !== userId
  )
    return 33;
  else if (
    (idx < messages.length - 1 &&
      messages[idx + 1].sender._id !== msg.sender._id &&
      messages[idx].sender._id !== userId) ||
    (idx === messages.length - 1 && messages[idx].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, msg, idx) => {
  return idx > 0 && messages[idx - 1].sender._id === msg.sender._id;
};
