import { Avatar } from "@chakra-ui/react";
import { Text, Box } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar.Root size="xs" mr="10px">
        <Avatar.Fallback name={user.username} />
        <Avatar.Image src={user.picture} />
      </Avatar.Root>
      <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
