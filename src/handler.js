"use strict";
const jp = require("jsonpath");
const sp = require("swagger-parser");
const shell = require("shelljs");
const rtg = require("./libs/require-test-generator");
const utils = require("./libs/utils");

module.exports.parseSpec = async event => {
  const apiObject = await sp.dereference(event);
  const paths = apiObject.paths;

  _setupWorkspace();
  _createTestConfig(event, apiObject);

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(key => {
      if (key === "post") {
        const jsonSchema = jp.query(
          path[key],
          "$['requestBody']['content']['application/json']['schema']"
        )[0];
        console.log(`${key} ${pathKey}`);
        if (jsonSchema) {
          //console.log(JSON.stringify(jsonSchema, null, 2));
          //let template = _generatePayloadTemplate(jsonSchema.properties);
          rtg.generateTest(pathKey, key, jsonSchema);
        }
      }
    });
  });
};


function _setupWorkspace() {
  shell.rm("-rf", "generated/");
  shell.mkdir("-p", "generated/node_modules");
  shell.cp("-R", "src/test-libs/", "generated/node_modules");
  shell.cp("-R", "config", "generated/node_modules");
}

function _createTestConfig(url, apiObject) {
  const urlArray = url.split('/');
  const rootUrl = urlArray.slice(0, urlArray.length - 1).join('/');
  const baseUrls = apiObject.servers.map( server => {
    var absolutePattern = /^https?:\/\//i;
    if(absolutePattern.test(server.url)) {
      return server.url;
    } else {
      return rootUrl + server.url;
    }
  })

  const testConfig = {
    baseUrl: baseUrls[0]
  };

  utils.writeFile(
    `./generated/node_modules/config/test-config.json`,
    JSON.stringify(testConfig, null, 2)
  );
}