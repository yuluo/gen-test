import { PayloadGenerator } from "./payload-generator";
import { IPayloadGenerator, IRandomGenerator } from "../interfaces";
import { RandomGenerator } from "./random-generator";
import * as petSchema from "../mocks/pet-schema.json";
import * as userArraySchema from "../mocks/user-array-schema.json";

describe("PayloadGenerator", () => {
  let payloadGenerator: IPayloadGenerator;

  beforeEach(() => {
    //let mockRandomGenerator: IRandomGenerator = mock(RandomGenerator);
    let mockRandomGenerator: IRandomGenerator = new RandomGenerator();
    payloadGenerator = new PayloadGenerator(mockRandomGenerator);
  });

  test("should create template based on type", () => {
    const template = payloadGenerator.generatePayloadTemplate(petSchema);

    expect(typeof template.id).toBe("number");
    expect(typeof template.category.id).toBe("number");
    expect(typeof template.category.name).toBe("string");
    expect(typeof template.name).toBe("string");
    expect(template.photoUrls.length).toBe(1);
    expect(template.tags.length).toBe(1);
    expect(typeof template.tags[0].id).toBe("number");
    expect(typeof template.tags[0].name).toBe("string");
    expect(typeof template.status).toBe("string");
  });

  test("should create template array data", () => {
    const template = payloadGenerator.generatePayloadTemplate(userArraySchema);

    expect(template.length).toBe(1);
    expect(typeof template[0].id).toBe("string");
    expect(template[0].id).toMatch(/([0-9][a-f])+/);
    expect(typeof template[0].username).toBe("string");
  });
});
