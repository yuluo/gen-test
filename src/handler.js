"use strict";
const jp = require("jsonpath");
const sp = require("swagger-parser");
const shell = require("shelljs");
const rtg = require("./libs/require-test-generator");
const utils = require("./libs/utils");

module.exports.parseSpec = async event => {
  const apiObject = await sp.dereference(event);
  const paths = apiObject.paths;

  shell.rm("-rf", "generated/*");
  shell.mkdir("-p", "generated/node_modules");
  shell.cp("-R", "src/test-libs/", "generated/node_modules");
  shell.cp("-R", "config", "generated/node_modules");

  //need to handle multiple servers
  const testConfig = {
    baseUrl: `http://localhost:8080${apiObject.servers[0].url}`
  };

  utils.writeFile(
    `./generated/node_modules/config/test-config.json`,
    JSON.stringify(testConfig, null, 2)
  );

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
