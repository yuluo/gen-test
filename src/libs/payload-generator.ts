import * as randomRenerator from "./random-generator"

const typeTemplate = {
  integer: "randomInteger",
  number: "randomNumber",
  boolean: "randomBoolean",
  string: {
    byte: "randomByte",
    binary: "randomBinary",
    "date-time": "randomDatetime",
    date: "randomDate",
    password: "randomString"
  }
};

//TODO: add wrapper function
export function generatePayloadTemplate(properties) {
  let payloadTemplate = {};
  Object.keys(properties).forEach(key => {
    let type = properties[key].type;
    payloadTemplate[key] = processProperty(type, properties[key]);
  });

  return payloadTemplate;
}

export function processProperty(type, property) {
  if (type === "object") {
    return generatePayloadTemplate(property.properties);
  } else if (type === "array") {
    let array = [];
    array.push(processProperty(property.items.type, property.items));
    return array;
  } else if (type === "string") {
    return _generateStringTemplate(property);
  } else {
    return randomRenerator[typeTemplate[type]].call(null);
  }
}

function _generateStringTemplate(stringProperty) {
  let stringTemplate = "";
  if (stringProperty.enum) {
    stringTemplate = randomRenerator.randomEnum(stringProperty.enum);
  } else if (stringProperty.format) {
    console.log(randomRenerator[typeTemplate.string[stringProperty.format]]);
    stringTemplate = randomRenerator[typeTemplate.string[stringProperty.format]].call(null);
  } else {
    stringTemplate = randomRenerator.randomString();
  }

  return stringTemplate;
}

