import { IPayloadGenerator, IParameterGenerator } from "../interfaces";
import { PayloadGenerator } from "./payload-generator";
import { ParameterGenerator } from "./parameter-generator";
import { mock, instance, when, anything } from "ts-mockito";
import { OpenAPIV3 } from "openapi-types";
import * as petParameter from "../mocks/pet-parameter.json";

describe("ParameterGenerator", () => {
  let parameterGenerator: IParameterGenerator;

  let mockPayloadGenerator: IPayloadGenerator = mock(PayloadGenerator);

  beforeEach(() => {
    parameterGenerator = new ParameterGenerator(instance(mockPayloadGenerator));
    when(mockPayloadGenerator.generatePayloadTemplate(anything())).thenReturn({
      payload0: 1
    });
  });

  test("should generate parameter template", () => {
    const expectedTemplate = 
      {
        petId: {
          in: "path",
          values: [1]
        }
      };

    const template = parameterGenerator.generateParameters(
      petParameter as OpenAPIV3.ParameterObject[],
      {}
    );

    expect(template).toEqual(expectedTemplate);
  });

  test("should use preconfiged parameter template", () => {
    const expectedTemplate = 
      {
        petId: {
          in: "path",
          values: [2]
        }
      };

    const template = parameterGenerator.generateParameters(
      petParameter as OpenAPIV3.ParameterObject[],
      {
        petId: 2
      }
    );

    expect(template).toEqual(expectedTemplate);
  });
});
