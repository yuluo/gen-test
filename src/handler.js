"use strict";
const jp = require("jsonpath");
const SwaggerParser = require("swagger-parser");

module.exports.parseSpec = async event => {
  const apiObject = await SwaggerParser.dereference(event);
  const paths = apiObject.paths;

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
          let template = generatePayloadTemplate(jsonSchema.properties);
          console.log(JSON.stringify(template, null, 2));
        }
      }
    });
  });
};


function generatePayloadTemplate(properties) {
  let payloadTemplate = {};
  Object.keys(properties).forEach( key => {
    let type = properties[key].type;
    if (type === "object") {
      payloadTemplate[key] = generatePayloadTemplate(properties[key].properties);
    } else if(type === "array") {
      //handle array here
      //payloadTemplate[key] = generatePayloadTemplate
    } else if (type === "string") {
      payloadTemplate[key] = generateStringTemplate(properties[key])
    } else {
      payloadTemplate[key] = typeTemplate[type];
    }
  })

  return payloadTemplate;
}

function generateStringTemplate(stringProperty) {
  let stringTemplate = "";
  if(stringProperty.enum) {
    stringTemplate = `randomEnum([${stringProperty.enum.toString()}])`
  }
  else if(stringProperty.format) {
    stringTemplate = typeTemplate.string[stringProperty.format];
  } else {
    stringTemplate= "randomString()"
  }

  return stringTemplate;
}

const typeTemplate = {
  "integer": "randomInteger()",
  "number": "randomNumber()",
  "boolean": "randomBoolean()",
  "string": {
    "byte": "randomByte()",
    "binary": "randomBinary()",
    "date-time": "randomDatetime()",
    "date": "randomDate()",
    "password": "randomPassword()"
  }
};


function generateRequireTest() {
  //scaffolding
  //generate positive test

  //generate negative test for-loop
}