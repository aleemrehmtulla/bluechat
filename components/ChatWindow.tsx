import { Center, HStack, Link, Text, VStack } from "@chakra-ui/react";
import Linkify from "react-linkify";
import { useEffect, useRef } from "react";

type ChatWindowProps = {
  messages: {
    content: string;
    role: "user" | "assistant";
  }[];
};

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <VStack
      align="left"
      spacing={5}
      w={{ base: "full", md: "40%" }}
      h={{ base: "25rem", md: "32rem" }}
      py={{ base: 2, md: 8 }}
      overflowY="scroll"
      transitionDuration="0.2s"
      id="chat"
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        scrollbarWidth: "none",
      }}
    >
      {messages &&
        messages.map((message) => (
          <HStack
            w="full"
            key={Date.now() + Math.random()}
            overflowWrap="break-word"
            wordBreak="break-word"
            align="start"
          >
            <Center
              bg={message?.role === "assistant" ? "green.600" : "blue.600"}
              minH="3rem"
              minW="3rem"
              rounded="lg"
            >
              <Text fontSize={{ base: "sm", md: "lg" }}>
                {message?.role === "assistant" ? "🤖" : "🤔"}
              </Text>
            </Center>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <Link href={decoratedHref} key={key} color="blue.500">
                  {decoratedText}
                </Link>
              )}
            >
              <Text
                bg="gray.200"
                p={2}
                rounded="lg"
                fontSize={{ base: "sm", md: "md" }}
              >
                {message?.content}
              </Text>
            </Linkify>
          </HStack>
        ))}
      <div ref={endOfMessagesRef} />
    </VStack>
  );
};

export default ChatWindow;
