const rs = require("randomstring");

function randomBinary() {
  return rs.generate({
    charset: "01"
  });
}

function randomBoolean() {
  return rs.generate().length % 2 === 0;
}

function randomByte() {
  return rs.generate({
    charset: "hex"
  });
}

function randomDatetime() {
  return new Date().toISOString();
}

function randomDate() {
  return new Date().toLocaleDateString();
}

function randomEnum(enums) {
  let randomIndex = randomInteger(0, enums.length);
  return enums[randomIndex];
}

function randomInteger(min = 0, max = 10000) {
  const minFloor = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(randomNumber(minFloor, maxFloor)) + minFloor;
}

function randomNumber(min = 0, max = 10000) {
  return Math.random() * (max - min) + min;
}

function randomString() {
  return rs.generate();
}

module.exports = {
  randomBinary,
  randomBoolean,
  randomByte,
  randomDatetime,
  randomDate,
  randomEnum,
  randomInteger,
  randomNumber,
  randomString
};
