import { writeFile } from "fs";

export function writeFileUtil(name, content) {
  writeFile(name, content, "ascii", err => {
    if (err) {
      throw err;
    }
  });
}
