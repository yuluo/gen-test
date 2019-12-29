---
to: generated/<%= endpoint %>/<%= operation %>/api.test.js
---
"use strict"
const globalConfig = require("config/global-config.json");
const globalSetup = require("test-libs/jest.global-setup");
const utils = require("test-libs/test-utils");
const testConfig = require("config/test-config.json");
const preConfigData = require("config/pre-config-data.json");
const request = require("request");
const queryString = require("query-string");
const parameters = require("./parameters.json");

describe("<%= operation %> <%= endpoint %> test", () => {
  let options = {};

  beforeAll(async () => {
    globalSetup.extendExpect();
  });

  beforeEach(() => {
    options = {
      method: "<%= operation %>",
      uri: testConfig.baseUrl + "<%= endpoint %>",
      json: true,
      headers: {}
    };

    options.headers["Content-Type"] = "<%= mediatype %>";
    Object.keys(preConfigData.headers).forEach(header => {
      options.headers[header] = preConfigData.headers[header];
    });
  });

  //test cases


});




