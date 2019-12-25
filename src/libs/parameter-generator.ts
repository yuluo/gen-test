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

    public generateParameters(parameters: OpenAPIV3.ParameterObject[]) {
        const parameterTemplate = parameters.map( parameter => {
            let template = {};
            const values = Object.values(this.payloadGenerator.generatePayloadTemplate(
                parameter.schema as OpenAPIV3.SchemaObject));

            template[parameter.name] = {
                "in": parameter.in,
                "values": values
            };
            
            return template;
        });

        return parameterTemplate;
    }
}