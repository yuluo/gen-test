"use strict";
const jp = require("jsonpath");
const sp = require("swagger-parser");
const rg = require("./libs/random-generator");
const shell = require('shelljs');
const fs = require('fs')

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
          _generateRequireTest(pathKey, key, jsonSchema);
        }
      }
    });
  });
};


function _generatePayloadTemplate(properties) {
  let payloadTemplate = {};
  Object.keys(properties).forEach( key => {
    let type = properties[key].type;
    payloadTemplate[key] = _processProperty(type, properties[key]);
  })

  return payloadTemplate;
}

function _processProperty(type, property) {
  if (type === "object") {
    return _generatePayloadTemplate(property.properties);
  } else if(type === "array") {
    let array = [];
    array.push(_processProperty(property.items.type, property.items));
    return array;
  } else if (type === "string") {
    return _generateStringTemplate(property)
  } else {
    return rg[typeTemplate[type]].call(null);
  }
}

function _generateStringTemplate(stringProperty) {
  let stringTemplate = "";
  if(stringProperty.enum) {
    stringTemplate = rg.randomEnum(stringProperty.enum);
  } else if(stringProperty.format) {
    console.log( rg[typeTemplate.string[stringProperty.format]])
    stringTemplate = rg[typeTemplate.string[stringProperty.format]].call(null);
  } else {
    stringTemplate= rg.randomString();
  }

  return stringTemplate;
}

const typeTemplate = {
  "integer": "randomInteger",
  "number": "randomNumber",
  "boolean": "randomBoolean",
  "string": {
    "byte": "randomByte",
    "binary": "randomBinary",
    "date-time": "randomDatetime",
    "date": "randomDate",
    "password": "randomString"
  }
};


function _generateRequireTest(endpoint, operation, schema) {
  //scaffolding
  const scaffoldingCmd = `"./node_modules/.bin/hygen" scaffold new --endpoint ${endpoint} --operation ${operation}  --type require`;
  shell.exec(scaffoldingCmd);

  //generate positive test
  let template = _generatePayloadTemplate(schema.properties);
  writeFile(`./generated/${endpoint}/${operation}/require-test/payload-1.json`, JSON.stringify(template, null, 2));
  const testCaseCmd = `"./node_modules/.bin/hygen" require-test new --endpoint ${endpoint} --operation ${operation}  --name positive --datafile payload-1.json --codes successCodes`;
  shell.exec(testCaseCmd);

  //generate negative test for-loop
}

function writeFile(name, content) {
  fs.writeFile(name, content, 'ascii', (err) => {
    if (err) {
      throw err;
    }
  });
}