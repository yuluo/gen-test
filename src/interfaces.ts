import { OpenAPIV3 } from "openapi-types";

export interface IPayloadGenerator {
  generatePayloadTemplate(schema: OpenAPIV3.SchemaObject): any;
}

export interface IParameterGenerator {
  generateParameters(parameters: OpenAPIV3.ParameterObject[], preConfigParameter: any);
}

export interface IRandomGenerator {
  randomBinary(): string;
  randomBoolean(): boolean;
  randomByte(): string;
  randomDatetime(): string;
  randomDate(): string;
  randomEnum(enums: string[]): string;
  randomInteger(min?: number, max?: number): number;
  randomNumber(min?: number, max?: number): number;
  randomString(): string;
}

export interface IRequireTestGenerator {
  generateTest(
    endpoint: string,
    operation: string,
    schema: OpenAPIV3.SchemaObject,
    mediaType?: string
  ): void;
}

export interface IUtils {
  writeFileUtil(name: string, content: string): void;
  generateBaseUrls(url: string, servers: any): string[];
  setApiDocument(apiDocument: OpenAPIV3.Document): void;
  getSchemaObject(schemaName: string): OpenAPIV3.SchemaObject;
}
