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

  public generateBaseUrls(url, servers): string[] {
    const urlArray = url.split("/");
    const rootUrl = urlArray.slice(0, 3).join("/");
    const baseUrls = servers.map(server => {
      var absolutePattern = /^https?:\/\//i;
      if (absolutePattern.test(server.url)) {
        return server.url;
      } else {
        return rootUrl + server.url;
      }
    });

    return baseUrls
  }
  
}
