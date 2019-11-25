---
to: generated/<%= endpoint %>/<%= operation %>/<%= type %>-test/<%= type %>.test.js
---
"use strict"
const globalConfig = require("config/global-config.json");
const globalSetup = require("test-libs/jest.global-setup");
const utils = require("test-libs/test-utils");
const testConfig = require("config/test-config.json");
const request = require("request");

describe("<%= operation %> <%= endpoint %> <%= type %> test", () => {
  let token = "";
  let options = {};

  beforeAll(async () => {
    globalSetup.extendExpect();
    token = await utils.login();
  });

  beforeEach(() => {
    options = {
      method: "<%= operation %>",
      uri: testConfig.baseUrl + "<%= endpoint %>",
      auth: {
        bearer: token
      },
      headers: {
        "Content-Type": "application/json"
      },
      json: true
    };
  });

  //test cases


});




