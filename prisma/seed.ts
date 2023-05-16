import { PrismaClient } from "@prisma/client";
import fs from "fs";
import data from "./data.json";

import { createEmbedding } from "../utils/stream";

const prisma = new PrismaClient();

async function main() {
  const useCachedEmbeddings = false; // if true, it will only add the pre-embeded data in data-with-embeddings.json
  let dataWithEmbeddings;

  if (useCachedEmbeddings) {
    const rawFile = fs.readFileSync("prisma/data-with-embeddings.json");
    dataWithEmbeddings = JSON.parse(rawFile.toString());
  } else {
    dataWithEmbeddings = [];
  }

  try {
    const dataExample = await prisma.data.findFirst({
      where: {
        title:
          "Trudeau’s Liberals abandon plan to expand banned guns list — but new amendments are coming",
      },
    });
    if (dataExample) {
      console.log("We already have data in the database!");
      return;
    }
  } catch (error) {
    console.error("Error finding any data in the database");
    throw error;
  }

  for (const record of (data as any).data) {
    let embedding;

    if (useCachedEmbeddings) {
      const cachedRecord = dataWithEmbeddings.find(
        (item: any) => item.title === record.title
      );
      if (cachedRecord) {
        embedding = cachedRecord.embeddings;
      }
    } else {
      embedding = await createEmbedding(`${record.content}`);
      await new Promise((r) => setTimeout(r, 500)); // prevents openai blocking us for too many requests
    }

    const createdData = await prisma.data.create({
      data: record,
    });

    await prisma.$executeRaw`
          UPDATE data
          SET embedding = ${embedding}::vector
          WHERE id = ${createdData.id}
      `;

    console.log(`Added ${createdData.title}`);

    if (!useCachedEmbeddings) {
      dataWithEmbeddings.push({
        ...record,
        embeddings: embedding,
      });
    }
  }

  console.log("added all data! woohoo :p");

  if (!useCachedEmbeddings) {
    // if we made new embeddings, update the cached file
    fs.writeFileSync(
      "prisma/data-with-embeddings.json",
      JSON.stringify(dataWithEmbeddings, null, 2)
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
