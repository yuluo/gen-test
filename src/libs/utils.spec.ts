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
});
