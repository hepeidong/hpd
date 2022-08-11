#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const minimist = require("minimist");

const argv = minimist(process.argv.splice(2), {});

const data = fs.readFileSync(path.join(process.cwd(), 'test.hpd')).toString();
console.log(data, typeof data);