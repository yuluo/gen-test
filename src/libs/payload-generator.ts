import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRandomGenerator, IPayloadGenerator } from "../interfaces";

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

@injectable()
export class PayloadGenerator implements IPayloadGenerator {
  public constructor(
    @inject(TYPES.IRandomGenerator) private randomGenerator: IRandomGenerator
  ) {}

  //TODO: add wrapper function
  public generatePayloadTemplate(properties: object): object {
    let payloadTemplate = {};
    Object.keys(properties).forEach(key => {
      let type = properties[key].type;
      payloadTemplate[key] = this.processProperty(type, properties[key]);
    });

    return payloadTemplate;
  }

  public processProperty(type, property) {
    if (type === "object") {
      return this.generatePayloadTemplate(property.properties);
    } else if (type === "array") {
      let array = [];
      array.push(this.processProperty(property.items.type, property.items));
      return array;
    } else if (type === "string") {
      return this._generateStringTemplate(property);
    } else {
      return this.randomGenerator[typeTemplate[type]].call(
        this.randomGenerator
      );
    }
  }

  private _generateStringTemplate(stringProperty) {
    let stringTemplate = "";
    if (stringProperty.enum) {
      stringTemplate = this.randomGenerator.randomEnum(stringProperty.enum);
    } else if (stringProperty.format) {
      stringTemplate = this.randomGenerator[
        typeTemplate.string[stringProperty.format]
      ].call(null);
    } else {
      stringTemplate = this.randomGenerator.randomString();
    }

    return stringTemplate;
  }
}
