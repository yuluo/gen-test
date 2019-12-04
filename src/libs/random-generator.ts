import * as randomstring from "randomstring";

export function randomBinary() {
  return randomstring.generate({
    charset: "01"
  });
}

export function randomBoolean() {
  return randomstring.generate().length % 2 === 0;
}

export function randomByte() {
  return randomstring.generate({
    charset: "hex"
  });
}

export function randomDatetime() {
  return new Date().toISOString();
}

export function randomDate() {
  return new Date().toLocaleDateString();
}

export function randomEnum(enums) {
  let randomIndex = randomInteger(0, enums.length);
  return enums[randomIndex];
}

export function randomInteger(min = 0, max = 10000) {
  const minFloor = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(randomNumber(minFloor, maxFloor)) + minFloor;
}

export function randomNumber(min = 0, max = 10000) {
  return Math.random() * (max - min) + min;
}

export function randomString() {
  return randomstring.generate();
}
