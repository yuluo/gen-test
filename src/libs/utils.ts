import { writeFile } from "fs";
import { IUtils } from "../interfaces";
import { injectable } from "inversify";

@injectable()
export class Utils implements IUtils {
  public writeFileUtil(name, content) {
    writeFile(name, content, "ascii", err => {
      if (err) {
        throw err;
      }
    });
  }
}
