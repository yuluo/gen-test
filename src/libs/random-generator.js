const RandomString = require("randomstring");

function randomBinary() {
    return RandomString.generate({
        charset: '01'
    });
}

function randomBoolean() {
    return RandomString.generate().length % 2 === 0;
}

function randomByte() {
    return RandomString.generate({
        charset: 'hex'
    });
}

function randomDatetime() {
    return new Date().toString();
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
    return RandomString.generate();
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
}