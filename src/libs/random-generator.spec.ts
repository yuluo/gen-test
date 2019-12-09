import { RandomGenerator } from "./random-generator";
import { IRandomGenerator } from "../interfaces";

describe("RandomGenerator", () => {
  let randomGenerator: IRandomGenerator;

  beforeEach(() => {
    randomGenerator = new RandomGenerator();
  });

  test("should return a binary string", () => {
    expect(randomGenerator.randomBinary()).toMatch(/(01)+/);
  });

  test("should return a boolean value", () => {
    expect(typeof randomGenerator.randomBoolean()).toEqual("boolean");
  });

  test("should return a hex string", () => {
    expect(randomGenerator.randomByte()).toMatch(/([0-9][a-f])+/);
  });

  test("should return a random enum", () => {
    let enums = ["enum1", "enum2", "enum3"];
    expect(enums.includes(randomGenerator.randomEnum(enums))).toBe(true);
  });

  test("should return a random integer", () => {
    let randomInteger = randomGenerator.randomInteger(2, 10);
    expect(Number.isInteger(randomInteger)).toBe(true);
    expect(randomInteger >= 2).toBe(true);
    expect(randomInteger < 10).toBe(true);
  });

  test("should return a random number", () => {
    let randomNumber = randomGenerator.randomNumber(2, 10);
    expect(typeof randomNumber).toBe("number");
    expect(randomNumber >= 2).toBe(true);
    expect(randomNumber < 10).toBe(true);
  });
});
