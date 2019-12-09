import * as shell from "shelljs";
import {
  IRequireTestGenerator,
  IPayloadGenerator,
  IUtils
} from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class RequireTestGenerator implements IRequireTestGenerator {
  public constructor(
    @inject(TYPES.IPayloadGenerator)
    private payloadGenerator: IPayloadGenerator,
    @inject(TYPES.IUtils) private utils: IUtils
  ) {}

  public generateTest(endpoint: string, operation: string, schema: object) {
    const hygen = `hygen`;
    const endpointParam = `--endpoint ${endpoint}`;
    const operationParam = `--operation ${operation}`;
    const targetDir = `./generated/${endpoint}/${operation}/require-test`;

    //scaffolding
    const scaffoldingCmd = `${hygen} scaffold new ${endpointParam} ${operationParam} --type require`;
    shell.exec(scaffoldingCmd);

    //generate positive test
    let template = null;
    if (schema.type === "array") {
      template = this.payloadGenerator.processProperty("array", schema);
    } else {
      template = this.payloadGenerator.generatePayloadTemplate(
        schema.properties
      );
    }
    this.utils.writeFileUtil(
      `${targetDir}/payload-1.json`,
      JSON.stringify(template, null, 2)
    );
    const testCaseCmd = `${hygen} require-test new ${endpointParam} ${operationParam} --name positive --datafile payload-1.json --codes successCodes`;
    shell.exec(testCaseCmd);

    //generate negative test for-loop
    if (schema.required) {
      schema.required.forEach((property, index) => {
        const payloadFile = `payload-${index + 2}.json`;
        const testName = `"negative-${index} missing ${property}"`;
        let payload = { ...template };
        delete payload[property];

        //TODO: refactor to use hygon
        this.utils.writeFileUtil(
          `${targetDir}/${payloadFile}`,
          JSON.stringify(payload, null, 2)
        );
        const testCaseCmd = `${hygen} require-test new ${endpointParam} ${operationParam} --name ${testName} --datafile ${payloadFile} --codes failCodes`;
        shell.exec(testCaseCmd);
      });
    }
  }
}
