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

  public generatePayloadTemplate(schema: OpenAPIV3.SchemaObject): any {
    if (schema.type === "array") {
      return this._processProperty(schema);
    } else {
      return this._processObject(schema as OpenAPIV3.NonArraySchemaObject);
    }
  }

  //TODO: add wrapper function
  private _processObject(schema: OpenAPIV3.NonArraySchemaObject): object {
    let payloadTemplate = {};
    Object.keys(schema.properties).forEach(key => {
      //let type = (schema.properties[key] as OpenAPIV3.SchemaObject).type;
      payloadTemplate[key] = this._processProperty(schema.properties[key] as OpenAPIV3.SchemaObject);
    });

    return payloadTemplate;
  }

  public _processProperty( schemaObject: OpenAPIV3.SchemaObject) {
    if (schemaObject.type === "object") {
      return this._processObject(schemaObject as OpenAPIV3.NonArraySchemaObject);
    } else if (schemaObject.type === "array") {
      let array = [];
      let arrayItems = (schemaObject as OpenAPIV3.ArraySchemaObject).items as OpenAPIV3.SchemaObject;
      array.push(this._processProperty(arrayItems));
      return array;
    } else if (schemaObject.type === "string") {
      return this._generateStringTemplate(schemaObject);
    } else {
      return this.randomGenerator[typeTemplate[schemaObject.type]].call(
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
