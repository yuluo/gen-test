export interface IPayloadGenerator {
  generatePayloadTemplate(properties: object): object;
  processProperty(type: string, processProperty: object): any;
}

export interface IRandomGenerator {
  randomBinary(): string;
  randomBoolean(): boolean;
  randomByte(): string;
  randomDatetime(): string;
  randomDate(): string;
  randomEnum(enums: string[]): string;
  randomInteger(): number;
  randomNumber(): number;
  randomString(): string;
}

export interface IRequireTestGenerator {
    generateTest(endpoint: string, operation: string, schema: object): void
}

export interface IUtils {
    writeFileUtil(name: string, content: string): void;
}