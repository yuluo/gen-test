const utils = require("./utils");
const pg = require("./payload-generator");
const shell = require("shelljs");

function generateTest(endpoint, operation, schema) {
  //scaffolding
  const scaffoldingCmd = `"./node_modules/.bin/hygen" scaffold new --endpoint ${endpoint} --operation ${operation}  --type require`;
  shell.exec(scaffoldingCmd);

  //generate positive test
  let template = pg.generatePayloadTemplate(schema.properties);
  utils.writeFile(
    `./generated/${endpoint}/${operation}/require-test/payload-1.json`,
    JSON.stringify(template, null, 2)
  );
  const testCaseCmd = `"./node_modules/.bin/hygen" require-test new --endpoint ${endpoint} --operation ${operation}  --name positive --datafile payload-1.json --codes successCodes`;
  shell.exec(testCaseCmd);

  //generate negative test for-loop
}

module.exports = {
  generateTest
};
