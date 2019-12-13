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
      const template = this.randomGenerator[typeTemplate[schemaObject.type]].call(
        this.randomGenerator
      );
      return {"payload0": template };
    }
  }

  private _processArraySchemaObject(schemaObject: OpenAPIV3.ArraySchemaObject) {
    let payloadTemplate = {
      "payload0": []
    };

    let arrayItems = schemaObject.items as OpenAPIV3.SchemaObject;
    const template = this.generatePayloadTemplate(arrayItems)
    Object.keys(template).forEach(payloadIndex => {
      if(!payloadTemplate[payloadIndex]) {
        payloadTemplate[payloadIndex] = [];
      }

      Object.keys(payloadTemplate).forEach( index => {
        payloadTemplate[index].push(template[payloadIndex]);      
      })
    })


    return payloadTemplate;
  }

  private _processNonArraySchemaObject(schema: OpenAPIV3.NonArraySchemaObject) {
    let payloadTemplate = {
      "payload0": {}
    };
    Object.keys(schema.properties).forEach(key => {
      const template = this.generatePayloadTemplate(schema.properties[key] as OpenAPIV3.SchemaObject);
      Object.keys(template).forEach(payloadIndex => {
        if (!payloadTemplate[payloadIndex]) {
          payloadTemplate[payloadIndex] = {...payloadTemplate.payload0};
        }

        Object.keys(payloadTemplate).forEach( index => {
          payloadTemplate[index][key] = template[payloadIndex];
        })
      })
    });

    return payloadTemplate;
  }

  private _generateStringTemplate(stringProperty) {
    let stringTemplate = {
      "payload0": ""
    };

    if (stringProperty.enum) {
      stringProperty.enum.forEach( (value, index) => {
        stringTemplate[`payload${index}`] = value
      })
    } else if (stringProperty.format) {
      stringTemplate.payload0 = this.randomGenerator[
        typeTemplate.string[stringProperty.format]
      ].call(null);
    } else {
      stringTemplate.payload0 = this.randomGenerator.randomString();
    }

    return stringTemplate;
  }

  /*
  private _processOneOf(tempaltes) {
    console.log("_processOneOf")
    console.log(JSON.stringify(tempaltes))
  }

  private _processAllOf(tempaltes) {
    console.log("_processAllOf")
    console.log(JSON.stringify(tempaltes))
  }
  */
}
