require("dotenv").config();

import { Client } from "discord.js";

import { getArguments } from "./arguments";

import {
  handleBoxSearch,
  handlePendingBoxRequest,
} from "./Handlers/box-handler";

import { helpHandler } from "./Handlers/help-handler";

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  // Boite
  if (msg.content.startsWith("!boite")) {
    let args = getArguments("!boite ", msg.content);
    if (args.length >= 1) {
      handleBoxSearch(msg, args[0]);
    } else {
      msg.reply("!boite <Nom de la boite>");
    }
  } else if (msg.content.toLowerCase().startsWith("!dflyff")) {
    helpHandler(msg);
  } else {
    handlePendingBoxRequest(msg);
  }
});

client.login(process.env.BOT_TOKEN);
