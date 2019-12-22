import { Utils } from "./utils";
import { IUtils } from "../interfaces";
import * as fs from "fs";
import * as petApiDocument from "../mocks/openapi-pet.json";
import * as petSchema from "../mocks/openapi-pet-petschema.json";
import { OpenAPIV3 } from "openapi-types";

describe("Utils", () => {
  let utils: IUtils;
  let writeFileSpy;

  beforeEach(() => {
    utils = new Utils();
    writeFileSpy = spyOn(fs, "writeFile");
    utils.setApiDocument(petApiDocument as OpenAPIV3.Document);
  });

  test("should call writeFile", () => {
    let filename = "test.json";
    let content = "test";

    utils.writeFileUtil(filename, content);

    expect(writeFileSpy).toHaveBeenCalled();
  });

  test("should construct base urls using relative path", () => {
    const expectedBaseUrls = ["http://localhost:8080/v3"];
    const url = "http://localhost:8080/swagger/openapi.json";
    const servers = [
      {
        url: "/v3"
      }
    ];

    const baseUrls = utils.generateBaseUrls(url, servers);

    expect(baseUrls).toEqual(expectedBaseUrls);
  });

  test("should construct base urls using absolute path", () => {
    const expectedBaseUrls = ["http://localhost:8080/root"];
    const url = "http://localhost:8080/openapi.json";
    const servers = [
      {
        url: "http://localhost:8080/root"
      }
    ];

    const baseUrls = utils.generateBaseUrls(url, servers);

    expect(baseUrls).toEqual(expectedBaseUrls);
  });

  test("should retrieve schemaObject using schemaName", () => {
    const schemObejct = utils.getSchemaObject("Pet");

    expect(schemObejct).toEqual(petSchema);
  });

  test("should retrieve schemaObject using ref name", () => {
    const schemObejct = utils.getSchemaObject("#/components/schemas/Pet");

    expect(schemObejct).toEqual(petSchema);
  });
});
