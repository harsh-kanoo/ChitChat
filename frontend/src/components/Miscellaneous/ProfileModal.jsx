import React from "react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

function ProfileModal({ user, icon }) {
  return (
    <>
      <Dialog.Root size="lg" isCentered>
        <Dialog.Trigger asChild>
          {!icon ? (
            <Button
              variant="ghost"
              size="sm"
              bg="white"
              color="black"
              border="none"
              boxShadow="none"
              _hover={{ bg: "gray.200" }}
              _focus={{ outline: "none", boxShadow: "none" }}
            >
              My Profile
            </Button>
          ) : (
            <Button
              _hover={{ bg: "gray.200" }}
              bg="white"
              border="none"
              w={15}
              _focus={{ outline: "none", boxShadow: "none" }}
            >
              <i class="fa-solid fa-eye"></i>{" "}
            </Button>
          )}
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content h="45vh">
              <Dialog.Header
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                mb="4vh"
              >
                <Dialog.Title
                  fontSize="3rem"
                  fontFamily="Work sans"
                  display="flex"
                  justifyContent="center"
                >
                  {user.username}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
              >
                <Image
                  borderRadius="full"
                  boxSize="20vh"
                  src={user.picture}
                  alt={user.username}
                />
                <Text
                  fontSize={{ base: "1.5rem", md: "2rem" }}
                  fontFamily="Work sans"
                >
                  Email: {user.email}
                </Text>
              </Dialog.Body>

              <Dialog.CloseTrigger asChild border="none">
                <CloseButton size="sm" border="none" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default ProfileModal;
