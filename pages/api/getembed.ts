import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { createEmbedding } from "@/utils/stream";

const prisma = new PrismaClient();

export default async function getvector(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages } = req.body;

  const query = messages[messages.length - 1].content;

  const embedding = await createEmbedding(query);
  const vectorQuery = `[${embedding.join(",")}]`;

  const result = await prisma.$queryRaw`
    SELECT
      id,
      "content",
      "title",
      "link",
      1 - (embedding <=> ${vectorQuery}::vector) as similarity
    FROM data
    where 1 - (embedding <=> ${vectorQuery}::vector) > .5
    ORDER BY  similarity DESC
    LIMIT 3;
  `;

  res.status(200).json(result);
}
