const rg = require("./random-generator");

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

function generatePayloadTemplate(properties) {
  let payloadTemplate = {};
  Object.keys(properties).forEach(key => {
    let type = properties[key].type;
    payloadTemplate[key] = _processProperty(type, properties[key]);
  });

  return payloadTemplate;
}

function _processProperty(type, property) {
  if (type === "object") {
    return generatePayloadTemplate(property.properties);
  } else if (type === "array") {
    let array = [];
    array.push(_processProperty(property.items.type, property.items));
    return array;
  } else if (type === "string") {
    return _generateStringTemplate(property);
  } else {
    return rg[typeTemplate[type]].call(null);
  }
}

function _generateStringTemplate(stringProperty) {
  let stringTemplate = "";
  if (stringProperty.enum) {
    stringTemplate = rg.randomEnum(stringProperty.enum);
  } else if (stringProperty.format) {
    console.log(rg[typeTemplate.string[stringProperty.format]]);
    stringTemplate = rg[typeTemplate.string[stringProperty.format]].call(null);
  } else {
    stringTemplate = rg.randomString();
  }

  return stringTemplate;
}

module.exports = {
  generatePayloadTemplate
};
