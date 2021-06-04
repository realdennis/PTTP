#!/usr/bin/env node
import React from "react";
import App from "./app.js";
import { render } from "ink";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import getNode from "./lib/getNode.js";
import getRandomHash from "./lib/getRandomHash.js";

import config from "../config/index.js";

const argv = yargs(hideBin(process.argv))
  .option("join", {
    type: "string",
    description: "The topic(room) id you want to join",
  })
  .option("nickname", {
    type: "string",
    description: "nickname, default is anomymous",
    default: "anomymous",
  }).argv;

const { join, nickname } = argv;
const mode = !!join ? "join" : "create";
const isDev = process.env.NODE_ENV === "dev";

const main = async () => {
  const node = await getNode();
  const topicID = isDev ? config.debug.topic : join ? join : getRandomHash();
  render(
    <App mode={mode} nickname={nickname} ipfsNode={node} topicID={topicID} />
  );
};
main();
