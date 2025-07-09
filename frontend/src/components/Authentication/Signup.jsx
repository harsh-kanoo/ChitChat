import { HStack, VStack } from "@chakra-ui/react";
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

import zxcvbn from "zxcvbn";
import { Spinner } from "@chakra-ui/react";

import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const result = zxcvbn(password).score;

  const postDetails = (picture) => {
    setLoading(true);
    if (picture === undefined) {
      toaster.create({
        title: "Please select an image",
        type: "warning",
      });
      return;
    }
    if (picture.type === "image/jpeg" || picture.type === "image/png") {
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "chit chat");
      data.append("cloud_name", "dw3sh88sb");
      fetch("https://api.cloudinary.com/v1_1/dw3sh88sb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        title: "Please select an image",
        type: "warning",
      });
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!username || !email || !password || !confirmPassword) {
      toaster.create({
        title: "Please enter all the fields",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords do not match",
        type: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:8080/register", {
        username,
        email,
        password,
        picture,
      });
      toaster.create({
        title: "Registration successfull",
        type: "success",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
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
          <Field.Root required id="username">
            <Field.Label>
              username <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="username"
              placeholder="Enter your username"
              maxW={"100%"}
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>

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
            {password ? <PasswordStrengthMeter value={result} w="100px" /> : ""}
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>

          <Field.Root required id="confirm password">
            <Field.Label>
              Confirm Password <Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
              value={confirmPassword}
              maxW={"100%"}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Field.ErrorText>This field is required</Field.ErrorText>
          </Field.Root>

          <Field.Root id="picture">
            <Field.Label>Upload your picture</Field.Label>
            <Input
              name="picture"
              type="file"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              p={1.5}
              maxW={"100%"}
            />
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
              <Spinner size="sm" mr={2} /> Uploading...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </Fieldset.Root>
    </VStack>
  );
}

export default Signup;
