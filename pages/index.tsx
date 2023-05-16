import { useState } from "react";

import { VStack } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import ChatWindow from "@/components/ChatWindow";
import GithubButton from "@/components/GithubButton";
import SendBox from "@/components/SendBox";
import ChatHeading from "@/components/ChatHeading";

type Message = {
  content: string;
  role: "user" | "assistant";
};

const BlueChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  return (
    <>
      <NextSeo
        title="Bluechat"
        description="an easy way to query canadian violence stats & bills"
      />
      <VStack
        h={{
          base: "calc(100vh - 2rem)",
          md: "100vh",
        }}
        p={8}
        pt={{ base: 12, md: 32 }}
      >
        <ChatHeading />

        <ChatWindow messages={messages} />

        <SendBox
          message={message}
          setMessage={setMessage}
          messages={messages}
          setMessages={setMessages}
        />

        <GithubButton />
      </VStack>
    </>
  );
};

export default BlueChat;
