import * as shell from "shelljs";
import jsonpath from "jsonpath";
import SwaggerParser from "swagger-parser";
import { APIGatewayEvent, Handler } from "aws-lambda";
import {IUtils, IRequireTestGenerator} from "./interfaces";
import {container} from "../inversify.config";
import { TYPES } from "./types";


export const parseSpec: Handler = async (event: APIGatewayEvent) => {
  const requireTestGenerator = container.get<IRequireTestGenerator>(TYPES.IRequireTestGenerator);
  const utils = container.get<IUtils>(TYPES.IUtils);

  const apiObject = await SwaggerParser.dereference(event);
  const paths = apiObject.paths;
  const baseUrls = utils.generateBaseUrls(event.toString(), apiObject.servers);
  const hygen = `hygen`; 
  const testConfigCmd = `${hygen} test-config new --baseurl ${baseUrls[0]}`;

  shell.exec(testConfigCmd);

  Object.keys(paths).forEach(pathKey => {
    const path = paths[pathKey];
    Object.keys(path).forEach(key => {
      if (key === "post") {
        const jsonSchema = jsonpath.query(
          path[key],
          "$['requestBody']['content']['application/json']['schema']"
        )[0];
        console.log(`${key} ${pathKey}`);
        if (jsonSchema) {
          //console.log(JSON.stringify(jsonSchema, null, 2));
          //let template = _generatePayloadTemplate(jsonSchema.properties);
          requireTestGenerator.generateTest(pathKey, key, jsonSchema);
        }
      }
    });
  });
};
