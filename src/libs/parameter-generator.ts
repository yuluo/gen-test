import { OpenAPIV3 } from "openapi-types";
import { IParameterGenerator, IPayloadGenerator } from "../interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class ParameterGenerator implements IParameterGenerator {
  public constructor(
    @inject(TYPES.IPayloadGenerator)
    private payloadGenerator: IPayloadGenerator
  ) {}

  public generateParameters(
    parameters: OpenAPIV3.ParameterObject[],
    preConfigParameter: any
  ) {
    let template = {};
    parameters.forEach(parameter => {
      let values = [];

      if (preConfigParameter[parameter.name]) {
        values.push(preConfigParameter[parameter.name]);
      } else {
        values = Object.values(
          this.payloadGenerator.generatePayloadTemplate(
            parameter.schema as OpenAPIV3.SchemaObject
          )
        );
      }

      template[parameter.name] = {
        in: parameter.in,
        values: values
      };
    });

    return template;
  }
}
