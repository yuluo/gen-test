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

  const apiObject: OpenAPIV3.Document = await SwaggerParser.dereference(event);
  const paths = apiObject.paths;
  const baseUrls = utils.generateBaseUrls(event.toString(), apiObject.servers);
  //const baseUrls = ["http://localhost:8080/"]
  const hygen = `hygen`;
  const testConfigCmd = `${hygen} test-config new --baseurl ${baseUrls[0]}`;

  shell.exec(testConfigCmd);
  utils.setApiDocument(apiObject);

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(key => {
      if (key === "post") {
        const jsonSchema: OpenAPIV3.SchemaObject = jsonpath.query(
          path[key],
          "$['requestBody']['content'][*]['schema']"
        )[0];
        console.log(`${key} ${pathKey}`);
        if (jsonSchema) {
          try {
            const requestBody: OpenAPIV3.RequestBodyObject =path[key].requestBody as OpenAPIV3.RequestBodyObject;
            const mediaType = Object.keys(requestBody.content)[0];
            requireTestGenerator.generateTest(pathKey, key, jsonSchema, mediaType);
          } catch (error) {
            console.error(error);
          }
        }
      }
    });
  });
};
