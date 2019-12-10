import * as shell from "shelljs";
import { mock, anything, when, instance, verify } from "ts-mockito";
import {
  IRequireTestGenerator,
  IPayloadGenerator,
  IUtils
} from "../interfaces";
import { RequireTestGenerator } from "./require-test-generator";
import * as petSchema from "../mocks/pet-schema.json";
import * as petTemplate from "../mocks/pet-template.json";
import { PayloadGenerator } from "./payload-generator";
import { Utils } from "./utils";

describe("RequireTestGenerator", () => {
  let requireTestGenerator: IRequireTestGenerator;
  let mockPayloadGenerator: IPayloadGenerator;
  let mockUtils: IUtils;
  let execSpy;

  beforeEach(() => {
    execSpy = spyOn(shell, "exec");
    mockPayloadGenerator = mock(PayloadGenerator);
    mockUtils = mock(Utils);

    when(mockPayloadGenerator.generatePayloadTemplate(anything())).thenReturn(
      petTemplate
    );

    requireTestGenerator = new RequireTestGenerator(
      instance(mockPayloadGenerator),
      instance(mockUtils)
    );
  });

  test("should run scaffold template", () => {
    const expectedCmd =
      "hygen scaffold new --endpoint /pet --operation post --type require";

    requireTestGenerator.generateTest("/pet", "post", petSchema);
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should run positive test template", () => {
    const expectedCmd =
      "hygen require-test new --endpoint /pet --operation post --name positive --datafile payload-1.json --codes successCodes";

    requireTestGenerator.generateTest("/pet", "post", petSchema);
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should run positive test template", () => {
    const expectedCmd =
      'hygen require-test new --endpoint /pet --operation post --name "negative-0 missing name" --datafile payload-2.json --codes failCodes';

    requireTestGenerator.generateTest("/pet", "post", petSchema);
    expect(execSpy).toHaveBeenCalledWith(expectedCmd);
  });

  test("should write positive payload", () => {
    const expectedPath = "./generated//pet/post/require-test/payload-1.json";
    const expectedPayloadString = JSON.stringify(petTemplate, null, 2);

    requireTestGenerator.generateTest("/pet", "post", petSchema);

    verify(
      mockUtils.writeFileUtil(expectedPath, expectedPayloadString)
    ).called();
  });
});
