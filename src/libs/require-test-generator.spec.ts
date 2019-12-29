import * as shell from "shelljs";
import { mock, anything, when, instance, verify, resetCalls } from "ts-mockito";
import {
  IRequireTestGenerator,
  IPayloadGenerator,
  IUtils,
  IParameterGenerator
} from "../interfaces";
import { RequireTestGenerator } from "./require-test-generator";
import * as createPet from "../mocks/openapi-create-pet.json";
import * as petTemplate from "../mocks/pet-template.json";
import { PayloadGenerator } from "./payload-generator";
import { Utils } from "./utils";
import { OpenAPIV3 } from "openapi-types";
import { ParameterGenerator } from "./parameter-generator";

describe("RequireTestGenerator", () => {
  const mockParameter = {
    petId: {
      in: "path",
      values: [1]
    }
  };
  let requireTestGenerator: IRequireTestGenerator;
  let mockPayloadGenerator: IPayloadGenerator;
  let mockUtils: IUtils;
  let mockParameterGenerator: IParameterGenerator;
  let execSpy;

  beforeEach(() => {
    execSpy = spyOn(shell, "exec");
    mockPayloadGenerator = mock(PayloadGenerator);
    mockUtils = mock(Utils);
    mockParameterGenerator = mock(ParameterGenerator);

    when(mockPayloadGenerator.generatePayloadTemplate(anything())).thenReturn({
      payload0: petTemplate
    });
    when(
      mockParameterGenerator.generateParameters(anything(), anything())
    ).thenReturn(mockParameter);

    requireTestGenerator = new RequireTestGenerator(
      instance(mockPayloadGenerator),
      instance(mockUtils),
      instance(mockParameterGenerator)
    );
  });

  afterEach(() => {
    resetCalls(mockUtils);
  });

  test("should run scaffold template", () => {
    const expectedCmd =
      "hygen scaffold new --endpoint /pet --operation post --mediatype application/x-www-form-urlencoded";

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      createPet as OpenAPIV3.OperationObject
    );
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should run positive test template", () => {
    const expectedCmd =
      "hygen test-case new --endpoint /pet --operation post --mediatype application/x-www-form-urlencoded --name positive-0 --testcounter 0 --codes successCodes";

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      createPet as OpenAPIV3.OperationObject
    );
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should run negative test template", () => {
    const expectedCmd = `hygen test-case new --endpoint /pet --operation post --mediatype application/x-www-form-urlencoded --name "negative-0 missing name" --testcounter 1 --codes failCodes`;

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      createPet as OpenAPIV3.OperationObject
    );
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should write positive payload", () => {
    const expectedPath = "./generated//pet/post/payload-0.json";
    const expectedPayloadString = JSON.stringify(petTemplate, null, 2);

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      createPet as OpenAPIV3.OperationObject
    );

    verify(
      mockUtils.writeFileUtil(expectedPath, expectedPayloadString)
    ).called();
  });

  test("should skip mediaTypeParam when requestBody not exist", () => {
    const expectedCmd = "hygen scaffold new --endpoint /pet --operation post ";
    let petOperation = { ...createPet } as OpenAPIV3.OperationObject;
    delete petOperation.requestBody;

    requireTestGenerator.generateTest("/pet", "post", petOperation);

    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should write parameters template", () => {
    const expectedPath = "./generated//pet/post/parameters.json";
    const expectedParameterString = JSON.stringify(mockParameter, null, 2);

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      createPet as OpenAPIV3.OperationObject
    );

    verify(
      mockUtils.writeFileUtil(expectedPath, expectedParameterString)
    ).called();
  });

  test("should write empty parameters template", () => {
    const expectedPath = "./generated//pet/post/parameters.json";
    const expectedParameterString = JSON.stringify({}, null, 2);
    const petOperation = { ...createPet };
    delete petOperation.parameters;

    requireTestGenerator.generateTest(
      "/pet",
      "post",
      petOperation as OpenAPIV3.OperationObject
    );

    verify(
      mockUtils.writeFileUtil(expectedPath, expectedParameterString)
    ).called();
  });
});
