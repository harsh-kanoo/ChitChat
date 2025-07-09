import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/react";

function UserBadgeItem({ user, handleFunction }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={13}
      colorScheme="purple"
      bg="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.username}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <CloseButton
        variant="ghost"
        size="2xs"
        ml={1}
        bg="purple"
        border="none"
      />
    </Box>
  );
}

export default UserBadgeItem;
