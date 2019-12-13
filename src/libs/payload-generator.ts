import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRandomGenerator, IPayloadGenerator } from "../interfaces";
import { OpenAPIV3 } from "openapi-types";

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

  public generatePayloadTemplate(schemaObject: OpenAPIV3.SchemaObject): any {
    if (schemaObject.type === "object") {
      return this._processNonArraySchemaObject(schemaObject);
    } else if (schemaObject.type === "array") {
      return this._processArraySchemaObject(schemaObject);
    } else if (schemaObject.type === "string") {
      return this._generateStringTemplate(schemaObject);
    } else {
      return this.randomGenerator[typeTemplate[schemaObject.type]].call(
        this.randomGenerator
      );
    }
  }

  private _processArraySchemaObject(schemaObject: OpenAPIV3.ArraySchemaObject) {
    let array = [];
    let arrayItems = schemaObject.items as OpenAPIV3.SchemaObject;
    array.push(this.generatePayloadTemplate(arrayItems));
    return array;
  }

  private _processNonArraySchemaObject(schema: OpenAPIV3.NonArraySchemaObject) {
    let payloadTemplate = {};
    Object.keys(schema.properties).forEach(key => {
      payloadTemplate[key] = this.generatePayloadTemplate(schema.properties[key] as OpenAPIV3.SchemaObject);
    });

    return payloadTemplate;
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
