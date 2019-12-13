import { PayloadGenerator } from "./payload-generator";
import { IPayloadGenerator, IRandomGenerator } from "../interfaces";
import { RandomGenerator } from "./random-generator";
import * as petSchema from "../mocks/pet-schema.json";
import * as userArraySchema from "../mocks/user-array-schema.json";
import { OpenAPIV3 } from "openapi-types";

describe("PayloadGenerator", () => {
  let payloadGenerator: IPayloadGenerator;

  beforeEach(() => {
    let mockRandomGenerator: IRandomGenerator = new RandomGenerator();
    payloadGenerator = new PayloadGenerator(mockRandomGenerator);
  });

  test("should create template based on type", () => {
    const template = payloadGenerator.generatePayloadTemplate(petSchema as OpenAPIV3.SchemaObject);

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
    const template = payloadGenerator.generatePayloadTemplate(userArraySchema as OpenAPIV3.SchemaObject);

    expect(template.payload0.length).toBe(1);
    expect(typeof template.payload0[0].id).toBe("string");
    expect(template.payload0[0].id).toMatch(/([0-9][a-f])+/);
    expect(typeof template.payload0[0].username).toBe("string");
  });
});
