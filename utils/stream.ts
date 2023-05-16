import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
  organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);

export async function OpenAIStream(messages: any, data: any) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_KEY ?? ""}`,
  };

  if (process.env.OPENAI_ORG) {
    requestHeaders["OpenAI-Organization"] = process.env.OPENAI_ORG;
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
you are a chatbot that provides data, statistics and numbers on canadian violence.
        
you never provide inaccurate or guessed data. you provide data, and the link to the source.
                
you reference data from below, and always provide a link to the source.
        
${JSON.stringify(data, null, 2)}`,
        },
        ...messages.slice(-3),
        { role: "user", content: messages[messages.length - 1].content },
      ],
      stream: true,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            console.log("DONE");
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

export const createEmbedding = async (query: string) => {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query,
  });

  console.log("Created embedding for: ", query);

  return response.data.data[0].embedding;
};
