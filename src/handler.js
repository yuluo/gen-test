"use strict";
const Jsonpath = require("jsonpath");
const SwaggerParser = require("swagger-parser");
const RandomGenerator = require("./libs/random-generator");

module.exports.parseSpec = async event => {
  const apiObject = await SwaggerParser.dereference(event);
  const paths = apiObject.paths;

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(key => {
      if (key === "post" && pathKey === "/pet") {
        const jsonSchema = Jsonpath.query(
          path[key],
          "$['requestBody']['content']['application/json']['schema']"
        )[0];
        console.log(`${key} ${pathKey}`);
        if (jsonSchema) {
          //console.log(JSON.stringify(jsonSchema, null, 2));
          let template = _generatePayloadTemplate(jsonSchema.properties);
          console.log(JSON.stringify(template, null, 2));
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
    return RandomGenerator[typeTemplate[type]].call(null);
  }
}

function _generateStringTemplate(stringProperty) {
  let stringTemplate = "";
  if(stringProperty.enum) {
    stringTemplate = RandomGenerator.randomEnum(stringProperty.enum);
  } else if(stringProperty.format) {
    console.log( RandomGenerator[typeTemplate.string[stringProperty.format]])
    stringTemplate = RandomGenerator[typeTemplate.string[stringProperty.format]].call(null);
  } else {
    stringTemplate= RandomGenerator.randomString();
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


function generateRequireTest(schema) {
  //scaffolding
  //generate positive test

  //generate negative test for-loop
}