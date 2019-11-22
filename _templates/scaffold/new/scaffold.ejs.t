---
to: generated/<%= endpoint %>/<%= operation %>/<%= type %>-test/<%= type %>.test.js
---
"use strict"
const globalConfig = require("../../../../config/global-config.json");
const globalSetup = require("../../../../src/jest.global-setup");
const request = require("request-promise-native");
const utils = require("../../../../src/test-utils");
const testConfig = require("./testConfig.json")

describe("<%= endpoint %> <%= type %> test", () => {
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




