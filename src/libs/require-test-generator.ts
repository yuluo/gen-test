import * as shell from "shelljs";
import {
  IRequireTestGenerator,
  IPayloadGenerator,
  IUtils
} from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { OpenAPIV3 } from "openapi-types";
import * as jsonpath from "jsonpath";

@injectable()
export class RequireTestGenerator implements IRequireTestGenerator {
  public constructor(
    @inject(TYPES.IPayloadGenerator)
    private payloadGenerator: IPayloadGenerator,
    @inject(TYPES.IUtils) private utils: IUtils,
    @inject(TYPES.IParameterGenerator) private parameterGenerator
  ) {}

  public generateTest(
    endpoint: string,
    operation: string,
    schema: OpenAPIV3.SchemaObject,
    parameters = [],
    mediaType = "application/json",
    preConfigParameters = {}
  ) {
    const hygen = `hygen`;
    const endpointParam = `--endpoint ${endpoint}`;
    const operationParam = `--operation ${operation}`;
    const mediaTypeParam = `--mediatype ${mediaType}`;
    const targetDir = `./generated/${endpoint}/${operation}/require-test`;
    let testCounter = 0;

    //scaffolding
    const scaffoldingCmd = `${hygen} scaffold new ${endpointParam} ${operationParam} ${mediaTypeParam} --type require`;
    shell.exec(scaffoldingCmd);

    const parameterTemplates = this.parameterGenerator.generateParameters(
      parameters,
      preConfigParameters);
    this.utils.writeFileUtil(
        `${targetDir}/parameters.json`,
        JSON.stringify(parameterTemplates, null, 2));


    //generate positive test
    let template = this.payloadGenerator.generatePayloadTemplate(schema);

    Object.keys(template).forEach(templateKey => {
      const payloadIndex = `payload-${testCounter}`;
      this.utils.writeFileUtil(
        `${targetDir}/${payloadIndex}.json`,
        JSON.stringify(template[templateKey], null, 2)
      );
      const testCaseCmd = `${hygen} test-case new ${endpointParam} ${operationParam} ${mediaTypeParam} --name positive-${testCounter} --datafile ${payloadIndex}.json --codes successCodes`;
      shell.exec(testCaseCmd);

      testCounter++;
    });

    let requiredSet = new Set();
    const requiredAttributes = jsonpath.query(schema, "$..required");

    requiredAttributes.forEach(requiredAttribute => {
      requiredAttribute.forEach(attribute => {
        requiredSet.add(attribute);
      });
    });

    //generate negative test for-loop
    Array.from(requiredSet.values()).forEach(
      (property: string, index: number) => {
        const payloadFile = `payload-${testCounter}.json`;
        const testName = `"negative-${index} missing ${property}"`;
        let payload = { ...template.payload0 };
        delete payload[property];

        //TODO: refactor to use hygon
        this.utils.writeFileUtil(
          `${targetDir}/${payloadFile}`,
          JSON.stringify(payload, null, 2)
        );
        const testCaseCmd = `${hygen} test-case new ${endpointParam} ${operationParam} ${mediaTypeParam} --name ${testName} --datafile ${payloadFile} --codes failCodes`;
        shell.exec(testCaseCmd);

        testCounter++;
      }
    );
  }
}
