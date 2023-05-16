import { HStack, Text } from "@chakra-ui/react";
import { AiFillGithub } from "react-icons/ai";

const GithubButton = () => {
  return (
    <HStack
      bg="black"
      p={4}
      py={2}
      rounded="md"
      _hover={{ opacity: 0.8 }}
      _active={{ transform: "scale(0.99)", opacity: 0.7 }}
      cursor="pointer"
      transitionDuration="200ms"
      pos="absolute"
      bottom={4}
      right={4}
      onClick={() => window.open("https://github.com/aleemrehmtulla/bluechat")}
    >
      <AiFillGithub color="white" />
      <Text fontWeight={"bold"} color={"white"}>
        View Source
      </Text>
    </HStack>
  );
};

export default GithubButton;
