import {
  addReaction,
  cache,
  delay,
  removeReaction,
  sendMessage,
} from "../../mod.ts";
import { defaultTestOptions, tempData } from "../ws/start_bot.ts";
import { assertEquals, assertExists } from "../deps.ts";

async function ifItFailsBlameWolf(type: "getter" | "raw") {
  const message = await sendMessage(tempData.channelId, "Hello World!");

  // Assertions
  assertExists(message);
  // Delay the execution by 5 seconds to allow MESSAGE_CREATE event to be processed
  await delay(5000);
  // Make sure the message was created.
  if (!cache.messages.has(message.id)) {
    throw new Error(
      "The message seemed to be sent but it was not cached.",
    );
  }

  // Add reactions to the message
  await addReaction(message.channelId, message.id, "❤");
  // Delay the execution by 5 seconds to allow MESSAGE_REACTION_ALL event to be processed
  await delay(5000);

  // Be sure that the message has the reactions
  assertEquals(
    await cache.messages.get(message.id)?.reactions?.length,
    1,
  );

  if (type === "raw") {
    await removeReaction(message.channelId, message.id, "❤");
  } else {
    await message.removeReaction("❤");
  }

  // Delay the execution by 5 seconds to allow MESSAGE_REACTION_REMOVE_ALL event to be processed
  await delay(5000);

  // Check if the reactions has been deleted
  assertEquals(
    await cache.messages.get(message.id)?.reactions,
    undefined,
  );
}

Deno.test({
  name: "[message] remove a reaction",
  async fn() {
    await ifItFailsBlameWolf("raw");
  },
  ...defaultTestOptions,
});

Deno.test({
  name: "[message] message.removeReaction()",
  async fn() {
    await ifItFailsBlameWolf("getter");
  },
  ...defaultTestOptions,
});
