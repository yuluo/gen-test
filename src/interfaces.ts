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
  randomInteger(min, max): number;
  randomNumber(min, max): number;
  randomString(): string;
}

export interface IRequireTestGenerator {
    generateTest(endpoint: string, operation: string, schema: any): void
}

export interface IUtils {
    writeFileUtil(name: string, content: string): void;
}