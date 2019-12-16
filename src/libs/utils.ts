import { writeFile } from "fs";
import { IUtils } from "../interfaces";
import { injectable } from "inversify";
import { OpenAPIV3 } from "openapi-types";
import * as jsonpath from "jsonpath";

@injectable()
export class Utils implements IUtils {
  apiDocument: OpenAPIV3.Document;

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

  public setApiDocument(apiDocument: OpenAPIV3.Document): void {
    this.apiDocument = apiDocument;
  }
  
  public getSchemaObject(schemaName: string): OpenAPIV3.SchemaObject {
    let query = schemaName;
    if(query.includes("#")) {
      query = query.replace("#", "$");
      query =  query.split("/").join(".");
    } else {
      query = `$.components.schemas.${query}`;
    }
    
    const schemaObject: OpenAPIV3.SchemaObject = jsonpath.query(this.apiDocument, query)[0];
    return schemaObject;
  }

}
