---
to: generated/<%= endpoint %>/<%= operation %>/<%= type %>-test/<%= type %>.test.js
---
"use strict"
const globalConfig = require("../../../../config/global-config.json");
const globalSetup = require("../../../../src/test-libs/jest.global-setup");
const request = require("request");
const utils = require("../../../../src/test-libs/test-utils");
const testConfig = require("../../../test-config.json")

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




