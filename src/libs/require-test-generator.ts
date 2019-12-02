const utils = require("./utils");
const pg = require("./payload-generator");
import * as shell from "shelljs";

export function generateTest(endpoint, operation, schema) {
  const hygen = `"./node_modules/.bin/hygen"`;
  const endpointParam = `--endpoint ${endpoint}`;
  const operationParam = `--operation ${operation}`;
  const targetDir = `./generated/${endpoint}/${operation}/require-test`;

  //scaffolding
  const scaffoldingCmd = `${hygen} scaffold new ${endpointParam} ${operationParam} --type require`;
  shell.exec(scaffoldingCmd);

  //generate positive test
  let template = null;
  if (schema.type === "array") {
    template = pg.processProperty("array", schema);
  } else {
    template = pg.generatePayloadTemplate(schema.properties);
  }
  utils.writeFile(
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

      utils.writeFile(
        `${targetDir}/${payloadFile}`,
        JSON.stringify(payload, null, 2)
      );
      const testCaseCmd = `${hygen} require-test new ${endpointParam} ${operationParam} --name ${testName} --datafile ${payloadFile} --codes failCodes`;
      shell.exec(testCaseCmd);
    });
  }
}
