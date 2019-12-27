import * as shell from "shelljs";
import jsonpath from "jsonpath";
import SwaggerParser from "swagger-parser";
import { APIGatewayEvent, Handler } from "aws-lambda";
import { IUtils, IRequireTestGenerator } from "./interfaces";
import { container } from "../inversify.config";
import { TYPES } from "./types";
import { OpenAPIV3 } from "openapi-types";

export const parseSpec: Handler = async (event: APIGatewayEvent) => {
  const requireTestGenerator = container.get<IRequireTestGenerator>(
    TYPES.IRequireTestGenerator
  );
  const utils = container.get<IUtils>(TYPES.IUtils);

  const apiObject: OpenAPIV3.Document = await SwaggerParser.dereference(event.specUrl);
  const paths = apiObject.paths;
  //const baseUrls = utils.generateBaseUrls(event.specUrl.toString(), apiObject.servers);
  const baseUrls = ["http://localhost:8080/v3"]
  const hygen = `hygen`;
  const testConfigCmd = `${hygen} test-config new --baseurl ${baseUrls[0]}`;

  shell.exec(testConfigCmd);
  utils.setApiDocument(apiObject);
  utils.writeFileUtil(
    "./generated/node_modules/config/pre-config-data.json",
    JSON.stringify(event.preConfigData, null, 2));

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(operation => {
      if (operation === "post") {
        const jsonSchema: OpenAPIV3.SchemaObject = jsonpath.query(
          path[operation],
          "$['requestBody']['content'][*]['schema']"
        )[0];
        console.log(`${operation} ${pathKey}`);
        if (jsonSchema) {
          try {
            requireTestGenerator.generateTest(
              pathKey,
              operation,
              path[operation],
              jsonSchema,
              event.preConfigData.parameters
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    });
  });
};
