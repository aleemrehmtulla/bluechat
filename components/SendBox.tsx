import { Box, HStack, Input, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";

type Message = {
  content: string;
  role: "user" | "assistant";
};

type SendBoxProps = {
  message: string;
  setMessage: (message: string) => void;
  messages: Message[];
  setMessages: (
    messages: Message[] | ((prevMessages: Message[]) => Message[])
  ) => void;
};

const SendBox = ({
  message,
  setMessage,
  messages,
  setMessages,
}: SendBoxProps) => {
  const toast = useToast();
  const getMessage = async (message: string) => {
    setMessages((messages: Message[]) => [
      ...messages,
      {
        content: message,
        role: "user",
      },
    ]);
    if (!message || message.length === 0)
      return toast({ title: "Please enter a message!", status: "error" });

    const messageArray = messages
      ? [...messages, { content: message, role: "user" }]
      : [{ content: message, role: "user" }];

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messageArray,
      }),
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = response.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";
    let msgNum = 0;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      if (msgNum > 2) {
        setMessage("");
      }

      if (msgNum === 0) {
        setMessages((messages: Message[]) => [
          ...messages,
          { content: lastMessage, role: "assistant" },
        ]);
        msgNum++;
      } else {
        setMessages((messages: Message[]) => [
          ...messages.slice(0, messages.length - 1),
          { content: lastMessage, role: "assistant" },
        ]);
        msgNum++;
      }
    }

    setTimeout(() => {
      const chat = document.getElementById("chat");
      chat && chat.scrollTo({ top: chat.scrollHeight, behavior: "auto" });
    });
  };

  useEffect(() => {
    const input = document.getElementById("chatinput");
    input && input.focus();
  }, []);
  return (
    <HStack
      w={{ base: "full", md: "40%" }}
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={{ base: 1, md: 2 }}
      py={2}
      px={3}
      justify="space-between"
    >
      <Input
        id="chatinput"
        fontSize={{
          base: "md",
          md: "lg",
        }}
        focusBorderColor="transparent"
        border="none"
        p={0}
        pl="0.5"
        _focus={{
          outline: "none",
        }}
        h="fit"
        w="full"
        placeholder=""
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await getMessage(e.currentTarget.value);
        }}
      />
      <Box
        as={AiOutlineSend}
        size="1.5rem"
        cursor="pointer"
        transitionDuration="0.2s"
        onClick={async () => {
          await getMessage(message);
        }}
        _hover={{
          color: "gray.500",
        }}
      />
    </HStack>
  );
};

export default SendBox;
