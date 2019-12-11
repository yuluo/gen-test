import { Utils } from "./utils";
import { IUtils } from "../interfaces";
import * as fs from "fs";

describe("Utils", () => {
  let utils: IUtils;
  let writeFileSpy;

  beforeEach(() => {
    utils = new Utils();
    writeFileSpy = spyOn(fs, "writeFile");
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
        "url": "/v3"
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
        "url": "http://localhost:8080/root"
      }
    ];
    
    const baseUrls = utils.generateBaseUrls(url, servers);

    expect(baseUrls).toEqual(expectedBaseUrls);
  });
});
