import { HStack, Spinner, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";

import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "@/context/ChatProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please enter all the fields",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      toaster.create({
        title: "Log In successfull",
        type: "success",
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      setTimeout(() => {
        navigate("/chats");
      }, 500);
      return;
    } catch (error) {
      const msg = error.response.data.message; // error message from backend

      toaster.create({ title: `Error: ${msg}`, type: "error" });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <Toaster />
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field.Root required id="email">
            <Field.Label>
              Email address <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              placeholder="me@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxW={"100%"}
            />
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>

          <Field.Root required id="password">
            <Field.Label>
              Password <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              value={password}
              maxW={"100%"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          alignSelf="flex-start"
          bg="blue.400"
          w="100%"
          onClick={submitHandler}
        >
          {loading ? (
            <>
              <Spinner size="sm" mr={2} />
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </Fieldset.Root>
    </VStack>
  );
}

export default Login;
