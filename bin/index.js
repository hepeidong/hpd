#!/usr/bin/env node

const minimist = require("minimist");
const { parse } = require("../src/parse-hpd");

const argv = minimist(process.argv.splice(2), {});

parse();
