import { PayloadGenerator } from "./payload-generator";
import { IPayloadGenerator, IRandomGenerator, IUtils } from "../interfaces";
import { RandomGenerator } from "./random-generator";
import { OpenAPIV3 } from "openapi-types";
import { Utils } from "./utils";
import * as petSchema from "../mocks/pet-schema.json";
import * as userArraySchema from "../mocks/user-array-schema.json";
import { mock, instance, when } from "ts-mockito";

describe("PayloadGenerator", () => {
  let payloadGenerator: IPayloadGenerator;

  // cannot move to json file, will cause type check fail
  const baseSchema = { 
    "type":"object",
    "required":[ 
       "petType"
    ],
    "properties":{ 
       "petType":{ 
          "type":"string",
          "enum":[ 
             "cat",
             "dog"
          ]
       }
    }
 } as OpenAPIV3.SchemaObject;

  const catSchema = {
    "allOf": [
      baseSchema,
      {
        type: "object",
        properties: {
          pur: {
            type: "string"
          }
        }
      }
    ]
  } as OpenAPIV3.SchemaObject;

  const dogSchema = {
    "allOf": [
      baseSchema,
      {
        type: "object",
        properties: {
          bark: {
            type: "string"
          }
        }
      }
    ]
  } as OpenAPIV3.SchemaObject;

  let createPetSchema: OpenAPIV3.SchemaObject;

  beforeEach(() => {
    let mockRandomGenerator: IRandomGenerator = new RandomGenerator();
    let mockUtils: IUtils = mock(Utils);

    createPetSchema = {
      discriminator: {
        propertyName: "petType"
      },
      oneOf: [
        catSchema,
        dogSchema
      ]
    } as OpenAPIV3.SchemaObject;

    when(mockUtils.getSchemaObject("cat")).thenReturn(catSchema);
    when(mockUtils.getSchemaObject("dog")).thenReturn(dogSchema);
    
    payloadGenerator = new PayloadGenerator(mockRandomGenerator, instance(mockUtils));
  
  });

  test("should create template based on type", () => {
    const template = payloadGenerator.generatePayloadTemplate(
      petSchema as OpenAPIV3.SchemaObject
    );

    expect(typeof template.payload0.id).toBe("number");
    expect(typeof template.payload0.category.id).toBe("number");
    expect(typeof template.payload0.category.name).toBe("string");
    expect(typeof template.payload0.name).toBe("string");
    expect(template.payload0.photoUrls.length).toBe(1);
    expect(template.payload0.tags.length).toBe(1);
    expect(typeof template.payload0.tags[0].id).toBe("number");
    expect(typeof template.payload0.tags[0].name).toBe("string");
    expect(typeof template.payload0.status).toBe("string");
  });

  test("should create template array data", () => {
    const template = payloadGenerator.generatePayloadTemplate(
      userArraySchema as OpenAPIV3.SchemaObject
    );

    expect(template.payload0.length).toBe(1);
    expect(typeof template.payload0[0].id).toBe("string");
    expect(template.payload0[0].id).toMatch(/([0-9][a-f])+/);
    expect(typeof template.payload0[0].username).toBe("string");
  });

  test("should process allOf", () => {
    const template = payloadGenerator.generatePayloadTemplate(createPetSchema);
    
    expect(typeof template.payload0.pur).toBe("string");
    expect(template.payload0.petType).toBe("cat");
    expect(typeof template.payload1.bark).toBe("string");
    expect(template.payload1.petType).toBe("dog");
  });

  test("should process discriminator use mapping", () => {
    createPetSchema.discriminator.mapping = {
      dog: "dog",
      cat: "cat"
    };
    const template = payloadGenerator.generatePayloadTemplate(createPetSchema);
    
    expect(typeof template.payload0.pur).toBe("string");
    expect(template.payload0.petType).toBe("cat");
    expect(typeof template.payload1.bark).toBe("string");
    expect(template.payload1.petType).toBe("dog");
  });
});
