import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IRandomGenerator, IPayloadGenerator } from "../interfaces";
import { OpenAPIV3 } from "openapi-types";

const typeTemplate = {
  integer: "randomInteger",
  number: "randomNumber",
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
    if (schemaObject.oneOf) {
      console.log(JSON.stringify(schemaObject.oneOf))
      const templates = schemaObject.oneOf.map( schema => {
        return this.generatePayloadTemplate(schema as OpenAPIV3.SchemaObject);
      });
      this._processOneOf(templates);
    } else if (schemaObject.allOf){
      let templates = {};
      schemaObject.allOf.forEach( (schema, index) => {
        templates[`payload${index}`] = this.generatePayloadTemplate(schema as OpenAPIV3.SchemaObject);
      })

      return this._processAllOf(templates);
    } else if (schemaObject.type === "object") {
      return this._processNonArraySchemaObject(schemaObject);
    } else if (schemaObject.type === "array") {
      return this._processArraySchemaObject(schemaObject);
    } else if (schemaObject.type === "string") {
      return this._generateStringTemplate(schemaObject);
    } else if(schemaObject.type === "boolean") {
      return {
        "payload0": true,
        "payload1": false
      };
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

    if (Object.keys(template).length === 1) {
      Object.keys(payloadTemplate).forEach( index => {
        payloadTemplate[index].push(template.payload0);      
      })
    } else {
      Object.keys(template).forEach(payloadIndex => {
        if(!payloadTemplate[payloadIndex]) {
          payloadTemplate[payloadIndex] = [];
        }
        payloadTemplate[payloadIndex].push(template[payloadIndex]);
      })
    }

    return payloadTemplate;
  }

  private _processNonArraySchemaObject(schema: OpenAPIV3.NonArraySchemaObject) {
    let payloadTemplate = {
      "payload0": {}
    };
    Object.keys(schema.properties).forEach(key => {
      const template = this.generatePayloadTemplate(schema.properties[key] as OpenAPIV3.SchemaObject);
      if (Object.keys(template).length === 1) {
        Object.keys(payloadTemplate).forEach( index => {
          payloadTemplate[index][key] = template.payload0;
        })
      } else {
        Object.keys(template).forEach(payloadIndex => {
          if (!payloadTemplate[payloadIndex]) {
            payloadTemplate[payloadIndex] = {...payloadTemplate.payload0};
          }
          payloadTemplate[payloadIndex][key] = template[payloadIndex];
        })
      }
      

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

  
  private _processOneOf(templates) {
    console.log("_processOneOf")
  }

  private _processAllOf(templates) {
    console.log("_processAllOf")
    let templateResult = {
      "payload0": {}
    };

    Object.keys(templates).forEach( templateKey => {
      const template = templates[templateKey];
      const max = Math.max(Object.keys(templateResult).length, Object.keys(template).length);

      for(let i = 0; i < max; i++) {
        let templateIndex = `payload${i}`;

        if(!templateResult[templateIndex]) {
          templateResult[templateIndex] = {...templateResult.payload0};
        }

        if (!template[templateIndex]) {
          templateIndex = "payload0";
        }

        templateResult[`payload${i}`] =  {
          ...templateResult[`payload${i}`],
          ...template[templateIndex]
        };
      }
    })

    return templateResult;
  }
  
}
