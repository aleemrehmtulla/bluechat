import { OpenAIStream } from "@/utils/stream";

export const config = {
  runtime: "edge",
};

const BASE_URL = process.env.BASE_URL;

const chat = async (req: Request): Promise<Response> => {
  const body = await req.json();
  const { messages } = body;

  // edge runtime doesn't support prisma, so had to abstract this out
  const embedding = await fetch(`${BASE_URL}/api/getembed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  const result = await embedding.json();

  const stream = await OpenAIStream(messages, result);
  return new Response(stream);
};

export default chat;
