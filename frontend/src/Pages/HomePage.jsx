import React, { useEffect } from "react";
import "../App.css";
import { Box, Container, Tabs, Text } from "@chakra-ui/react";
import Login from "@/components/Authentication/Login";
import Signup from "@/components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="App">
      <Container maxW="xl" centerContent>
        <Box
          d="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text
            fontSize="4xl"
            fontFamily="Work sans"
            color="black"
            textAlign="center"
          >
            Chit Chat
          </Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs.Root variant="soft-rounded" defaultValue="tab-1" fitted>
            <Tabs.List>
              <Tabs.Trigger
                value="tab-1"
                _selected={{ bg: "blue.400", color: "white" }}
                _hover={{ bg: "blue.200" }}
                bg="white"
                color="black"
                m="2px"
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tab-2"
                _selected={{ bg: "blue.400", color: "white" }}
                _hover={{ bg: "blue.200" }}
                bg="white"
                color="black"
              >
                Signup
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab-1" color="black">
              <Login />
            </Tabs.Content>
            <Tabs.Content value="tab-2" color="black">
              <Signup />
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
