const utils = require("./utils");
const pg = require("./payload-generator");
const shell = require("shelljs");

function generateTest(endpoint, operation, schema) {
    const hygen = `"./node_modules/.bin/hygen"`;
    const endpointParam = `--endpoint ${endpoint}`;
    const operationParam = `--operation ${operation}`;
    const targetDir = `./generated/${endpoint}/${operation}/require-test`;    

  //scaffolding
  const scaffoldingCmd = `${hygen} scaffold new ${endpointParam} ${operationParam} --type require`;
  shell.exec(scaffoldingCmd);

  //generate positive test
  let template = pg.generatePayloadTemplate(schema.properties);
  utils.writeFile(
    `${targetDir}/payload-1.json`,
    JSON.stringify(template, null, 2)
  );
  const testCaseCmd = `${hygen} require-test new ${endpointParam} ${operationParam} --name positive --datafile payload-1.json --codes successCodes`;
  shell.exec(testCaseCmd);

  //generate negative test for-loop
}

module.exports = {
  generateTest
};
