"use strict";
const jp = require("jsonpath");
const sp = require("swagger-parser");
const shell = require("shelljs");
const rtg = require("./libs/require-test-generator");

module.exports.parseSpec = async event => {
  const apiObject = await sp.dereference(event);
  const paths = apiObject.paths;

  shell.rm("-rf", "generated/*");

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(key => {
      if (key === "post" && pathKey === "/pet") {
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
