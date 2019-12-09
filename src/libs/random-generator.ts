import * as randomstring from "randomstring";
import { injectable } from "inversify";
import { IRandomGenerator } from "../interfaces";

@injectable()
export class RandomGenerator implements IRandomGenerator {
  public randomBinary() {
    return randomstring.generate({
      charset: "01"
    });
  }

  public randomBoolean() {
    return randomstring.generate().length % 2 === 0;
  }

  public randomByte() {
    return randomstring.generate({
      charset: "hex"
    });
  }

  public randomDatetime() {
    return new Date().toISOString();
  }

  public randomDate() {
    return new Date().toLocaleDateString();
  }

  public randomEnum(enums: string[]) {
    let randomIndex = this.randomInteger(0, enums.length);
    return enums[randomIndex];
  }

  public randomInteger(min = 0, max = 10000) {
    const minFloor = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(this.randomNumber(minFloor, maxFloor)) + minFloor;
  }

  public randomNumber(min = 0, max = 10000) {
    return Math.random() * (max - min) + min;
  }

  public randomString() {
    return randomstring.generate();
  }
}
