import { Heading, Text, VStack } from "@chakra-ui/react";

const ChatHeading = () => {
  return (
    <VStack>
      <Heading size="xl" pb={2} color="black">
        bluechat 💙
      </Heading>
      <Text
        fontSize={{ base: "sm", md: "md" }}
        textAlign={"center"}
        color="gray.500"
      >
        an easy way to query canadian violence stats & bills
      </Text>
    </VStack>
  );
};

export default ChatHeading;
